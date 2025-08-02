import connectDB from '@/lib/connectDB';
import jwt from 'jsonwebtoken';
import Passwords from '@/models/Passwords';

export async function PUT(req, { params }) {
  await connectDB();
  const header = req.headers.get('authorization');
  const token = header?.split(' ')[1];
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
  const { id } = params;
  const { label, usernameOrEmail, password, website } = await req.json();
  if (!label || !usernameOrEmail || !password) {
    return Response.json(
      { message: 'Label, username/email, and password are required' },
      { status: 400 }
    );
  }
  try {
    const user = await Passwords.findOne({ _id: id, userId });
    if (!user) {
      return Response.json({ message: 'Entry not found' }, { status: 404 });
    }
    user.label = label;
    user.usernameOrEmail = usernameOrEmail;
    user.password = password;
    user.website = website;
    await user.save();
    return Response.json({ message: 'Updated successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const header = req.headers.get('authorization');
  const token = header?.split(' ')[1];
  if (!token) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
  const { id } = params;
  try {
    const deleted = await Passwords.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return Response.json({ message: 'Entry not found' }, { status: 404 });
    }
    return Response.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}
