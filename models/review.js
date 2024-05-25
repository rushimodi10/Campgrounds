import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const reviewSchema = new Schema({
    rating: Number,
    body: String, 
})

export default model("Review", reviewSchema);