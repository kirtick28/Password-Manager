import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/connectDB';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();
  try {
    const exist = await User.findOne({ email });
    if (exist) {
      return Response.json({ message: 'User already exists' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '7d'
    });
    return Response.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
