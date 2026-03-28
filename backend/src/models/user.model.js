import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"

const userSchema = new Schema({
    Name:{
        tyep: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    
    email:{
        tyep: String,
        required: [true, 'Email is required'],
        trim: true,
        uniquwe:true,
        lowercase:true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide avalid email']
    },
    
    password:{
        tyep: String,
        required: [true, 'password is required'],
        uniquwe:true,
        minLength: [8, 'Password must be atleast 8 characters'],
        select:false,
    },

    password:{
        tyep: String,
        required: [true, 'password is required'],
        uniquwe:true,
        minLength: [8, 'Password must be atleast 8 characters'],
        select:false,
    },

    role:{
        type: String,
        enum: {
            values: ['student', 'instructor', 'admin'],
            message: 'Please select a valid role'
        },
        default: 'student'
    },

    avatar:{
        type: String,
        default:"default_avatar.png"
    },

    bio:{
        type:String,
        maxLength: [200, 'Bio cannot exceed 200 characters']
    },

    enrolledCourses:[{
        courses:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        enrolledAt:{
            type:Date,
            default: Date.now
        }
    }],
    resetPasswordToken:String,
    resetPasswordExpire: Date,

    lastActive:{
        type: Date,
        default: Date.now
    }

},{
    timestamps:true,
    toJSON: {virtual: true},
    toObject: {virtual: true}
})

//hashing the password
userSchema.pre("save", async function (next){
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

//compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(this.password, password)
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
        return resetToken
}

userSchema.methods.updateLastActive = function(){
    this.lastActive = Date.now()
    return this.lastActive({validateBeforeSave: false})
}

//virtual field for total enrolled courses
userSchema.virtual('totalEnrolledCourses').get(function(){
    return this.enrolledCourses.length
}) 

export const User = mongoose.model("User", userSchema)