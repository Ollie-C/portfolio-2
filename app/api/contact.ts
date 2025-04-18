import { createClient } from '@sanity/client';

// Check for required environment variables
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;

// Log warning if environment variables are missing
if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
  console.warn(
    'Missing Sanity credentials. Contact form submissions will not be saved.'
  );
  console.warn('Required env variables: SANITY_PROJECT_ID, SANITY_TOKEN');
}

// Initialize Sanity client
const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID || 'MISSING_PROJECT_ID',
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN || 'MISSING_TOKEN',
  useCdn: false,
  apiVersion: '2023-03-25',
});

// Function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Define validation error type
type ValidationError = {
  field: string;
  message: string;
};

// Simple form validation
const validateForm = (
  name: string,
  email: string,
  message: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

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
type IPLimitData = {
  count: number;
  timestamp: number;
};

const ipLimitMap = new Map<string, IPLimitData>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3; // 3 requests per window

const isRateLimited = (ip: string): boolean => {
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

  const data = ipLimitMap.get(ip)!;
  if (data.count >= RATE_LIMIT_MAX) {
    return true;
  }

  // Increment count
  ipLimitMap.set(ip, { ...data, count: data.count + 1 });
  return false;
};

interface Request {
  method: string;
  headers: {
    [key: string]: string | undefined;
  };
  body: any;
}

interface Response {
  setHeader: (name: string, value: string | boolean | string[]) => void;
  status: (code: number) => Response;
  json: (data: any) => void;
  end: () => void;
}

export default async function handler(req: Request, res: Response) {
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

    // Check if Sanity credentials are available
    if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
      console.warn(
        'Cannot save contact message - Sanity credentials are missing'
      );
      return res.status(200).json({
        success: true,
        message:
          'Your message has been received (dev mode - not saved to Sanity)',
      });
    }

    // Save to Sanity
    try {
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
    } catch (sanityError) {
      console.error('Error saving to Sanity:', sanityError);
      // In development, return success even if Sanity save fails
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          message:
            'Your message has been received (dev mode - Sanity error handled)',
        });
      }
      throw sanityError; // Re-throw in production
    }
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.',
    });
  }
}
