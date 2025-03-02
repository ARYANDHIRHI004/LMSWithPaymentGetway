import mongoose from "mongoose";

const DBNAME = LMS
const MAX_RETRIES = 3;  
const RETRY_INTERVAL= 5000; //5 seconds

class DatabaseConnection{
    constructor(){
        this.retryCount = 0
        this.isConnected = false

        //configure mongoose settings
        mongoose.set('strictQuery', true)

        mongoose.connection.on('connected', ()=>{
            console.log("MonogDB connected Successfully");
            this.isConnected = true
        })
        mongoose.connection.on('error', ()=>{
            console.log("MonogDB connected ERROR"); 
            this.isConnected = false
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log("MonogDB DISCONNECTED");
            this.isConnected = false
            this.handleDisconnection()
        })

        process.on('SIGTERM', this.handleAppTermination.bind(this))
    }

    async connect(){
        try {
            if (!process.env.MONGO_URI) {
                throw new Error("DB URI not available in env variables")
            }
    
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10,
                serverSelectionTimeOutMS: 5000,
                socketTimeoutMS: 45000,
                family:4 // use IPv4
            };
    
            if (process.env.NODE_ENV === 'development') {
                mongoose.set('debug', true)            
            }
    
            await mongoose.connect(`${process.env.MONGO_URI}/${DBNAME}`, options);
            this.retryCount = 0 // reset retry count on success
        } catch (error) {
            console.log(error.message);
            await this.handleConnectionError()  
        }
    }

    async handleConnectionError(){
        if (this.retryCount < MAX_RETRIES) {
            this.retryCount++;
            console.log(`Retrying connection... Attempt ${this.retryCount} of ${MAX_RETRIES}`);
            await new Promise(resolve => setTimeout(()=>{
                resolve
            },RETRY_INTERVAL))
            return this.connect()
        }
        else{
            console.log(`Fail connect to DB after ${MAX_RETRIES} attempts`);
            
        }
    }

    async handleDisconnection(){
        if (!this.isConnected) {
            console.log("Attemption to reconnect with DB");
            this.connect()
        }
    }

    async handleAppTermination(){
        try {
            await mongoose.connection.close()
            console.log("DB connection closed through the App termination");
            process.exit(0)
        } catch (error) {
            console.error("Error during DB disconnection", error);
            process.exit(0)            
        }
    }

    getConnectionStatus(){
        return{
            isConnected:this.isConnected,
            readyState: mongoose.connection.readyState
        }
    }
}

const dbConnection = new DatabaseConnection()

export default dbConnection.connect.bind(dbConnection)
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection)
