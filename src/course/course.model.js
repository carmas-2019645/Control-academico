import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    },{
    versionKey: false
})

export default mongoose.model('Course', coursesSchema)