import fetch from 'node-fetch';

async function listBlogs() {
    try {
        const response = await fetch('http://localhost:5000/blog/getAll');
        const data = await response.json();
        console.log('Active Blog IDs:');
        data.blogs.forEach(blog => console.log(`- ${blog._id} (${blog.title})`));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listBlogs();
