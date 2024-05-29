import express from 'express';
import http from 'http';
import nodemailer from 'nodemailer';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
   origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.post('/mail-server', async (req, res, next) => {
   const { name, email, message } = req.body;
   const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
         user: process.env.MAIL_USER,
         pass: process.env.MAIL_PASS,
      },
   });

   await transporter
      .sendMail({
         from: process.env.MAIL_FROM,
         to: process.env.MAIL_TO,
         subject: 'New Message From Client',
         html: `
         <h3>${name}</h3>
         <br/>
         <h5>${email}</h5>
         <br/>
         <p>${message}</p>
         `,
      })
      .then((response) => {
         res.json({
            message: 'Message Sent',
            status: 'success',
            serverRes: { response },
         });
      })
      .catch((err) => {
         res.json({
            message: 'Message Sent Failed',
            status: 'rejected',
            serverRes: { err },
         });
      });
});
server.listen(process.env.PORT, () => {
   console.log('Server running on port ' + process.env.PORT);
});
