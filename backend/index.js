const express = require('express');
const mongoose = require('mongoose');
const User=require('./Models/User')
const jwt = require("jsonwebtoken");
const cors = require('cors');
require('dotenv').config();
const Product = require('./Models/Product');
const slugify = require('slugify'); 
const multer = require('multer');
const path = require('path');
const ContactUs = require('./Models/ContactUs');
const Order = require('./Models/Order');
const Review=require('./Models/Review');
const axios = require('axios');
const nodemailer = require('nodemailer');


const app = express();
const PORT = process.env.PORT || 5000;





const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors());
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://harrishere:Haris123@tododb.qyf9c.mongodb.net/clothingweb?retryWrites=true&w=majority&appName=Tododb';

mongoose.connect(MONGO_URI, {
    
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to the E-Commerce API 🚀');
});


app.post('/signup',async(req,res)=>{
    const{name,age,username,email,password}=req.body
    try{
        let user=await User.findOne({email})
        if (user)return res.status(400).json({message:"User already exists"})
        
        user=new User({name,age,username,email,password})
        await user.save()
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
              res.json({ token });
        }catch(err){
            console.error(err)
            res.status(500).json({error:"Server Error"})
        }
    
})
    



app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    
    try{
        let user=await User.findOne({email})
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }catch(error){
        res.status(500).json({ message: "Server Error" });
    }

})


app.get('/logout',async(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message: 'logged out successfully'});
})





app.post('/dashboard/add-product', upload.array('images', 10), async (req, res) => {
  let { name, description, originalPrice, discountedPrice, category, stock } = req.body;
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

  try {
    category = category.toLowerCase().trim();
    const slug = slugify(name, { lower: true, strict: true }); // ✅ Convert to slug

    const newProduct = new Product({
      name,
      description,
      originalPrice,
      discountedPrice,
      image: imagePaths,
      category,
      stock,
      slug
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding product' });
  }
});








app.get('/catalog', async (req, res) => {
  try {
    const products = await Product.find();
    
    if (!Array.isArray(products)) {
      return res.status(500).json({ error: 'Unexpected data format' });
    }

    res.status(200).json(products); // ✅ always an array
  } catch (err) {
    console.error('💥 Error in /catalog:', err);
    res.status(500).json({ error: 'Failed to fetch products' }); // ❌ object — frontend handles this
  }
});



app.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});





app.get('/category/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase().trim(); // ✅ Normalize input

  try {
    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found in this category' });
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching category products:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});




app.get('/product/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get reviews and calculate average rating
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

    res.json({
      ...product.toObject(),
      reviews,
      averageRating: averageRating.toFixed(1),
      reviewCount: reviews.length
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});



app.post('/contactUs',async(req,res)=>{
    const {name,email,subject,message}=req.body
    try{
        const contactUs=new ContactUs({name,email,subject,message})
        await contactUs.save()
        res.status(201).json({message:"Message sent successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Server Error"})
    }
})

app.get('/contactus/show',async(req,res)=>{
    try{
        const messages=await ContactUs.find()
        res.status(200).json(messages)
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Server Error"})
    }
})


app.post('/contactus/reply', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});


app.get('/new-arrival', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        
        
        const products = await Product.find({
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 }).limit(10);
        
        
        
        res.json(products);
    } catch (err) {
        
        res.status(500).json({ error: "Server Error" });
    }
});



app.get('/search', async (req, res) => {
  try {
    let { query } = req.query;
    console.log('Search query:', query); 
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    query = query.trim().toLowerCase();
    const keywords = query.split(/\s+/);

    const regexConditions = keywords.flatMap((word) => [
      { name: { $regex: new RegExp(word, 'i') } },
      { description: { $regex: new RegExp(word, 'i') } },
      { category: { $regex: new RegExp(word, 'i') } }
    ]);

    const products = await Product.find({ $or: regexConditions }).limit(20);

    if (products.length === 0) {
      console.log('No matches found for:', keywords);
    }

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});









app.post('/orders', async (req, res) => {
  try {
    const { customerName, email, phone, address, city, zipCode, products, totalAmount } = req.body;
    
    const newOrder = new Order({
      customerName,
      email,
      phone,
      address,
      city,
      zipCode,
      products,
      totalAmount,
      paymentMethod: 'cash-on-delivery'
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



app.get('/allOrder', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
app.put('/allOrder/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




app.get('/verify-whatsapp/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const whatsappApiUrl = `https://api.whatsapp.com/send?phone=${phone}`;
    
    // You might want to use a proper WhatsApp Business API here
    // This is just a placeholder implementation
    
    res.json({
      success: true,
      hasWhatsApp: true, // In a real implementation, you'd check this
      whatsappUrl: whatsappApiUrl
    });
  } catch (error) {
    console.error('WhatsApp verification error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});








app.get('/auth/me', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).send();
        }
        
        res.send({ user });
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
});






app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Add a review
app.post('/api/reviews', async (req, res) => {
  try {
    const { product, userName, userEmail, rating, comment } = req.body;

    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = await Review.create({
      product,
      userName,
      userEmail,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review' });
  }
});































app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});