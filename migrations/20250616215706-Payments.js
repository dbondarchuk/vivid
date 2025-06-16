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
        const intents = await db.createCollection("payment-intents");
        await intents.createIndex(
          {
            appointmentId: -1,
          },
          { name: "appointmentId" }
        );

        await intents.createIndex(
          {
            customerId: -1,
          },
          { name: "customerId" }
        );

        await intents.createIndex(
          {
            externalId: -1,
          },
          { name: "externalId" }
        );

        await intents.createIndex(
          {
            appId: -1,
          },
          { name: "appId" }
        );

        const payments = await db.createCollection("payments");
        await payments.createIndex(
          {
            appointmentId: -1,
          },
          { name: "appointmentId" }
        );

        await payments.createIndex(
          {
            customerId: -1,
          },
          { name: "customerId" }
        );

        await payments.createIndex(
          {
            externalId: -1,
          },
          { name: "externalId" }
        );

        await payments.createIndex(
          {
            appId: -1,
          },
          { name: "appId" }
        );

        await db.collection("configuration").updateMany(
          {
            key: "booking",
          },
          {
            $set: {
              "value.payments.enable": false,
            },
          }
        );

        await db.collection("options").updateMany(
          {},
          {
            $set: {
              requireDeposit: "inherit",
            },
          }
        );

        await db.collection("customers").updateMany(
          {},
          {
            $set: {
              requireDeposit: "inherit",
            },
          }
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
        await db.dropCollection("payment-intents");

        await db.dropCollection("payments");

        await db.collection("configuration").updateMany(
          {
            key: "booking",
          },
          {
            $unset: {
              "value.payments.enable": "",
            },
          }
        );

        await db.collection("options").updateMany(
          {},
          {
            $unset: {
              requireDeposit: "",
            },
          }
        );

        await db.collection("customers").updateMany(
          {},
          {
            $unset: {
              requireDeposit: "",
            },
          }
        );
      });
    } finally {
      await session.endSession();
    }
  },
};
