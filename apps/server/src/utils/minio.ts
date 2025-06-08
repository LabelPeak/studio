import * as Minio from "minio";

import { ServerConfigException } from "./exception.ts";

const MINIO_ENV = {
  endPoint: "localhost",
  port: 9000,
  accessKey: process.env.MINIO_USER_ACCESS_KEY,
  secretKey: process.env.MINIO_USER_SECRET_KEY,
  bucket: process.env.DATASET_BUCKET
};

if (!MINIO_ENV.accessKey || !MINIO_ENV.secretKey) {
  throw new ServerConfigException("MINIO_USER_ACCESS_KEY or MINIO_USER_SECRET_KEY is not set");
}

const minioClient = new Minio.Client({
  endPoint: MINIO_ENV.endPoint,
  port: MINIO_ENV.port,
  useSSL: false,
  accessKey: MINIO_ENV.accessKey,
  secretKey: MINIO_ENV.secretKey
});

const bucket = MINIO_ENV.bucket ?? "";

const exists = await minioClient.bucketExists(bucket);
if (!exists) {
  await minioClient.makeBucket(bucket, Minio.DEFAULT_REGION);
  console.info(`Bucket ${bucket} created.`);
}

export async function storeFile(file: File, fileName: string) {
  const arrayBuffer = await file.arrayBuffer();

  return await storeFileFromBuffer(Buffer.from(arrayBuffer), fileName, file.type);
}

export async function storeFileFromBuffer(buffer: Buffer, fileName: string, fileType?: string) {
  await minioClient.putObject(bucket, fileName, buffer, undefined, {
    "Content-Type": fileType ?? "application/octet-stream"
  });

  return `http://${MINIO_ENV.endPoint}:${MINIO_ENV.port}/${MINIO_ENV.bucket}/${fileName}`;
}
