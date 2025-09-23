import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtUtils.js';

const SALT_ROUNDS = 10;

export const signupAdmin = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const { data, error } = await supabase
    .from('admins')
    .insert([{ username, password_hash: hashedPassword }])
    .select(); 

  if (error) throw error;
  return data[0];
};

export const loginAdmin = async (username, password) => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw new Error('Error fetching admin from database');
  if (!data) throw new Error('Admin with this username does not exist');

  const passwordMatch = await bcrypt.compare(password, data.password_hash);
  if (!passwordMatch) throw new Error('Incorrect password');

  const { password_hash, ...admin } = data;

  // Generate JWT token with relevant payload
  const token = generateToken({ adminId: admin.id, username: admin.username });

  return { admin, token };
};
