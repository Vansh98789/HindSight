import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import reviewRoutes from "./route/reviewRoutes.js";
import analyticsRoutes from "./route/analyticsRoute.js";

import authRoute from "./route/authroutes.js";
import decisionRoute from "./route/decisionRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";



const app=express();

const port = Number(process.env.PORT) || 3000;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

app.use(express.json())
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello world")
}
)
app.use("/api/auth",authRoute);
app.use("/api/decision",authMiddleware,decisionRoute);
app.use('/api/reviews',authMiddleware, reviewRoutes);
app.use("/api/analytics",authMiddleware,analyticsRoutes);


app.listen(port,()=>{
    console.log(`server running on ${port}`)
})

