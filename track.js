require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.json());

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- User Schema ---
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    lastSignUp: Date,
    lastLogin: Date,
    lastCheck: Date,
});

const User = mongoose.model('User', userSchema);

// --- Gmail transporter ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// --- Routes ---

// Register or update user
app.post('/user', async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ name, email, lastSignUp: new Date(), lastLogin: new Date(), lastCheck: new Date() });
            await user.save();
            res.send('User registered successfully!');
        } else {
            user.lastLogin = new Date();
            await user.save();
            res.send('User login updated!');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error!');
    }
});

// Update last check manually
app.post('/user/check', async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found!');
        user.lastCheck = new Date();
        await user.save();
        res.send('Last check updated!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error!');
    }
});

// --- Daily Report Scheduler ---
cron.schedule('0 9 * * *', async () => { // every day at 9AM
    try {
        const users = await User.find({});
        for (let user of users) {
            await transporter.sendMail({
                from: `"WeatherClut Reports" <${process.env.GMAIL_USER}>`,
                to: user.email,
                subject: 'Daily WeatherClut Report',
                text: `Hello ${user.name}, here is your daily report!\n\nLast Sign Up: ${user.lastSignUp}\nLast Login: ${user.lastLogin}\nLast Check: ${user.lastCheck}`
            });
        }
        console.log('Daily reports sent successfully!');
    } catch (err) {
        console.error('Error sending daily reports:', err);
    }
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
