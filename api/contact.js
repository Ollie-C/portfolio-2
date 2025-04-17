import { createClient } from '@sanity/client';

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2025-04-17',
});

// Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Simple form validation
const validateForm = (name, email, message) => {
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!email || !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (!message || message.trim() === '') {
    errors.push({ field: 'message', message: 'Message is required' });
  }

  return errors;
};

// Rate limiting implementation (simplified)
const ipLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3; // 3 requests per window

const isRateLimited = (ip) => {
  const now = Date.now();

  // Clean up expired entries
  for (const [storedIp, data] of ipLimitMap.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW_MS) {
      ipLimitMap.delete(storedIp);
    }
  }

  // Check if IP is rate limited
  if (!ipLimitMap.has(ip)) {
    ipLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  const data = ipLimitMap.get(ip);
  if (data.count >= RATE_LIMIT_MAX) {
    return true;
  }

  // Increment count
  ipLimitMap.set(ip, { ...data, count: data.count + 1 });
  return false;
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Check rate limit
    const clientIp = req.headers['x-forwarded-for'] || 'unknown';
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      });
    }

    // Get form data
    const { name, email, message } = req.body;

    // Validate form data
    const validationErrors = validateForm(name, email, message);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    // Save to Sanity
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.',
    });
  }
}
