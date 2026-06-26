import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import http from "http";
import {Server} from 'socket.io';
import connectToSocket from "./controllers/socketController.js";

const app = express();
const server = http.createServer(app);
connectToSocket(server);


app.use(cors());
app.use(express.urlencoded({limit: "40kb", extended: true }));
app.use(express.json({limit: "40kb"}));
app.use("/user", userRoutes);


const start=async()=>{ 
    const mongoURL=process.env.MONGOURL;
    await mongoose.connect(mongoURL);
    server.listen(3000, ()=>{
        console.log("Server is listening on port 3000")
    })
}
start();