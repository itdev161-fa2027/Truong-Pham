import express from 'express';
import connectDatabase from './config/db.js';
import User from './models/User.js';
import { check, validationResult } from 'express-validator';

const app = express();

// Connect Database
connectDatabase();

// Configure Middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Running');
});

app.post('/api/users', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}
res.send(req.body);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));