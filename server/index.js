require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2025-04-17',
});

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/contact', limiter);

const validateContactForm = [
  check('name').notEmpty().withMessage('Name is required').trim().escape(),
  check('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  check('message').notEmpty().withMessage('Message is required').trim(),
];

app.post('/api/contact', validateContactForm, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, message } = req.body;

    const result = await sanityClient.create({
      _type: 'contactMessage',
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    });

    if (!result) {
      throw new Error('Failed to save contact message');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
