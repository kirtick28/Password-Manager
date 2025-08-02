import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/connectDB';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 400 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: 'Invalid credentials' }, { status: 400 });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return Response.json(
      {
        token,
        user: { id: user._id, name: user.name, email: user.email }
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
