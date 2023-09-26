import mongoose from "mongoose";
import Review from "./review.model";

const propertySchema = new mongoose.Schema({
  propertyTitle: { type: String, required: true },
  status: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  area: { type: String, required: true },
  bedroom: { type: String, required: true },
  bathroom: { type: String, required: true },
  profile_photo: [{ type: String }],
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  description: { type: String, required: true },
  age: { type: String, required: true },
  garage: { type: String, required: true },
  rooms: { type: String, required: true },
  features: [{ type: String }],
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  ownerPhone: { type: String, required: false },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", // Reference the "Review" model
    },
  ],

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String },
});

const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;
