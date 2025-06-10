var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail.com',
  auth: {
    user: 'sowbika002@gmail.com',
    pass: 'yzjv wdon nvoz ehgt'
  }
});

var mailOptions = {
  from: 'sowbika002@gmail.com',
  to: 'shobikannu002@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});