import nodemailer from 'nodemailer';
// import { Resend } from 'resend';
import Config from '../config.js';
import Logger from './logger.js';
// const resend = new Resend('re_3jJK8g1L_8KUh6kPsN1M46151Kj6jRDWG');

const sendVerification = async (email: string, token: string): Promise<void> => {
	const logger = Logger.instance().logger();
	logger.info(`Sending verification email to ${email}`);

	// resend.emails.send({
	// 	from: 'onboarding@resend.dev',
	// 	to: email,
	// 	subject: 'Account Verification',
	// 	// http://localhost:5000/verify/?email=jessada.pranee@gmail.com&token=9e0089e57e54acd9505fe9fc999db41aaafc1ff8
	// 	text: `Verification Token: http://localhost:${Config.BACKEND_PORT}/verify/?email=${email}&token=${token} in 1 hour`,
	// });

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			// ถ้าใช้ gmail ต้องไปเปิด https://www.google.com/settings/security/lesssecureapps ให้เป็น on
			// from https://stackoverflow.com/questions/26196467/sending-email-via-node-js-using-nodemailer-is-not-working
			user: process.env.EMAIL, // your Gmail email address
			pass: process.env.PASSWORD, // your Gmail password
		},
	});
	const mailOptions = {
		from: process.env.EMAIL, // sender address
		to: email, // list of receivers
		subject: 'Account Verification', // Subject line
		text: `Verification Token: http://localhost:${Config.BACKEND_PORT}/verify/?email=${email}&token=${token} in 1 hour`, // plain text body
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			logger.error('Error sending verification email:', error);
		} else {
			logger.info('Verification email sent:', info.response);
		}
	});
	logger.info(`finish resend`);
};
const sendResetPassword = async (email: string, token: string): Promise<void> => {
	const logger = Logger.instance().logger();
	// logger.info(`Sending verification email to ${email}`);
	// resend.emails.send({
	// 	from: 'onboarding@resend.dev',
	// 	to: email,
	// 	subject: 'Account Verification',
	// 	// http://localhost:5000/verify/?email=jessada.pranee@gmail.com&token=9e0089e57e54acd9505fe9fc999db41aaafc1ff8
	// 	text: `OTP : ${token} in 15 miniute`,
	// });
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			// ถ้าใช้ gmail ต้องไปเปิด https://www.google.com/settings/security/lesssecureapps ให้เป็น on
			// from https://stackoverflow.com/questions/26196467/sending-email-via-node-js-using-nodemailer-is-not-working
			user: process.env.EMAIL, // your Gmail email address
			pass: process.env.PASSWORD, // your Gmail password
		},
	});
	const mailOptions = {
		from: process.env.EMAIL, // sender address
		to: email, // list of receivers
		subject: 'Reset Account Password', // Subject line
		text: `OTP : ${token} in 15 miniute`, // plain text body
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			logger.error('Error sending verification email:', error);
		} else {
			logger.info('Verification email sent:', info.response);
		}
	});
};

export { sendResetPassword, sendVerification };

// nodemailer.createTransport({
// 	host: 'live.smtp.mailtrap.io',
// 	port: 587,
// 	auth: {
// 		user: 'api', // your Gmail email address
// 		pass: 'ab6665cab74e62320c76a3620d08f97a', // your Gmail password
// 	},
// });

// const transporter = nodemailer.createTransport({
// 	host: 'live.smtp.mailtrap.io',
// 	port: 587,
// 	auth: {
// 		user: 'api', // your Gmail email address
// 		pass: 'ab6665cab74e62320c76a3620d08f97a', // your Gmail password
// 	},
// });
