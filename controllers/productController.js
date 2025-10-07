import Product from '../models/Product.js';
import { productSchema, productUpdateSchema } from '../middleware/productValidation.js';
// @desc   Get all products (with filtering, pagination, and search)
// @route  GET /api/products

export const getAllProducts = async (req, res) => {
    try{
        const {category, search, page = 1, limit = 10} = req.query;
        const query = {};

        if (category) {
            query.category = category;
        }
        //search by name 
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // case-insensitive search
        }
        const skip = (page - 1) * limit;
        const products = await Product.find(query)
        .skip(skip)
        .limit(parseInt(limit));
        
        const total = await Product.countDocuments(query);
        res.json({
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        results: products,
    });
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
// @desc   Get product statistics (count by category)
// @route  GET /api/products/stats
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          inStockCount: { $sum: { $cond: ['$inStock', 1, 0] } },
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


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