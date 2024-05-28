import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const reviewSchema = new Schema({
    body: String, 
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

export default model("Review", reviewSchema);