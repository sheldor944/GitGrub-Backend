import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    name : { type : String , required : true}, 
    gender : {type: String, required : true}, 
    role : {type : String , required : true}, 
    email : {type : String , required : true , unique : true },
    phone : {type : String , required : true , unique : true}, 
    joiningDate : {type : Date , required :true }, 
    shiftDuration :{
        type : String 
    },
    resigningDate : { type : Date},
    imageUrl: { type: String, required: true },


   
});

// inventorySchema.index({ restaurant: 1, itemName: 1 }, { unique: true });


const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;