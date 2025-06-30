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
        const value = await db.collection("configuration").findOne(
          {
            key: "booking",
          },
          { projection: { "value.timeZone": 1 } }
        );

        if (!value?.value?.timeZone) {
          console.log("Time zone not found");
          return;
        }

        await db.collection("configuration").updateOne(
          {
            key: "general",
          },
          { $set: { "value.timeZone": value.value.timeZone } }
        );

        await db.collection("configuration").updateOne(
          {
            key: "booking",
          },
          { $unset: { "value.timeZone": "" } }
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
        const value = await db.collection("configuration").findOne(
          {
            key: "general",
          },
          { projection: { "value.timeZone": 1 } }
        );

        if (!value?.value?.timeZone) {
          console.log("Time zone not found");
          return;
        }

        await db.collection("configuration").updateOne(
          {
            key: "booking",
          },

          {
            $set: {
              "value.timeZone": value.value.timeZone,
            },
          }
        );

        await db.collection("configuration").updateOne(
          {
            key: "general",
          },
          { $unset: { "value.timeZone": "" } }
        );
      });
    } finally {
      await session.endSession();
    }
  },
};
