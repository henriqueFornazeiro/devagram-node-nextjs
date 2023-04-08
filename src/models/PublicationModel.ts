import mongoose, { Schema } from "mongoose";

const PublicationSchema = new Schema({
    userId: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    date: {type: Date, required:true},
    comments: {type: Array, require:true, default:[]},
    likes: {type: Array, require:true, default:[]}
});

export const PublicationModel = mongoose.models.publications || mongoose.model("publications",PublicationSchema);
