import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';

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

  const apolloServer = new ApolloServer<GraphQLContext>({ schema });
  await apolloServer.start();

  // ---------------------------------------------------------------------------
  // Express Middleware
  // ---------------------------------------------------------------------------
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.send({ message: 'MES System API', graphql: '/graphql' });
  });

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }): Promise<GraphQLContext> => {
        // Extract multi-tenancy tracking from request headers
        const tenantId = req.headers['x-tenant-id'] as string;
        const userId = req.headers['x-user-id'] as string;

        if (!tenantId || !userId) {
          throw new Error('Missing x-tenant-id or x-user-id header');
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
          userId
        );

        // Instantiate Services for this request
        const productService = new ProductService(productRepo, categoryRepo);
        const categoryService = new CategoryService(categoryRepo);
        const productVariantService = new ProductVariantService(
          variantRepo,
          productRepo,
          uomRepo
        );
        const unitOfMeasureService = new UnitOfMeasureService(uomRepo);
        const productVariantAttributeService =
          new ProductVariantAttributeService(variantAttrRepo);

        return {
          tenantId,
          userId,
          services: {
            productService,
            categoryService,
            productVariantService,
            unitOfMeasureService,
            productVariantAttributeService,
          },
        };
      },
    })
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
