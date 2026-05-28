import { config } from "dotenv";
config({ path: ".env.local" });

import {
  S3Client,
  PutBucketCorsCommand,
  GetBucketCorsCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const Bucket = process.env.R2_BUCKET;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

try {
  await client.send(
    new PutBucketCorsCommand({
      Bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: allowedOrigins,
            AllowedMethods: ["PUT", "GET", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );
  const got = await client.send(new GetBucketCorsCommand({ Bucket }));
  console.log("CORS_SET_OK");
  console.log(JSON.stringify(got.CORSRules));
} catch (err) {
  console.log("CORS_SET_FAILED");
  console.log(err?.name, "-", err?.message);
}
