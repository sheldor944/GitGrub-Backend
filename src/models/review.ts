import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        restaurant: {type: mongoose.Schema.Types.ObjectId, ref: "Restaurant"},
        email : {type : String },
        username : {type : String}, 
        message: {type: String , required: true},
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5}, 
        ratingTime : {type: Date , required: true}
    }
);

const Review = mongoose.model("Review" , reviewSchema);
console.log("Review created?");
export default Review; 
