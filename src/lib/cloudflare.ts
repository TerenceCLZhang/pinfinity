import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT ?? "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY ?? "",
  },
});

export const putCommand = async (file: File, key: string) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const putObjectCommand = new PutObjectCommand({
    Bucket: "pinfinity",
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await r2.send(putObjectCommand);
    return {
      success: true,
      url: `${process.env.IMG_URL}/${key}`,
    };
  } catch {
    return { success: false };
  }
};

export const deleteCommand = async (key: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: "pinfinity",
    Key: key,
  });

  try {
    await r2.send(deleteCommand);
    return { success: true };
  } catch {
    return { success: false };
  }
};
