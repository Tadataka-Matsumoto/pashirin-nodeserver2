const express = require("express");
const server = express();

require('dotenv').config({ path: './.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const setupServer = () => {
  /**
   * Create, set up and return your express server, split things into separate files if it becomes too long!
   */

  //これを使うと魔法がかかる
  server.use(express.json());

server.get("/test", (req,res) => {
    try {
        console.log("ttttttt");
        res.send("test")
    } catch (error) {
        console.error(error.message);
    }

})


//eriさんのコードをちょっと修正
server.post('/ephemeral_keys', async (req, res) => {

    console.log("来ている?")
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
    });

 
  return server;
};

module.exports = { setupServer };
