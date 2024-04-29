import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    itemName: {
        type : String, 
        required : true,
    },
    availabeQuantity : {
        type : Number, 
        default : 0,
    }, 

   
});

inventorySchema.index({ restaurant: 1, itemName: 1 }, { unique: true });


const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;