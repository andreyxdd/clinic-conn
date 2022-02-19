import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import logger from './log';

require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const email = '';

// eslint-disable-next-line function-paren-newline
export const sendConfirmation = async (
  emailTo: string, username: string, confirmationURL: string) => {
  // preparing the html part of email to be send
  const filePath = path.join(__dirname, '../assets/confirmationEmail.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    confirmationURL,
    username,
  };
  const htmlToSend = template(replacements);

  // preparing SG message
  const msg = {
    to: emailTo,
    from: process.env.EMAIL_FROM,
    subject: 'Welcome to WorldMedExpo! Confirm Your Account',
    preheader: 'Let\'s confirm your new account',
    html: htmlToSend,
  };

  // sending over email
  try {
    await sgMail.send(msg);
  } catch (e) {
    logger.error(e);
    if (e.response) {
      logger.error(e.response.body);
    }
  }
};
