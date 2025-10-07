import express from 'express';
const router = express.Router();
import { getAllProducts, getProductById, getProductStats, createProduct, updateProduct, deleteProduct} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/stats', getProductStats);
// Protect routes that modify data
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
