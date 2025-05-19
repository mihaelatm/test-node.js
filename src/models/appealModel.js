import mongoose from "mongoose";
import { appealStatus } from "../constants/appealStatus.js";

const appealSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(appealStatus),
      default: appealStatus.NEW,
    },
    solution: { type: String, required: true },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

const Appeal = mongoose.model("Appeal", appealSchema);
export default Appeal;
