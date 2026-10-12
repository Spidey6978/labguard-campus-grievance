import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false,
    },
    usn: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    college: {
      type: String,
      trim: true,
      default: 'Dayananda Sagar College of Engineering',
    },
    department: {
      type: String,
      trim: true,
      default: 'Computer Science & Engineering',
    },
    role: {
      type: String,
      enum: ['student', 'technician', 'admin'],
      default: 'student',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
