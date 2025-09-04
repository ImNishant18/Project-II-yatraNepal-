import Blog from "../models/Blog.js";

// Create a new blog post
export const createBlog = async (req, res) => {
    try {
        const { title, content, name, img, tags } = req.body;
        const userId = req.user.id;

        if (!title || !content || !userId || !name) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const newBlog = new Blog({
            title,
            content,
            userId,
            name,
            img,
            tags,
        });
        
        await newBlog.save();
        res.status(201).json({ success: true, blog: newBlog });
    } catch (err) {
        console.error("Create Blog Error:", err);
        res.status(500).json({ success: false, message: "Failed to create blog." });
    }
};
// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("userId", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);
    } catch (err) {
        console.error("Get All Blogs Error:", err);
        res.status(500).json({ message: "Failed to fetch blogs." });
    }
};

// Get all blogs by a specific user
export const getUserBlogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const blogs = await Blog.find({ userId })
            .populate("userId", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);
    } catch (err) {
        console.error("Get User Blogs Error:", err);
        res.status(500).json({ message: "Failed to fetch user blogs." });
    }
};

// Get a single blog by its ID
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID format (optional but good practice)
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid blog ID." });
        }

        // Fetch blog and populate user data
        const blog = await Blog.findById(id).populate("userId", "username email");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        res.status(200).json(blog);
    } catch (err) {
        console.error("Get Blog By ID Error:", err);
        res.status(500).json({ message: "Failed to fetch blog." });
    }
};
// Update a blog post
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        res.status(200).json({ success: true, blog: updatedBlog });
    } catch (err) {
        console.error("Update Blog Error:", err);
        res.status(500).json({ message: "Failed to update blog." });
    }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog deleted successfully." });
    } catch (err) {
        console.error("Delete Blog Error:", err);
        res.status(500).json({ message: "Failed to delete blog." });
    }
};
