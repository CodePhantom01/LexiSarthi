const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { name, email, password, dailyWordEmail } = req.body;

  // basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // prevent admin signup
  if (email === process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Admin account already exists' });
  }
  
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    dailyWordEmail: dailyWordEmail || false
  });

  // generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(201).json({ token });
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  

  res.json({ token });
};

const getProfile = async (req, res) => {
    const userId = req.user.id;
  
    const user = await User.findById(userId).select('-password');
  
    res.status(200).json({
      message: 'Profile fetched successfully',
      user,
    });
  };

  const toggleDailyWordEmail = async (req, res) => {
    const user = await User.findById(req.user.id);
  
    //toggle true - false
    user.dailyWordEmail = !user.dailyWordEmail;
    await user.save();
  
    res.json({
      message: user.dailyWordEmail
        ? 'Daily word email turned ON'
        : 'Daily word email turned OFF'
    });
  };

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "UserNotFound" });
    }

    const { name, email, password } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password;

    await user.save();

    // remove password in the response
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "UserNotFound" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { signup, login, getProfile, toggleDailyWordEmail, updateProfile, deleteProfile};
