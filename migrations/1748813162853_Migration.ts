import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class Migration1748813162853 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const logs = db.collection("communication-logs");

    await logs.updateMany({}, [
      {
        $set: {
          participantType: {
            $cond: {
              if: {
                $or: [
                  {
                    $regexMatch: {
                      input: "$initiator",
                      regex: /^(?:email)|(?:text message)/i,
                    },
                  },
                  {
                    $regexMatch: {
                      input: "$receiver",
                      regex: /^(?:email)|(?:text message)/i,
                    },
                  },
                ],
              },
              then: "user",
              else: "customer",
            },
          },
          participant: {
            $cond: {
              if: {
                $eq: ["$direction", "inbound"],
              },
              then: "$initiator",
              else: "$receiver",
            },
          },
          handledBy: {
            $cond: {
              if: {
                $eq: ["$direction", "inbound"],
              },
              then: "$receiver",
              else: "$initiator",
            },
          },
        },
      },
      {
        $unset: ["initiator", "receiver"],
      },
    ]);
  }

  public async down(db: Db): Promise<void | never> {
    const logs = db.collection("communication-logs");
    await logs.updateMany({}, [
      {
        $set: {
          initiator: {
            $cond: {
              if: {
                $eq: ["$direction", "inbound"],
              },
              then: "$participant",
              else: "$handledBy",
            },
          },
          receiver: {
            $cond: {
              if: {
                $eq: ["$direction", "inbound"],
              },
              then: "$handledBy",
              else: "$participant",
            },
          },
        },
      },
      {
        $unset: ["participantType", "participant", "handledBy"],
      },
    ]);
  }
}
