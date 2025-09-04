import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './fullblog.css';

import Navbar from '../../../components/navbar/Navbar';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

const FullBlog = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/api/blogs/${blogId}`);
                const blogData = {
                    ...response.data,
                    authorName: response.data.userId?.username || response.data.author || 'Anonymous',
                    createdAt: response.data.createdAt ? new Date(response.data.createdAt) : null,
                };
                setBlog(blogData);
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Blog not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogId]);

    if (loading) return <div className="full-loading">Loading blog...</div>;
    if (error) return <div className="full-error">{error}</div>;
    if (!blog) return null;

    return (
        <>
            <Navbar />
            <Header />
            <div className="full-container modified-layout">
                {blog.img && (
                    <div className="full-img-wrapper">
                        <img src={blog.img} alt={blog.title} className="full-img" />
                    </div>
                )}

                <div className="full-meta-row">
                    <div className="full-left">
                        <h1 className="full-title">{blog.title}</h1>
                        <div className="full-author">By {blog.authorName}</div>
                    </div>

                    <div className="full-right">
                        {blog.createdAt && (
                            <div className="full-date">
                                {blog.createdAt.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        )}

                        {blog.tags?.length > 0 && (
                            <div className="full-tags">
                                {blog.tags.map((tag, i) => (
                                    <span key={i} className="full-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="full-content-centered">
                    <div
                        className="full-content"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FullBlog;
