import express from 'express';
import http from 'http';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
   process.env.CLIENT_ID,
   process.env.CLIENT_SECRET,
   process.env.REDIRECT_URL
);
oauth2Client.setCredentials({
   refresh_token: process.env.REFRESH_TOKEN,
});

async function sendMail() {
   try {
      const accessToken = await oauth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
         host: 'smtp.gmail.com',
         port: 465,
         secure: true,
         auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_ADDRESS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token as string,
         },
      });
      const response = await transport.sendMail({
         to: 'skye6ix@gmail.com',
         subject: 'Testing Message',
         text: 'I hope this message find you',
      });
      return response;
   } catch (error) {
      console.log(error);
      return error;
   }
}
app.post('/mail-server', (req, res, next) => {
   sendMail()
      .then((res) => {
         console.log(res);
      })
      .catch((err) => {
         console.log(err);
      });
});
server.listen(PORT, () => {
   console.log('Server running on port ' + PORT);
});
