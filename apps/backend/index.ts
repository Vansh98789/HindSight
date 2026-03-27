import express from "express";
import cors from "cors";

import authRoute from "./route/authroutes";
import cookieParser from "cookie-parser";


const app=express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,              
}));

app.use(express.json())
app.use(cookieParser());

app.use("/auth",authRoute);


app.listen(3000,()=>{
    console.log("server running on 3000")
})







//use prisma for db handle