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
        await db.collection("payments").updateMany(
          {
            status: "refunded",
          },
          [
            {
              $set: {
                refunds: [
                  {
                    amount: "$amount",
                    refundedAt: "$refundedAt",
                  },
                ],
              },
            },
            {
              $unset: "refundedAt",
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
        await db.collection("payments").updateMany(
          {
            status: "refunded",
          },
          [
            {
              $set: {
                refundedAt: {
                  $arrayElemAt: ["$refunds.refundedAt", 0],
                },
              },
            },
            {
              $unset: "refunds",
            },
          ]
        );
      });
    } finally {
      await session.endSession();
    }
  },
};
