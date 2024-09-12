import express from 'express';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
	const { to, subject, text } = req.body;

	if (!to || !subject || !text) {
		return res.status(400).json({
			error: 'Please provide email, subject, and message body.',
		});
	}

	let transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: true,
		auth: {
			user: process.env.SMTP_EMAIL_ADDRESS,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	try {
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to,
			subject,
			text,
		});

		res.status(200).json({ message: 'Email sent successfully!' });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ error: 'Failed to send email.' });
	}
});

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});
