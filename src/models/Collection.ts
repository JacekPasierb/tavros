import { Schema, model, models, InferSchemaType } from "mongoose";

const CollectionSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    gender: {
      type: [String],
      required: true,
      enum: ["MENS", "WOMENS", "KIDS"],
      index: true,
    },
    heroImage: { type: String, default: "" },
    sortOrder: { type: Number, default: 0, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Dodatkowe indeksy (poza unique na slug)
CollectionSchema.index({ gender: 1, sortOrder: 1 });

export type CollectionDoc = InferSchemaType<typeof CollectionSchema>;
export default models.Collection || model("Collection", CollectionSchema);
