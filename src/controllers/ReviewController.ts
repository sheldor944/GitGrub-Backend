import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";
import mongoose from "mongoose";
import Review from "../models/review";


const createReview = async (req : Request , res : Response) => {
    try{
        console.log("create review is getting called ");
        console.log(req)
        const restaurantId = req.params.restaurantId;
        const review1 = req.body
        const review = new Review (req.body); 
        
        review.user =  new mongoose.Types.ObjectId(req.userId);
        review.restaurant = new mongoose.Types.ObjectId(restaurantId);
        // console.log(review);
        await review.save();
        res.json({message : "got it " + review});
        console.log("Successfully called createdReview");
    }
    catch(error)
    {
        console.log("Error happened in the createReview ");
        console.log(error);
        res.status(500).json({message : "something went wrong in createReview " + error});
    }

};

const getReview = async( req : Request , res : Response) => {
    try{
        const restaurantId = req.params.restaurantId;
        // restaurantId = "661e5c2a5a300d7c8babf526";
        // console.log(restaurantId);

        const review = await Review.find({restaurant : restaurantId});
        res.json(review);
    }
    catch (error)
    {
        res.status(500).json({message : "something went wrong in getReview -> "+ error });
    }
};

export default {createReview,getReview};