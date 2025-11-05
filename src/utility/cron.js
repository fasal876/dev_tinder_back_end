const { Connection } = require("mongoose");
const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");

// cron.schedule("* * * * * *", () => {
//   console.log(
//     "this code runs for every second every minute every hour everyday of month every month every day of week"
//   );
// });

// cron.schedule(" * * * * *", () => {
//   console.log(
//     " every minute every hour everyday of month every month every day of week"
//   );
// });

// send notifications to all id's about request for who got request yesterday

cron.schedule("12 1 * * *", async () => {
  //algo
  //find yesterday
  // find all the connection made by yesterday
  // take all the email id of toUserId ,
  //send email to the extracted email id with the information about the sender
  try {
    const date = new Date();
    const yesterday = date.setDate(date.getDate());
    const yesterdayStart = new Date(yesterday);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const connectionRequest = await ConnectionRequest.find({
      createdAt: { $gt: yesterdayStart, $lt: yesterdayEnd },
      status: "interested",
    }).populate("fromUserId toUserId");
    const listOfEmails = [
      ...new Set(connectionRequest.map((req) => req.toUserId.emailId)),
    ];
    // for(let i=0;i<listOfEmails;i++){
    //     sendEmail(listOfEmails[i],)
    // }
  } catch (err) {
    console.log(err);
  }
});
