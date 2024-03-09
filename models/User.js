const mongoose=require("mongoose");
const { v4: uuidv4 } = require('uuid');

const UserSchema=new mongoose.Schema(
    {
    userId: {
        type: String, 
        default: uuidv4
    },
    username:{
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email:{
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 6
    },
    profilePicture:{
        type: String,
        default: ""
    },
    bio:{
        type: String,
        max: 50
    },
},
    {timestamps:true}
)

module.exports=mongoose.model("User",UserSchema)