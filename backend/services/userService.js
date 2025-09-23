import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtUtils.js';

const SALT_ROUNDS = 10;

export const signupUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password_hash: hashedPassword }])
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Failed to create user');

  const { password_hash, ...userWithoutHash } = data[0];
  return userWithoutHash;
};


export const loginUser = async (username, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw new Error('Error fetching user');
  if (!data) throw new Error('User not found');

  const passwordMatch = await bcrypt.compare(password, data.password_hash);
  if (!passwordMatch) throw new Error('Incorrect password');

  const { password_hash, ...user } = data;

  const token = generateToken({ userId: user.id, username: user.username });

  return { user, token };
};
