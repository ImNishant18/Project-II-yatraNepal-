import mongoose from "mongoose";

const ImagesSliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  imageType: {
    type: String,
    required: true,
    enum: ["image/jpeg", "image/png"],
  },
  imagePath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ImagesSlider || mongoose.model("ImagesSlider", ImagesSliderSchema);
