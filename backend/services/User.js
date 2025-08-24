const supabase = require('../config/db');

async function createUser(user) {
  return await supabase.from('users').insert([user]).select();
}

async function getUserByEmail(email) {
  return await supabase.from('users').select('*').eq('email', email).single();
}

module.exports = { createUser, getUserByEmail };
