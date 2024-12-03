const cron = require("node-cron");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "local"}` });

cron.schedule("* * * * *", (arg) => {
  if (arg === "init" || arg === "manual") date = new Date();
  else date = arg;

  try {
    console.log(`Running reminders schedule for ${date.toISOString()}`);

    fetch(
      `http://localhost:${
        process.env.PORT || 3000
      }/api/scheduler/reminders?date=${encodeURIComponent(
        date.toISOString()
      )}&key=${process.env.SCHEDULER_KEY}`
    );
  } catch (e) {
    console.error(e);
  }
});

cron.schedule("0 3 * * *", (arg) => {
  if (arg === "init" || arg === "manual") date = new Date();
  else date = arg;

  try {
    console.log(`Running cleanup schedule for ${date.toISOString()}`);

    fetch(
      `http://localhost:${process.env.PORT || 3000}/api/scheduler/cleanup?key=${
        process.env.SCHEDULER_KEY
      }`
    );
  } catch (e) {
    console.error(e);
  }
});
