delete process.env.http_proxy;
delete process.env.HTTP_PROXY;
delete process.env.https_proxy;
delete process.env.HTTPS_PROXY;

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const protoFiles = require('google-proto-files');
const fs = require("fs");

const cfgPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

const PROTO_PATH = path.join(__dirname, 'proto/service.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
        path.dirname(PROTO_PATH),
        path.dirname(protoFiles.getProtoPath('google/protobuf/struct.proto'))
    ]
});

const protoPackage = grpc.loadPackageDefinition(packageDef).proto;

const client = new protoPackage.DataService(
    config.CoreURL,
    grpc.credentials.createInsecure()
);

module.exports = client;
