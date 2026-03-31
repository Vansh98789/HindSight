import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import reviewRoutes from './route/reviewRoutes';

import authRoute from "./route/authroutes";
import decisionRoute from "./route/decisionRoute";
import authMiddleware from "./middleware/authMiddleware";



const app=express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,              
}));

app.use(express.json())
app.use(cookieParser());

app.use("/auth",authRoute);
app.use("/decision",authMiddleware,decisionRoute);
app.use('/api/reviews', reviewRoutes);


app.listen(3000,()=>{
    console.log("server running on 3000")
})







//use prisma for db handle