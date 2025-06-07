const indexes = {
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

module.exports = {
  async up(db, client) {
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
  },

  async down(db, client) {
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
  },
};
