import {Schema, model} from 'mongoose'

export const courseShema = Schema({
    name:{
        type: String,
        require: true
    },
    section:{
        type: String,
        require: true
    },
    teacher:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    versionKey: false
});

export default model('Course', courseShema);