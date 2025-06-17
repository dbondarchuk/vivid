module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const apps = await db.createCollection("connected-apps");
        await apps.updateMany(
          {
            name: "google-calendar",
          },
          [
            {
              $set: {
                token: "$data",
              },
            },
            {
              $unset: ["data"],
            },
          ]
        );

        await apps.updateMany(
          {
            name: "outlook",
          },
          [
            {
              $set: {
                token: "$data",
              },
            },
            {
              $unset: ["data"],
            },
          ]
        );
      });
    } finally {
      await session.endSession();
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const apps = await db.createCollection("connected-apps");
        await apps.updateMany(
          {
            name: "google-calendar",
          },
          [
            {
              $set: {
                data: "$token",
              },
            },
            {
              $unset: ["token"],
            },
          ]
        );

        await apps.updateMany(
          {
            name: "outlook",
          },
          [
            {
              $set: {
                data: "$token",
              },
            },
            {
              $unset: ["token"],
            },
          ]
        );
      });
    } finally {
      await session.endSession();
    }
  },
};
