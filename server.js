const express = require('express');
const app = express();
const { resolve } = require('path');
// const cors = require('cors');
var bodyParser = require('body-parser');
// Copy the .env.example in the root into a .env file in this folder
require('dotenv').config({ path: './.env' });
// const stripe = require('stripe')(
// 	'sk_test_51HbKSjIyjaakxrkQtJP0Z3jI8XViKhSlvOpns7ok60RgX3FFwCgyMVTSYhl481KNq3j9W0Q3HSpTV2FjDai1ZJ5b00a1X0uxzk'
// );
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// //eri'sacount
// const stripe = require('stripe')(
// 	'sk_test_51HU4oYEc81NFGDJi4Yy6u66McEpxkIxg718bZbE6xQpdcSyOvQqGG2macbksefTXllPlrg3Zah7sWpcl45OBzUHb0050I8PBXy'
// );
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// app.use(cors());
app.use(express.static(process.env.STATIC_DIR));

// app.use(express.static(path.join(__dirname+'/dist')));


app.use(
  express.json(
    // {
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hit ting the Stripe webhook endpoint.
  //   verify: function (req, res, buf) {
  //     if (req.originalUrl.startsWith('/webhook')) {
  //       req.rawBody = buf.toString();
  //     }
  //   },
  // })
));

//これは使わなくてもいいかな。。。
// app.use(bodyParser.json());
// app.use(
// 	bodyParser.urlencoded({
// 		extended: true,
// 	})
// );

//eriさんのコードをちょっと修正
app.post('/ephemeral_keys', async (req, res) => {
  const apiVersion = req.body.api_version;
  const customerId = req.body.customerId;
  console.log(apiVersion, customerId);
  try {
    let key = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: apiVersion }
    );
    console.log("keyはなに",key);
    res.status(200).send(key);
  } catch (error) {
    console.error(error.message);
  }

  //eriさんのコード
  // var apiVersion = req.body.api_version;
	// var customerId = req.body.customerId;
  // let key = stripe.ephemeralKeys
  // 	.create({ customer: customerId }, { apiVersion: apiVersion })
  // 	.then((key) => {
  // 		res.status(200).send(key);
  // 		console.log(key, 'this is the ephemeralkey');
  // 	})
  // 	.catch((err) => {
  // 		console.log(err);
  // 		res.status(500).end();
  // 	});
});


//2020.10.22eriさんから送られたキー(製品情報の金額をとるからいらないはず!!)
// app.get('/config', async (req, res) => {
// 	const price = await stripe.prices.retrieve(process.env.PRICE);
// 	res.send({
// 		publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
// 		unitAmount: price.unit_amount,
// 		currency: price.currency,
// 	});
// });


// CREATE PAYMENT INTENT(eriさんのコード)
//Post charge
// app.post('/charge', (req, res) => {
// 	var customerId = req.body.customerId;
// 	var amount = req.body.amount;
// 	var currency = req.body.currency;
// 	console.log('chargerequest');
// 	stripe.charges.create(
// 		{
// 			customerId: customerId,
// 			amount: amount,
// 			currency: currency,
// 			customer: customerId,
// 		},
// 		function (err, charge) {
// 			if (err) {
// 				console.log('ERROR!!!!!');
// 				console.log(err, req.body);
// 				res.status(500).end();
// 			} else {
// 				res.status(200).send();
// 			}
// 		}
// 	);
// });


// Post & Save New customer一応カスタマーは作れる。
app.post('/create', async (req, res) => {

  // var customerId = req.body.customerId;
  var amount = req.body.amount;
  var currency = req.body.currency;
  var description = req.body.description;

  console.log(amount);
  console.log(currency);

  const customer = await stripe.customers.create({
    description: description
  });

  console.log("customerは？", customer);
  res.send(customer);
  //   stripe.customer
//     .create({
//       name: name,
//       customer: customerId,
//     })
//     .then((key) => {
//       res.status(200).send(key);
//       console.log(key, 'this is a new user');
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).end();
//     });
});




// CREATE PAYMENT INTENT
//Post charge
app.post('/charge', async (req, res) => {
  // var customerId = req.body.customerId;
  var cardId = req.body.cardId;
  var amount = req.body.amount;
  var currency = req.body.currency;
  var description = req.body.description;

 
//  const customersList = await stripe.customers.list({
//   limit: 3,
// });
// console.log("customerlistってなんだ", customersList);

// const customersCharge = await stripe.charges.list({
//   limit: 50,
// });
// console.log("customersChargeってなんだ",customersCharge);
// res.send(customersCharge);

//超参考にするhttps://qiita.com/zaburo/items/7d4de7723b6d2445f356


  // paymentIntentはでるぞう！！！参考
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: amount,
  //   currency: currency,
  //   // source: source,
  //   payment_method_types: [process.env.PAYMENT_METHODS]
  // });

  // console.log("paymentIntentは", paymentIntent);

// テストカードを使用して支払いを完了します。
// paymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
//   payment_method: 'pm_card_mastercard',
// });


// res.send(paymentIntent);





  console.log("parametersは？", cardId, amount, currency, description)

  const customer = await stripe.customers.create({
    description: description
  });

  const customerId = customer.id;
  console.log("customerIdは？", customer.id);
  // res.send(customer.id);


  //source。。。作ったけど、いまいちわからん。。。
  // const source =  await stripe.sources.create({
    // type: 'ach_credit_transfer',
    // type:{
    //   "account_number": "test_52796e3294dc",
    //   "routing_number": "110000000",
    //   "fingerprint": "ecpwEzmBOSMOqQTL",
    //   "bank_name": "TEST BANK",
    //   "swift_code": "TSTEZ122"
    // },
    // currency: currency
    // owner: {
    //   email: 'tdtk1538@gmail.com'
    // }
  // })
  // console.log('chargerequest');
  // console.log("amountとcurrencyとsourceとdescription", amount,currency,source,description);


  // https://stripe.com/docs/api/sources/createとhttps://qiita.com/liukoki/items/d440549f7bba13d6e66a
  // const charge = await stripe.charges.create({
  //   customer:customerId,
  //   amount: amount,
  //   currency: currency,
  //   source: cardId,
  //   // source: source,
  //   description: description
  // });

// 　console.log("chargeってなんだ？？", charge);

const token = await stripe.tokens.create({
  card: {
    number: '4242424242424242',
    exp_month: 04,
    exp_year: 2021,
    cvc: '424',
  },
});
  
const tokenId = token.id
   console.log("yyyyyyyy");
   console.log("tokenIdは？",tokenId);
const charge = await stripe.charges.create(
  		{
  			amount: amount,
        currency: currency,
        customer: customerId,
        // paymentIntent:paymentIntent
        // payment_method_types: ['card']
        source:tokenId
        // customer:"cus_IFTSVUas6QxpyJ"
  		},
);

console.log("chargeは？", charge);
res.send(charge);



  // console.log("chargeは何?", charge);
  // res.send(charge);
  // stripe.charges.create(
  // 	{
  // 		customerId: customerId,
  // 		amount: amount,
  // 		currency: currency,
  // 		customer: customerId,
  // 	},
  // 	function (err, charge) {
  // 		if (err) {
  // 			console.log('ERROR!!!!!');
  // 			console.log(err, req.body);
  // 			res.status(500).end();
  // 		} else {
  // 			res.status(200).send();
  // 		}
  // 	}
  // );
});


//少しreactを生かす
app.post("/create-session", async (req, res) => {
  // app.post("/", async (req, res) => {
  console.log("create-sessionに来た？")
  const domainURL = process.env.DOMAIN;
  console.log(req.body);
  // const { quantity, locale } = req.body;
  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the Checkout page
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    //元のデータ
    // payment_method_types: process.env.PAYMENT_METHODS,
    // mode: 'payment',
    // line_items: [
    //   {
    //     price: process.env.PRICE,
    //     quantity: quantity
    //   },
    // ],

    //フロントから来るデータ
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',

    //   // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    //   // success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    //   // cancel_url: `${domainURL}/canceled.html`,
    success_url: `https://www.codechrysalis.io/`,
    cancel_url: `https://google.co.jp`
    // }
    // req.body
  });

  // res.json({ id: session.id });
  console.log({ id: session.id })
  res.send({
    sessionId: session.id,
  });
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));










//ここから下は古いデータ

// const express = require('express');
// const app = express();
// const { resolve } = require('path');
// // Copy the .env.example in the root into a .env file in this folder
// require('dotenv').config({ path: './.env' });
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // app.use(express.static(process.env.STATIC_DIR));
// app.use(
//   express.json({
//     // We need the raw body to verify webhook signatures.
//     // Let's compute it only when hit ting the Stripe webhook endpoint.
//     verify: function (req, res, buf) {
//       if (req.originalUrl.startsWith('/webhook')) {
//         req.rawBody = buf.toString();
//       }
//     },
//   })
// );

// app.get('/', (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + '/index.html');
//   res.sendFile(path);
// });

// app.get('/config', async (req, res) => {
//   const price = await stripe.prices.retrieve(process.env.PRICE);

//   res.send({
//     publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
//     unitAmount: price.unit_amount,
//     currency: price.currency,
//   });
// });

// // Fetch the Checkout Session to display the JSON result on the success page
// // app.get('/checkout-session', async (req, res) => {
// //   const { sessionId } = req.query;
// //   const session = await stripe.checkout.sessions.retrieve(sessionId);
// //   res.send(session);
// // });



// //create ephemeralKeys
// app.post("/ephemeral_keys", async (req, res) => {

//   try {
//   //   console.log(req.body)
//   // 　const {email} = req.body.email;
//     //customerIDをemailから取り出す
//     const customer = await stripe.customers.create({email: "tdtk1538@gmail.com"});
//     const customerId = customer.id;

//     let key = await stripe.ephemeralKeys.create(
//       {customer: customerId},
//       {apiVersion: '2020-08-27'}
//     );
//     console.log("keyは何?", key);
//     res.send({key:key});

//   } catch (error) {
//       console.error(error.message);
//   }

//   });


// // Webhook handler for asynchronous events.
// // app.post('/webhook', async (req, res) => {
// //   let data;
// //   let eventType;
// //   // Check if webhook signing is configured.
// //   if (process.env.STRIPE_WEBHOOK_SECRET) {
// //     // Retrieve the event by verifying the signature using the raw body and secret.
// //     let event;
// //     let signature = req.headers['stripe-signature'];

// //     try {
// //       event = stripe.webhooks.constructEvent(
// //         req.rawBody,
// //         signature,
// //         process.env.STRIPE_WEBHOOK_SECRET
// //       );
// //     } catch (err) {
// //       console.log(`⚠️  Webhook signature verification failed.`);
// //       return res.sendStatus(400);
// //     }
// //     // Extract the object from the event.
// //     data = event.data;
// //     eventType = event.type;
// //   } else {
// //     // Webhook signing is recommended, but if the secret is not configured in `config.js`,
// //     // retrieve the event data directly from the request body.
// //     data = req.body.data;
// //     eventType = req.body.type;
// //   }

// //   if (eventType === 'checkout.session.completed') {
// //     console.log(`🔔  Payment received!`);
// //   }

// //   res.sendStatus(200);
// // });

// app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));





// //ここから下はYUSUKEさんのコード


// // const stripe = require('stripe')('sk_test_51HU4otHqeWVlhNqJ7YqaBOHRDjZp2Ipm68H7jdYa8CjZGuJZqnZOi1MgLlqad0VJuNffI5bmQMMMJokszXaNF62m00TC8UeTh5');
// // const express = require('express');
// // const app = express();
// // app.use(express.static('.'));

// // const YOUR_DOMAIN = 'http://localhost:3000/checkout';

// // app.post('/create-session', async (req, res) => {
// //   console.log("tttttttttttttt");
// //   const session = await stripe.checkout.sessions.create({
// //     payment_method_types: ['card'],
// //     line_items: [
// //       {
// //         price_data: {
// //           currency: 'usd',
// //           product_data: {
// //             name: 'Stubborn Attachments',
// //             images: ['https://i.imgur.com/EHyR2nP.png'],
// //           },
// //           unit_amount: 2000,
// //         },
// //         quantity: 1,
// //       },
// //     ],
// //     mode: 'payment',
// //     success_url: `https://www.codechrysalis.io/`,
// //     cancel_url: `https://google.co.jp`,
// //   });
// //   // console.log(res);
// //   res.json({ id: session.id });
// // });
const currentPort = process.env.port || 4242

app.listen(currentPort , () => console.log('Running on port', currentPort));

