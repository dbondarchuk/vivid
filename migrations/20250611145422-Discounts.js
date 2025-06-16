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
        const discounts = await db.createCollection("discounts");
        await discounts.createIndex(
          {
            codes: -1,
          },
          { name: "codes" }
        );

        await db.collection("appointments").createIndex(
          {
            "discount.id": -1,
          },
          {
            name: "discountId",
          }
        );

        await db.collection("connected-apps").createIndex(
          {
            name: -1,
          },
          {
            name: "name",
          }
        );

        await db.collection("configuration").updateMany(
          {
            key: "booking",
          },
          {
            $set: {
              "value.allowPromoCode": "allow-if-has-active",
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
        await db.dropCollection("discounts");
        await db.collection("appointments").dropIndex("discountId");

        await db.collection("connected-apps").dropIndex("name");

        await db.collection("configuration").updateMany(
          {
            key: "booking",
          },
          {
            $unset: {
              allowPromoCode: "",
            },
          }
        );
      });
    } finally {
      await session.endSession();
    }
  },
};
