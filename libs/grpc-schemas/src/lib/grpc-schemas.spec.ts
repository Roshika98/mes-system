import { grpcSchemas } from './grpc-schemas';

describe('grpcSchemas', () => {
  it('should work', () => {
    expect(grpcSchemas()).toEqual('grpc-schemas');
  });
});
