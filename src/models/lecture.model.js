import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema({
    title:{
        type: String,
        required: [true, "lecture title is required"],
        trim: true,
        maxLenght: [100, 'Lecture title cannot 100 characters'],
    },
    description:{
        type: String,
        trim: true,
        maxLenght:[500, "Description cannot exceed 500 characters"]
    },
    videoUrl:{
        type: String,
        required: [true, 'Video URL is required']
    },
    duration:{
        type: Number,
        default: 0
    },
    duration:{
        type: String,
        required: [true,'Public ID is required for video management']
    },
    isPreview:{
        type: Boolean,
        default: false
    },
    order:{
        type:Number,
        required: [true, "Lecture order is required"],
    }
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

lectureSchema.pre('save', function(next){
    if(this.duration){
        this.duration=  Math.round(this.duration*100)/100;
    }
    next()
})

export const Lecture = mongoose.model('Lecture', lectureSchema)