import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import passport from 'passport';
import { configurePassport, authMiddleware } from '@mes-system/server-auth';

import { TenantConnectionManager } from '@mes-system/database';
import {
  inventoryTypeDefs,
  inventoryResolvers,
  ProductRepository,
  CategoryRepository,
  ProductVariantRepository,
  UnitOfMeasureRepository,
  ProductVariantAttributeRepository,
  ProductService,
  CategoryService,
  ProductVariantService,
  UnitOfMeasureService,
  ProductVariantAttributeService,
  GraphQLContext,
} from '@mes-system/inventory';

async function bootstrap() {
  const host = process.env['HOST'] ?? 'localhost';
  const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

  const app = express();

  // ---------------------------------------------------------------------------
  // GraphQL Schema
  // ---------------------------------------------------------------------------
  const schema = makeExecutableSchema({
    typeDefs: inventoryTypeDefs,
    resolvers: inventoryResolvers,
  });

  const apolloServer = new ApolloServer<GraphQLContext>({
    schema,
    introspection: true,
  });
  await apolloServer.start();

  // ---------------------------------------------------------------------------
  // Express Middleware
  // ---------------------------------------------------------------------------
  app.use(express.json());

  configurePassport();
  app.use(passport.initialize());

  app.get('/', (_req, res) => {
    res.send({ message: 'MES System API', graphql: '/graphql' });
  });

  app.use(
    '/graphql',
    authMiddleware,
    expressMiddleware(apolloServer, {
      context: async ({ req }): Promise<GraphQLContext> => {
        // Extract multi-tenancy tracking from request headers
        const tenantId = req.headers['x-tenant-id'] as string;
        const user = (req as any).user;
        const userId = user?.sub || (req.headers['x-user-id'] as string);
        const roles = user?.realm_access?.roles || [];

        // Bypass header requirements for Apollo Sandbox Introspection queries
        if (req.body?.operationName === 'IntrospectionQuery') {
          return {} as GraphQLContext;
        }

        if (!tenantId || !userId) {
          throw new GraphQLError(
            'Missing x-tenant-id or valid authentication',
            {
              extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
            },
          );
        }

        // Get the specific database connection for this tenant
        const db = await TenantConnectionManager.getDbForTenant(tenantId);

        // Instantiate Repositories strictly scoped to this request's tenant
        const productRepo = new ProductRepository(db, tenantId, userId);
        const categoryRepo = new CategoryRepository(db, tenantId, userId);
        const variantRepo = new ProductVariantRepository(db, tenantId, userId);
        const uomRepo = new UnitOfMeasureRepository(db, tenantId, userId);
        const variantAttrRepo = new ProductVariantAttributeRepository(
          db,
          tenantId,
          userId,
        );

        // Instantiate Services for this request
        const productService = new ProductService(productRepo, categoryRepo);
        const categoryService = new CategoryService(categoryRepo);
        const productVariantService = new ProductVariantService(
          variantRepo,
          productRepo,
          uomRepo,
        );
        const unitOfMeasureService = new UnitOfMeasureService(uomRepo);
        const productVariantAttributeService =
          new ProductVariantAttributeService(variantAttrRepo);

        return {
          tenantId,
          userId,
          roles,
          services: {
            productService,
            categoryService,
            productVariantService,
            unitOfMeasureService,
            productVariantAttributeService,
          },
        };
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Start Server
  // ---------------------------------------------------------------------------
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
    console.log(`[ graphql ] http://${host}:${port}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
