import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    return Response.json(user);
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== id) {
      return Response.json({ message: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: body.name,
        email: body.email,
        password: hashedPassword
      },
      { new: true }
    );
    return Response.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
