import mongoose from 'mongoose';

const verticalSchema = new mongoose.Schema(
  {
    verticalId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

verticalSchema.index({ isActive: 1, sortOrder: 1 });

export const Vertical = mongoose.model('Vertical', verticalSchema);
