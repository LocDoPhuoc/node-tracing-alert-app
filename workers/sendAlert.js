const CronJob = require("cron").CronJob;
var Queue = require("bull");

const config = require("../config");
const currentPrice = require("../helpers/currentPrice");
const sendEmailNotification = require("../helpers/sendEmailNotification");

var alertQueue = new Queue("alerts", config.REDIS_URL);

alertQueue.process(async function (job, done) {
  const { recipient, title, message, type } = job.data;
  let sendEmailResponse = await sendEmailNotification(
    recipient,
    message,
    title, 
    type
  );
  if (sendEmailResponse.error) {
    done(new Error("Error sending alert"));
  }

  done();
});

const recipients = ['dphuocloc.dev@gmail.com', 'tai2212994@gmail.com', 'doloccit@gmail.com'];

var sendAlert = new CronJob("*/5 * * * * ", async function () {

  let coins = [
    {
      symbol: 'NU',
      max: 0.868,
      min: 0.75,
      name: 'NU' 
    }
  ];

  coins.filter(async (coin) => {
    const data = await currentPrice(coin.symbol);
    let price = parseFloat(data.price).toFixed(4);
    console.log(`${new Date().toLocaleString()} ***************** ${coin.symbol}: ${price} USD`);

    if (parseFloat(price) >= parseFloat(coin.max)) {
      priceUpMessage(coin.name, coin.max, price);
    }
    else if (parseFloat(price) <= parseFloat(coin.min)) {
      priceDownMessage(coin.name, coin.min, price);
    }
  });
});

priceUpMessage = (symbol, max, price) => {
  let message = `Price of ${symbol} has just exceeded your alert price of ${max} USD.
      Current price is ${price} USD.`;

  let title = `GOM LÚA NHANH`;

  let type = 'UP PRICE';

  addToQueue(message,title, type);
}

priceDownMessage = (symbol, min, price) => {
  let message = `Price of ${symbol} fell below your alert price of ${min} USD.
      Current price is ${price} USD.`;

  let title = `BÁN LÚA NHANH`;

  let type = 'DOWN PRICE';

  addToQueue(message,title, type);
}

addToQueue = (message, title, type) => {
  recipients.forEach(recipient => {
    alertQueue.add(
      { message, recipient, title, type},
      {
        attempts: 1,
        backoff: 3000,
      }
    );
  })
}

sendAlert.start();
