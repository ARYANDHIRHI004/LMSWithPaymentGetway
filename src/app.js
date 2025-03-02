import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import mongoSenetize from "express-mongo-sanitize"
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

//Global rate limiting
const limiter = rateLimit({
    windowMs: 15*60*1000,
    limit:100,
    message: "Too many request from this IP, please try later",
})

//Security middlewate
app.use(mongoSenetize())
app.use(hpp())
app.use(helmet())
app.use("/api", limiter)

//logging Middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

//Body Parser Middleware
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended: true, limit:'10kb'}))
app.use(cookieParser())

//CORS configuration
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH", "OPTIONS"]
}))

//Globle Error Handler
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV ==='development' && {stack: err.stack})
    })
    
})


//API Routes



app.use((req, res)=>{
    res.status(404).json({
        status: "error",
        message: "Route not found"
    })
})

export default app