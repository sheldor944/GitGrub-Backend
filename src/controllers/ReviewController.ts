import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";
import mongoose from "mongoose";
import Review from "../models/review";


const createReview = async (req : Request , res : Response) => {
    try{
        // console.log(req);
        const review = new Review (req.body); 
        console.log(review);
        // review.user = req.userId; 
        review.user =  new mongoose.Types.ObjectId(req.userId);
        review.restaurant = new mongoose.Types.ObjectId("661e5c2a5a300d7c8babf526");
        console.log(review);
        await review.save();
        res.json({message : "got it " + review});
    }
    catch(error)
    {
        res.status(500).json({message : "something went wrong in createReview " + error});
    }

};

export default {createReview};