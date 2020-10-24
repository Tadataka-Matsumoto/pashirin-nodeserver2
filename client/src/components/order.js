    // import React, { Fragment, useState } from "react";

    // import { loadStripe } from "@stripe/stripe-js";
    // import axios from "axios";

    // const stripePromise = loadStripe('pk_test_51HbKSjIyjaakxrkQjbjVJGs84Dgag2crDKYtFITADCe33ZsyTyd0HZeqhSb8ceXeYdyJid3bmxvN35uxQdIBoOWb00aoV3vTkr');


    // const Order =  () => {

    //     const [quantity1k, setQuantity1k] = useState(0);
    //     const [quantity3k, setQuantity3k] = useState(0);
    //     const [quantity5k, setQuantity5k] = useState(0);
    //     const [quantity10k, setQuantity10k] = useState(0);
    
    //     async function order() {
    //       const quantity = [quantity1k, quantity3k, quantity5k, quantity10k];
    //       const price = [1000, 3000, 5000, 10000];
    
    //       const voucher = {
    //         payment_method_types: ["card"],
    //         line_items: [],
    //         mode: "payment",
    //         success_url: `${process.env.REACT_APP_DOMAIN}/success`,
    //         cancel_url: `${process.env.REACT_APP_DOMAIN}/cancel`,
    //       };
    
    //       for (let i = 0; i < quantity.length; i++) {
    //         const discountPrice = price[i] - price[i] * 0.25;
    //         if (quantity[i] === 0) continue;
    //         voucher.line_items.push({
    //           price_data: {
    //             currency: "jpy",
    //             product_data: {
    //               name: `${restaurant.name.name}`,
    //               images: ["https://i.imgur.com/EHyR2nP.png"],
    //             },
    //             unit_amount: discountPrice,
    //           },
    //           quantity: quantity[i],
    //         });
    //       }
    
    //       const stripe = await stripePromise;
    
    //       axios
    //         .post("/api/pay/create-session", voucher)
    //         .then((result) => result.data)
    //         .then((result) =>
    //           stripe.redirectToCheckout({
    //             sessionId: result.id,
    //           })
    //         );
    //     }


    //     // 
    //     const stripePaymentMethodHandler = async (result) => {
    //         if (result.error) {
    //           // Show error in payment form
    //         } else {
    //           // Otherwise send paymentMethod.id to your server (see Step 4)
    //           const res = await fetch('/pay', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //               payment_method_id: result.paymentMethod.id,
    //             }),
    //           })
    //           const paymentResponse = await res.json();
        
    //           // Handle server response (see Step 4)
    //           handleServerResponse(paymentResponse);
    //         }
    //       }

    //         // const handleServerResponse = async (response) => {
    //         //     if (response.error) {
    //         //       // Show error from server on payment form
    //         //     } else if (response.requires_action) {
    //         //       // Use Stripe.js to handle the required card action
    //         //       const { error: errorAction, paymentIntent } =
    //         //         await stripe.handleCardAction(response.payment_intent_client_secret);
            
    //         //       if (errorAction) {
    //         //         // Show error from Stripe.js in payment form
    //         //       } else {
    //         //         // The card action has been handled
    //         //         // The PaymentIntent can be confirmed again on the server
    //         //         const serverResponse = axios('/pay', {
    //         //           method: 'POST',
    //         //           headers: { 'Content-Type': 'application/json' },
    //         //           body: JSON.stringify({ payment_intent_id: paymentIntent.id })
    //         //         });
    //         //         handleServerResponse(await serverResponse.json());
    //         //       }
    //         //     } else {
    //         //       // Show success message
    //         //     }
    //         //   }


    //     return (
    //         <Fragment>
    //             <h1>order!!</h1>
    //         </Fragment>
    //     )
    // }


    // export default Order;


import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_CLIENT_KEY);

export default function Order({ restaurant, t }) {
  const [quantity1k, setQuantity1k] = useState(0);
  const [quantity3k, setQuantity3k] = useState(0);
  const [quantity5k, setQuantity5k] = useState(0);
  const [quantity10k, setQuantity10k] = useState(0);

  async function order() {
    const quantity = [quantity1k, quantity3k, quantity5k, quantity10k];
    const price = [1000, 3000, 5000, 10000];

    const voucher = {
      payment_method_types: ["card"],
      line_items: [],
      mode: "payment",
      success_url: `${process.env.REACT_APP_DOMAIN}/success`,
      cancel_url: `${process.env.REACT_APP_DOMAIN}/cancel`,
    };

    voucher.line_items.push({
        price_data: {
          currency: "jpy",
          product_data: {
            name:"Tadamon"
          },
        quantity: 300
    }
    });

    // for (let i = 0; i < quantity.length; i++) {
    //   const discountPrice = price[i] - price[i] * 0.25;
    //   if (quantity[i] === 0) continue;
    //   voucher.line_items.push({
    //     price_data: {
    //       currency: "jpy",
    //       product_data: {
    //         name: `${restaurant.name.name}`,
    //         images: ["https://i.imgur.com/EHyR2nP.png"],
    //       },
    //       unit_amount: discountPrice,
    //     },
    //     quantity: quantity[i],
    //   });
    // }
    const stripe = await stripePromise;

    axios
      .post("/api/pay/create-session", voucher)
      .then((result) => result.data)
      .then((result) =>
        stripe.redirectToCheckout({
          sessionId: result.id,
        })
      );
  }

  return (
    <div className="order-container">
      <table className="order-table">
        <tr>
          <th>{t("Quantity")}</th>
          <th>{t("Voucher Amount")}</th>
          <th>{t("Discount")}</th>
          <th>{t("Your Cost")}</th>
        </tr>
        <tr>
          <td>
            <select
              className="quantity"
              value={quantity1k}
              onChange={(e) => setQuantity1k(e.target.value)}
            >
              <option>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </td>
          <td className="voucher">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(1000)}
          </td>
          <td>25% OFF</td>
          <td className="discount-price">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(1000 - 1000 * 0.25)}
          </td>
        </tr>

        <tr>
          <td>
            <select
              className="quantity"
              value={quantity3k}
              onChange={(e) => setQuantity3k(e.target.value)}
            >
              <option>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </td>
          <td className="voucher">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(3000)}
          </td>
          <td>25% OFF</td>
          <td className="discount-price">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(3000 - 3000 * 0.25)}
          </td>
        </tr>

        <tr>
          <td>
            <select
              className="quantity"
              value={quantity5k}
              onChange={(e) => setQuantity5k(e.target.value)}
            >
              <option>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </td>
          <td className="voucher">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(5000)}
          </td>
          <td>25% OFF</td>
          <td className="discount-price">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(5000 - 5000 * 0.25)}
          </td>
        </tr>

        <tr>
          <td>
            <select
              className="quantity"
              value={quantity10k}
              onChange={(e) => setQuantity10k(e.target.value)}
            >
              <option>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </td>
          <td className="voucher">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(10000)}
          </td>
          <td>25% OFF</td>
          <td className="discount-price">
            {new Intl.NumberFormat("ja-JP", {
              style: "currency",
              currency: "JPY",
            }).format(10000 - 10000 * 0.25)}
          </td>
        </tr>
      </table>
      <div>
        <button className="order-button" onClick={order}>
          {t("Order")}
        </button>
      </div>
    </div>
  );
}
