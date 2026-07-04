import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { getDb } from '@mes-system/database';
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
  // Database
  // ---------------------------------------------------------------------------
  const db = getDb();

  // ---------------------------------------------------------------------------
  // Repositories
  // ---------------------------------------------------------------------------
  const productRepo = new ProductRepository(db);
  const categoryRepo = new CategoryRepository(db);
  const variantRepo = new ProductVariantRepository(db);
  const uomRepo = new UnitOfMeasureRepository(db);
  const variantAttrRepo = new ProductVariantAttributeRepository(db);

  // ---------------------------------------------------------------------------
  // Services
  // ---------------------------------------------------------------------------
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
      context: async (): Promise<GraphQLContext> => ({
        services: {
          productService,
          categoryService,
          productVariantService,
          unitOfMeasureService,
          productVariantAttributeService,
        },
      }),
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
