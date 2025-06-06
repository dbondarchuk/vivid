import { MigrationInterface } from "mongo-migrate-ts";
import { Db, IndexDirection, MongoClient } from "mongodb";

const indexes: Record<string, Record<string, IndexDirection>> = {
  appointments: {
    customerId: -1,
    status: 1,
    createdAt: -1,
    dateTime: -1,
  },
  "communication-logs": {
    customerId: -1,
    appointmentId: -1,
    dateTime: -1,
  },
  configuration: {
    key: -1,
  },
  assets: {
    uploadedAt: -1,
    fileName: "text",
  },
  customers: {
    email: -1,
    phone: -1,
  },
  pages: {
    slug: -1,
  },
};

export class Migration1749236072518 implements MigrationInterface {
  public async up(db: Db, client: MongoClient): Promise<void | never> {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        for (const [collectionName, values] of Object.entries(indexes)) {
          const collection = await db.createCollection(collectionName);
          for (const [key, dir] of Object.entries(values)) {
            await collection.createIndex(
              {
                [key]: dir,
              },
              { name: key }
            );
          }
        }
      });
    } finally {
      await session.endSession();
    }
  }

  public async down(db: Db, client: MongoClient): Promise<void | never> {
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        for (const [collectionName, values] of Object.entries(indexes)) {
          const collection = await db.createCollection(collectionName);
          for (const key of Object.keys(values)) {
            await collection.dropIndex(key);
          }
        }
      });
    } finally {
      await session.endSession();
    }
  }
}
