// Dynamic CORS configuration
const allowedOrigins: (string | RegExp)[] = [
  'http://localhost:5173', // Local Vite
  'http://localhost:3000', // Local Backend (sometimes needed)
  'https://road-map-builder.vercel.app', // Vercel
  /\.ngrok-free\.app$/, // Any ngrok sub-domain
];

export const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // This is required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie', 'ngrok-skip-browser-warning'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  maxAge: 86400, // 24 hours
};