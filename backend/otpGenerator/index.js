var nodemailer = require('nodemailer');

// Option 1: Using Gmail service (recommended)
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'sowbika002@gmail.com',
//     pass: 'yzjv wdon nvoz ehgt' 
//   }
// });

// Option 2: Manual SMTP configuration (alternative)

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'sowbika002@gmail.com',
    pass: 'yzjv wdon nvoz ehgt' 
  },
  tls: {
    rejectUnauthorized: false
  }
});


var mailOptions = {
  from: 'sowbika002@gmail.com',
  to: 'shobikannu002@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

// Add better error handling
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Error occurred:', error.message);
    console.log('Error code:', error.code);
    console.log('Error command:', error.command);
  } else {
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  }
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP connection failed:', error);
  } else {
    console.log('SMTP connection successful, server is ready to take messages');
  }
});