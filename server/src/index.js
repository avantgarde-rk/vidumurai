const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.get('/api/announcements', async (req, res) => {
    try {
        const Announcement = require('./models/Announcement');
        const list = await Announcement.find().sort({ createdAt: -1 }).populate('postedBy', 'name role');
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/announcements', async (req, res) => {
    try {
        const Announcement = require('./models/Announcement'); // Lazy load
        const item = await Announcement.create({ ...req.body, postedBy: '6564e1d4b1a2c3d4e5f6a7b8' }); // Mock ID for now or req.user if auth middleware attached
        res.json(item);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Vidumurai API' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const featureRoutes = require('./routes/featureRoutes'); // New

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/features', featureRoutes); // New Route
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
