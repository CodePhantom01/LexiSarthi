const cron = require('node-cron');
const User = require('../models/userModel');
const Word = require('../models/wordModel');
const sendEmail = require('../services/emailService');

// Runs every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  const users = await User.find({ dailyWordEmail: true });
  if (!users.length) return;

  const word = await Word.findOne();

  const emailHtml = `
    <h2>${word.word}</h2>
    <p><b>Hindi:</b> ${word.meaningHindi}</p>
    <p><b>Pronunciation:</b> ${word.pronunciation}</p>

    <p><b>Examples:</b></p>
    <ul>
      ${word.example.map(e => `<li>${e}</li>`).join('')}
    </ul>

    <p><b>Synonyms:</b> ${word.synonyms.join(', ')}</p>
    <p><b>Antonyms:</b> ${word.antonyms.join(', ')}</p>
  `;

  for (const user of users) {
    sendEmail(
      user.email,
      `Daily Word: ${word.word}`,
      emailHtml
    );
  }
});
