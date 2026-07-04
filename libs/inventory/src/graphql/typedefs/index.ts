import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

/**
 * Base schema that defines the root Query and Mutation types.
 * Required because the domain SDL files use `extend type Query/Mutation`.
 */
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

/**
 * Loads a .graphql file from the typedefs directory and parses it
 * into a DocumentNode.
 */
function loadGraphqlFile(filename: string): DocumentNode {
  const filePath = join(__dirname, filename);
  const content = readFileSync(filePath, 'utf-8');
  return gql`
    ${content}
  `;
}

/**
 * All inventory module type definitions, ready to be merged
 * into the executable schema.
 */
export const inventoryTypeDefs: DocumentNode[] = [
  baseTypeDefs,
  loadGraphqlFile('category.graphql'),
  loadGraphqlFile('unit-of-measure.graphql'),
  loadGraphqlFile('product.graphql'),
  loadGraphqlFile('product-variant.graphql'),
];
