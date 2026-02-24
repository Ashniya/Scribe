import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // 1. Save to MongoDB
        const newContact = new Contact({
            firstName,
            lastName,
            email,
            message
        });

        await newContact.save();

        // 2. Send email notification
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'surakshasharma303@gmail.com',
                subject: `New Scribe Contact Form Submission from ${firstName} ${lastName}`,
                html: `
                    <h2>New Contact Message</h2>
                    <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                    <hr />
                    <p>This message was sent from the Scribe Contact Form.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('✅ Email notification sent to surakshasharma303@gmail.com');
        } catch (emailError) {
            console.error('❌ Failed to send email notification:', emailError);
            // We don't return an error to the user because the message WAS saved to the database
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.'
        });
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong while sending the message. Please try again later.'
        });
    }
};
