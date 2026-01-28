// Dynamic CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173', // Your local Vite dev server
      'http://localhost:3000',
      'https://road-map-builder.vercel.app', // Your Vercel deployment
    ];

    // Check if origin is allow-listed or is an ngrok tunnel
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.ngrok-free.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie','ngrok-skip-browser-warning'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  maxAge: 86400, // 24 hours
};