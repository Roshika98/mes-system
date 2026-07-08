import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function getProtoFiles(dir) {
  const files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getProtoFiles(fullPath));
    } else if (fullPath.endsWith('.proto')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getProtoFiles('libs/grpc-schemas/src/proto').join(' ');
const pluginExt = process.platform === 'win32' ? '.cmd' : '';
const pluginPath = path.resolve('node_modules', '.bin', `protoc-gen-ts_proto${pluginExt}`);

// Using ts-proto with gRPC service output and native Node.js types
const cmd = `protoc --plugin=protoc-gen-ts_proto="${pluginPath}" --ts_proto_out=./libs/grpc-schemas/src/lib --ts_proto_opt=env=node,outputServices=grpc-js,esModuleInterop=true -I=./libs/grpc-schemas/src/proto ${files}`;

console.log('Compiling proto files...');
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Protobuf schemas compiled successfully!');
} catch (error) {
  console.error('\nFailed to compile schemas. Do you have the `protoc` compiler installed on your system?');
  process.exit(1);
}
