const supabase = require('../config/db');

async function createSession(session) {
  return await supabase.from('sessions').insert([session]).select();
}

async function getSessions() {
  return await supabase.from('sessions').select('*');
}

module.exports = { createSession, getSessions };
