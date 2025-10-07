import Product from '../models/Product.js';
import { productSchema, productUpdateSchema } from '../middleware/productValidation.js';

export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } 
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const createProduct = async (req, res) => {
    try {
        const {error, value } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: "Validation failed",
                details: error.details.map( (err) => err.message ),
            });
        }
        
        const newProduct = new Product(value);
        const savedProduct = await newProduct.save();

        res.status(201).json({ success: true, data: savedProduct });
    } 
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const updateProduct = async (req, res) => {
    try {
        const { error, value } = productUpdateSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: "Validation failed",
                details: error.details.map( (err) => err.message ),
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } 
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id );
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}