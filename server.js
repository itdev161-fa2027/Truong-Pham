import express from 'express';
import connectDatabase from './config/db.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import auth from './middleware/auth.js';

// Load environment variables
dotenv.config();

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
const { name, email, password } = req.body;
try {
    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
        return res.status(400).json({
            errors: [{ msg: 'User with this email already exists' }]
        });
    }
    // Create new user instance
    user = new User({
    name,
    email: email.toLowerCase(),
    password
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
        user: {
        id: user.id
        }
    };

    // Generate JWT token
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
        if (err) throw err;

        res.json({
            msg: 'User registered successfully',
            token
        });
    }
    );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
}
});

/**
 * @route POST api/auth
 * @desc Login user
 */
app.post('/api/auth', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });
    
        if (!user) {
            return res.status(400).json({
                errors: [{ msg: 'Invalid credentials' }]
            });
        }
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
            errors: [{ msg: 'Invalid credentials' }]
        });
        }

        // Create JWT payload
        const payload = {
        user: {
        id: user.id
    }
};

        // Generate JWT token
        jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
        if (err) throw err;

        res.json({
            msg: 'User logged in successfully',
            token
        });
    }
    );

    } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
    }
});

/**
 * @route   DELETE api/posts/:id
 * @desc    Delete a post
 */
app.delete('/api/posts/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if user owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'User not authorized'
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Post removed' });
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }

        res.status(500).send('Server error');
    }
});

/**
 * @route   GET api/posts
 * @desc    Get all posts
 */
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name')
            .sort({ createDate: -1 });

        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

/**
 * @route   GET api/posts/:id
 * @desc    Get single post
 */
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'name');

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).send('Server error');
    }
});

/**
 * @route   POST api/posts
 * @desc    Create a post
 */
app.post(
    '/api/posts',
    [
        auth,
        check('title', 'Title is required').not().isEmpty(),
        check('body', 'Body is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, body } = req.body;

            const newPost = new Post({
                user: req.user.id,
                title,
                body,
            });

            const post = await newPost.save();

            // Populate user data before returning
            await post.populate('user', 'name');

            res.json(post);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);

/**
 * @route   PUT api/posts/:id
 * @desc    Update a post
 */
app.put(
    '/api/posts/:id',
    [
        auth,
        check('title', 'Title is required').not().isEmpty(),
        check('body', 'Body is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, body } = req.body;

            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            // Check if user owns the post
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({
                    msg: 'User not authorized'
                });
            }

            post.title = title;
            post.body = body;

            await post.save();
            await post.populate('user', 'name');

            res.json(post);
        } catch (error) {
            console.error(error.message);

            if (error.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: 'Post not found'
                });
            }

            res.status(500).send('Server error');
        }
    }
);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));