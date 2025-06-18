import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *" , () => {
  https.get(process.env.API_URL, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Request failed with status code: ${res.statusCode}`);
    } else {
      console.log("Cron job executed successfully.");
    }
  }).on("error", (err) => {
    console.error("Error during cron job execution:", err);
  });
});

export default job;