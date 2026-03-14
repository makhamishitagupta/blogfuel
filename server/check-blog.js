import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const BlogSchema = new mongoose.Schema({
    title: String,
    isActive: { type: Boolean, default: true }
}, { strict: false });

const Blog = mongoose.model('Blog', BlogSchema);

async function checkBlog() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        const id = '69b54166715c6015ca4d1ea5';
        const blog = await Blog.findById(id);
        if (blog) {
            console.log(`Blog found: "${blog.title}", isActive: ${blog.isActive}`);
        } else {
            console.log('Blog not found in database.');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkBlog();
