const express = require('express');
const app = express();
const { resolve } = require('path');
const cors = require('cors');
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
app.use(cors());
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


const currentPort = process.env.port || 4242

app.listen(currentPort , () => console.log('Running on port', currentPort));

