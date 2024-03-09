const express=require("express")
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const userRoute=require("./routes/users")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/posts")
dotenv.config();

const port=process.env.PORT || 3000;
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
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);


app.listen(port,()=>{
    console.log(`Backend server is running at: ${port}`);
})