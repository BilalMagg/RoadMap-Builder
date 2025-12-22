import dotenv from 'dotenv';

const getEnv = () => {
  if (typeof (import.meta)?.env !== 'undefined') {
    return (import.meta).env;
  }
  
  // 2. Essaie process.env (Node.js/Jest)
  if (typeof process !== 'undefined' && process.env) {
    dotenv.config();
    return process.env;
  }
  
  // 4. Fallback : objet vide
  return {};
};

const env = getEnv();

const config = {
  apiUrl: env.VITE_API_URL
};

export default config;