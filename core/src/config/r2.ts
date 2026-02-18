import { S3Client } from "@aws-sdk/client-s3";

export function createR2Client(
  accountId: string,
  accessKeyId: string,
  secretAccessKey: string,
): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
}
