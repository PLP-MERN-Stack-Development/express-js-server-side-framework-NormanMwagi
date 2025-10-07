import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { requestLogger } from './middleware/requestLogger.js';
import {  errorHandler } from './middleware/errorHandler.js';

// Initialize dotenv
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDb();

// Use Helmet globally for security
app.use(helmet());

// Middleware setup
app.use(bodyParser.json());
app.use(requestLogger);
app.use('/api/products', productRoutes);

// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize());


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
export default app;