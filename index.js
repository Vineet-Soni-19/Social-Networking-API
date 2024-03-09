const express=require("express")
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const userRoute=require("./routes/users")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/posts")
dotenv.config();

const port=process.env.PORT || 8000;
const app=express();

//mongodb connection
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log('Database connected'))
.catch((err)=>console.log(err));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/users",userRoute);
app.use("/auth",authRoute);
app.use("/posts",postRoute);


app.listen(8000,()=>{
    console.log("Backend server is running");
})