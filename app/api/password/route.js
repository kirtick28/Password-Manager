import connectDB from '@/lib/connectDB';
import jwt from 'jsonwebtoken';
import Passwords from '@/models/Passwords';

export async function POST(req) {
  await connectDB();
  const header = req.headers.get('authorization');
  const token = header?.split(' ')[1];
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  let id;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    id = decoded.id;
  } catch (err) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
  const { label, usernameOrEmail, password, website } = await req.json();
  if (!label || !usernameOrEmail || !password) {
    return Response.json(
      { message: 'Label, username/email, and password are required' },
      { status: 400 }
    );
  }
  const existing = await Passwords.findOne({ id, label });
  if (existing) {
    return Response.json(
      { message: 'Label already exists. Choose a different one.' },
      { status: 409 }
    );
  }
  try {
    const entry = new Passwords({
      userId: id,
      label,
      usernameOrEmail,
      password,
      website
    });
    await entry.save();
    return Response.json({ message: 'Saved successfully' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  const header = req.headers.get('authorization');
  const token = header?.split(' ')[1];
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  let id;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    id = decoded.id;
  } catch (err) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
  try {
    const passwords = await Passwords.find({ userId: id }).sort({
      createdAt: -1
    });
    return Response.json({ passwords }, { status: 200 });
  } catch (err) {
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
