import express from "express";
// import dotenv from "dotenv";
import UserRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from "cors"

export const app = express();
// dotenv.config()
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const corsOptions = {
    origin : "http://localhost:3000",
    credentials : true , 
    methods : 'GET ,POST ,PUT , PATCH , DELETE , OPTIONS',
    allowedHeaders : 'X-Requested-With , Content-Type , Authorization'
}

app.use(cors(corsOptions))
app.use('/api/v1', UserRouter);

app.get('/', (req,res)=>{
    res.send('Running New.. Credimotion Backend..')
})


