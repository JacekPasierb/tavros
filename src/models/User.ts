import {Schema, model, models} from "mongoose";

const CartItemSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  qty: { type: Number, required: true, min: 1 },
  slug: { type: String, required: true },
  size: { type: String },
  sku: { type: String },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["admin", "user"], default: "user"},
    marketingOptIn: {type: Boolean, default: false},
    favorites: [{ type: Schema.Types.ObjectId, ref: "Product", index: true }],
    cart: [CartItemSchema],
  },
  {timestamps: true}
);

const User = models.User || model("User", UserSchema);
export default User;
