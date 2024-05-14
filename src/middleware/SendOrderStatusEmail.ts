const nodemailer = require('nodemailer');

const SMTP_KEY = process.env.SMTP_KEY

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // or 587 if using STARTTLS
  secure: false, // Use `true` for port 465 (SSL/TLS)
  auth: {
    user: "gitgrub.order@gmail.com",
    pass: SMTP_KEY,
  },
});

const sendEmail = async (to :string, orderStatus : string , message: String) =>{
    let mailOptions = {
        from: 'gitgrub.order@gamil.com',
        to: to,
        subject: 'Your order status is '+ orderStatus,
        text: 'Greetings\nHope this email finds you well.' + message + "\n\n\n\n\n\n\n\nTeam GitGrub"
      };
    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });
  
  };

export {transporter , sendEmail}