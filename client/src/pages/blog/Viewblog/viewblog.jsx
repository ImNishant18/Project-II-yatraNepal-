import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    FaUserEdit,
    FaCalendarAlt,
    FaSpinner,
    FaExclamationTriangle,
    FaNewspaper
} from 'react-icons/fa';

import './viewblog.css';
import Navbar from '../../../components/navbar/Navbar';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

const ViewBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [tagQuery, setTagQuery] = React.useState('');
    const [filteredBlogs, setFilteredBlogs] = React.useState([]);

    React.useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:8800/api/blogs');
                const blogData = response.data.map((blog) => ({
                    ...blog,
                    tags: Array.isArray(blog.tags) ? blog.tags : [],
                    authorName: blog.userId?.username || blog.author || 'Anonymous',
                    createdAt: blog.createdAt ? new Date(blog.createdAt) : null,
                }));
                setBlogs(blogData);
                setFilteredBlogs(blogData);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blogs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleSearch = () => {
        const filtered = blogs.filter((blog) =>
            blog.tags.some((tag) =>
                tag.toLowerCase().includes(tagQuery.trim().toLowerCase())
            )
        );
        setFilteredBlogs(filtered);
    };

    const handleViewAll = () => {
        setTagQuery('');
        setFilteredBlogs(blogs);
    };

    const handleViewFullBlog = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    if (loading) return (
        <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading blogs...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <p>{error}</p>
        </div>
    );

    if (!filteredBlogs.length) return (
        <div className="empty-state">
            <FaNewspaper className="empty-icon" />
            <h3>No Blogs Found</h3>
            <p>Try adjusting your search or check back later.</p>
            <button onClick={handleViewAll} className="view-all-btn">
                View All Blogs
            </button>
        </div>
    );

    return (
        <div className="blog-listing-page">
            <Navbar />
            <Header type="list" />

            <main className="blog-container">
                <div className="search-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by tag..."
                            value={tagQuery}
                            onChange={(e) => setTagQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="search-input"
                        />
                        <button onClick={handleSearch} className="search-btn">
                            Search
                        </button>
                        <button onClick={handleViewAll} className="view-all-btn">
                            View All
                        </button>
                    </div>
                </div>

                <div className="blog-grid">
                    {filteredBlogs.map((blog) => (
                        <article key={blog._id} className="blog-card">
                            {blog.img && (
                                <div className="blog-image-container">
                                    <img
                                        src={blog.img}
                                        alt={blog.title}
                                        className="blog-image"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            <div className="blog-content">
                                <header className="blog-header">
                                    <h2 className="blog-title">{blog.title}</h2>
                                    <div className="blog-meta">
                                        <span className="blog-author">
                                            <FaUserEdit className="meta-icon" />
                                            {blog.authorName}
                                        </span>
                                        {blog.createdAt && (
                                            <span className="blog-date">
                                                <FaCalendarAlt className="meta-icon" />
                                                {blog.createdAt.toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </header>

                                <div className="blog-actions">
                                    <button
                                        onClick={() => handleViewFullBlog(blog._id)}
                                        className="read-more-btn"
                                    >
                                        Read Full Article
                                    </button>
                                </div>

                                {blog.tags.length > 0 && (
                                    <footer className="blog-footer">
                                        <div className="tags-container">
                                            {blog.tags.map((tag, index) => (
                                                <span key={index} className="blog-tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </footer>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ViewBlog;