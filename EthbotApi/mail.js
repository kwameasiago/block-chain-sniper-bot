"use strict";
const nodemailer = require("nodemailer");

module.exports.sendMail = async (data) => {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // port: 587,
            secure: false, 
            auth: {
                user: process.env.MAIL_ADDR, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Crypto alert" <${process.env.MAIL_ADDR}>`, // sender address
            to: 'kwameasiago@gmail.com', // list of receivers
            subject: 'New pair detected', // Subject line
            text: data, // plain text body
            html: data, // html body
        });

        return {
            sent: true,
            info: info
        }
    } catch (error) {
        return {
            sent: false,
            error
        }
    }
}