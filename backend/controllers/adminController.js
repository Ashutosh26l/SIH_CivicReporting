import { signupAdmin, loginAdmin } from '../services/adminService.js';

export const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const admin = await signupAdmin(username, password);
    res.status(201).json({ message: 'Admin created', admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const { admin, token } = await loginAdmin(username, password);
    res.json({ message: 'Login successful', admin, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
