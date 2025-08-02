import mongoose from 'mongoose';

const PasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    label: { type: String, required: true },
    usernameOrEmail: { type: String, required: true },
    password: { type: String, required: true },
    website: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Passwords ||
  mongoose.model('Passwords', PasswordSchema);
