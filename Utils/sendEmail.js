const nodemailer = require("nodemailer");
const Email = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

const sendEmail = async(to,subject,text)=>{
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: Email,
        pass:password
    }
})
await transporter.sendMail({
    from:Email,
    to,
    subject,
    html:text
})
};
module.exports = sendEmail;