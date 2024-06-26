import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";
import User from "../models/user";
import {transporter , sendEmail} from "../middleware/SendOrderStatusEmail"

import mongoose from "mongoose";


const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;


const getMyOrders = async (req: Request, res: Response) => {
  try {
    
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user")
      .sort({createdAt : 'desc'});

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

// this needs to be in myRestaurant 

const getTotal = async (req : Request, res: Response) => {
  try{
      const restaurant = await Restaurant.find({user: req.userId});
      // res.json(restaurant);
      const ID = restaurant[0]._id;
      // console.log(ID);
      const orders = await Order.find({restaurant : ID});
      // res.json(orders);
      const totalAmountSum = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      res.json({totalAmountSum});
      // console.log(totalAmountSum); 
      // console.log(restaurant);
  }
  catch (error)
  {
    console.log(error);
    res.status(500).json({message: "something went wront in getTotal"}); 
  }
};



type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

type Menu ={
  _id: mongoose.Schema.Types.ObjectId;
    name: string;
    price: number;
    ingredients: {
        quantity: number;
        itemName: string;
    }[];
}

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });
   

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    const customerUser = await User.findById(req.userId)
    if(customerUser){

      const customerEmail = customerUser.email
      try{
        let message = "Your order has been successfully placed. We'll notify you once it's confirmed by the restaurant.";
       console.log("this is called")

        sendEmail(customerEmail , "placed", message)
      }
      catch(error){
        console.log("error in sending email "+ error)
      }
    }
    await newOrder.save();
    // updating the inventory
    // console.log("this is the order");
    // console.log(newOrder);
    const cartItems = newOrder.cartItems;

    const menuItem  = restaurant.menuItems;
    // const ing = menuItem.ingredients;
    // console.log("this is the menuItem");
    // console.log(menuItem);
    // console.log("this is the cart items");
    // console.log(cartItems);


    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "gbp",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "gbp",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler,
  getTotal,
};
