const supabase = require('../config/db');

async function createQuestion(question) {
  return await supabase.from('questions').insert([question]).select();
}

async function getQuestions() {
  return await supabase.from('questions').select('*');
}

module.exports = { createQuestion, getQuestions };
