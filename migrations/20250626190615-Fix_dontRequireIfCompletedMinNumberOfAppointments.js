module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.collection("configuration").updateMany(
      {
        key: "booking",
      },
      [
        {
          $set: {
            "value.payments.dontRequireIfCompletedMinNumberOfAppointments":
              "$value.payments.dontRequireIfMoreThanAppointments",
          },
        },
        {
          $unset: "value.payments.dontRequireIfMoreThanAppointments",
        },
      ]
    );
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("configuration").updateMany(
      {
        key: "booking",
      },
      [
        {
          $set: {
            "value.payments.dontRequireIfMoreThanAppointments":
              "$value.payments.dontRequireIfCompletedMinNumberOfAppointments",
          },
        },
        {
          $unset:
            "value.payments.dontRequireIfCompletedMinNumberOfAppointments",
        },
      ]
    );
  },
};
