import { Schema, model, models, InferSchemaType } from "mongoose";

const VariantSchema = new Schema(
  {
    sku: { type: String, trim: true },
    size: { type: String, trim: true },   // np. S/M/L lub 30/32
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    price: { type: Number, required: true, min: 0 }, // w pensach/groszach
    currency: { type: String, default: "GBP" },
    images: { type: [String], default: [] },
    gender: { type: String, enum: ["MENS", "WOMENS", "KIDS"], required: true, index: true },
    collectionSlug: { type: String, required: true, index: true }, // slug kolekcji
    tags: { type: [String], default: [], index: true },
    variants: { type: [VariantSchema], default: [] },
    isRecommended: { type: Boolean, default: false, index: true },
    popularity: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// przydatne sortowania
ProductSchema.index({ collectionSlug: 1, createdAt: -1 });
ProductSchema.index({ collectionSlug: 1, price: 1 });

export type ProductDoc = InferSchemaType<typeof ProductSchema>;
export default models.Product || model("Product", ProductSchema);
