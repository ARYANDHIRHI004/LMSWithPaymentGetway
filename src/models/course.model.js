import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxLength: [100, 'Course titel cannot exceed 100 characters']
    },
    
    subtitle: {
        type: String,
        trim: true,
        maxLength: [200, 'Course titel cannot exceed 100 characters']
    },
    
    description: {
        type: String,
        trim: true,
    },
    
    category: {
        type: String,
        required: [true, 'Course category is required'],
        trim: true,
    },
    
    level: {
        type: String,
        enum: {
            values:['beginner', 'intermediate','advanced'],
            message: 'Please select a valid course level'
        },
        default: 'beginner',
        trim: true,
    },

    price:{
        type: Number,
        required: [true, 'Course price is required'],
        min:[0, 'Course price must be a non-negative number']
    },

    thumbnail:{
        type: String,
        required: [true, 'Course thumbnail is required']
    },

    enrolledStudents:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lectures:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ],
    instructor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:[true, 'Course instructor is required']
    },
    isPublished:{
        type: Boolean,
        default: false
    },
    totalDuration:{
        type: Number,
        default: 0
    },
    totalLectrue:{
        type:Number,
        default: 0
    }
    

},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject:{virtuals: true},
});

courseSchema.virtual('averageRating'). get(function(){
    return 0; //placeholder assignment
})

courseSchema.pre("save", function(next){
    if (this.lectures) {
        this.totalLectrue = this.lectures.lenght
    }
    next();
})

export const Course = mongoose.model("Course", courseSchema)