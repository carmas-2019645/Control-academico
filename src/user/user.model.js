import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        maxLenght: 8,
        required: true
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['TEACHER', 'STUDENT'],
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
},{
    versionKey: false
});

export default mongoose.model('User', userSchema)