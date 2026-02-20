import {
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  type S3Client,
} from "@aws-sdk/client-s3";
import type { SpoonacularResponse } from "../utils/spoonacular-response.js";
import { NotFoundError } from "../errors/not-found-error.js";

export interface IStorageService {
  uploadPage(page: number, data: SpoonacularResponse): Promise<void>;
  getPage(page: number): Promise<SpoonacularResponse>;
  listPages(): Promise<number[]>;
}

export class S3StorageService implements IStorageService {
  constructor(
    private readonly client: S3Client,
    private readonly bucket: string,
  ) {}

  private getPageKey(page: number): string {
    return `pages/page-${page.toString().padStart(4, "0")}.json`;
  }

  private getPageFromKey(key: string): number {
    const match = key.match(/pages\/page-(\d{4})\.json$/);
    if (!match || !match[1]) {
      throw new Error(`Invalid key format: ${key}`);
    }
    return parseInt(match[1], 10);
  }

  async uploadPage(page: number, data: SpoonacularResponse): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.getPageKey(page),
        Body: JSON.stringify(data),
        ContentType: "application/json",
      }),
    );
  }

  async getPage(page: number): Promise<SpoonacularResponse> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: this.getPageKey(page),
      }),
    );

    const content = await response.Body?.transformToString();
    if (!content) {
      throw new NotFoundError(`Page ${page} not found in storage`);
    }

    return JSON.parse(content) as SpoonacularResponse;
  }

  async listPages(): Promise<number[]> {
    const response = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
      }),
    );
    const keys =
      response.Contents?.map((item) => item.Key!).filter(Boolean) || [];
    return keys.map((key) => this.getPageFromKey(key));
  }
}
