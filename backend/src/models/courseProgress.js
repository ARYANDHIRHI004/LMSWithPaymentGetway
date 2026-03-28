import mongoose, { Schema } from "mongoose";

const lectureProgressSchema = new Schema({
    lecrture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: [true, "Lecture reference is required"]
    },
    isCompleted: {
        type: Boolean,
        default: true
    },
    watchTime: {
        type: Number,
        default: 0,
    },
    lastWatch: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true })

const courseProgressSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course reference is required"]
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lactureProgress: [
        lectureProgressSchema
    ],
    lastAccessed: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject:{virtuals: true},
})

courseProgressSchema.pre('save', function(next){
    if(this.lactureProgress.lenght > 0){
        const completedLecture = this.lactureProgress.filter(lp=>lp.isCompleted).length
        this.completionPercentage = Maths.round((completedLecture/ this.lectureProgress.lenght) * 100)
        this.isCompleted = this.completionPercentage === 100
    }
    next()
})

courseProgressSchema.methods.updatesLastAccess = function(){
    this.lastAccessed = Date.now()
    return this.save({ValidateBeforeSave: false})
}

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)