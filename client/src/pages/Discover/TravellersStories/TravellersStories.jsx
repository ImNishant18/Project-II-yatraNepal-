import React, { useState } from 'react';
import './TravellersStories.css';
import { FaRegHeart, FaHeart, FaRegComment, FaMapMarkerAlt, FaCalendarAlt, FaUserAlt } from 'react-icons/fa';
import { GiMountainRoad, GiTempleGate,GiElephant } from 'react-icons/gi';
import Navbar from '../../../components/navbar/Navbar';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

const TravelStories = () => {
    const [activeTab, setActiveTab] = useState('featured');
    const [likedStories, setLikedStories] = useState({});

    const toggleLike = (storyId) => {
        setLikedStories(prev => ({
            ...prev,
            [storyId]: !prev[storyId]
        }));
    };

    const featuredStories = [
        {
            id: 1,
            title: "Trekking to Everest Base Camp: A Life-Changing Journey",
            author: "Sarah Johnson",
            date: "March 15, 2023",
            location: "Everest Region, Nepal",
            image: "https://b1088268.smushcdn.com/1088268/wp-content/uploads/2021/12/everest-base-camp-trek-1-scaled-1.jpg?lossy=2&strip=1&webp=1",
            content: "The Everest Base Camp trek cost me NPR 80,000 for 12 days, including permits, guide, and teahouses. Waking up to panoramic views of the Himalayas was worth every rupee. The day we reached base camp at 5,364m was emotional - standing in the shadow of the world's highest peak is something I'll never forget. Pro tip: Budget NPR 2,000-3,000 per day for extra snacks and drinks!",
            likes: 284,
            comments: 42,
            category: "trekking",
            readTime: "8 min read",
            icon: <GiMountainRoad />
        },
        {
            id: 2,
            title: "Discovering Kathmandu's Hidden Temples",
            author: "Rajesh Thapa",
            date: "January 5, 2023",
            location: "Kathmandu Valley",
            image: "https://www.mountainmarttreks.com/public/uploads/kathmandu-pagoda-temples-1.webp",
            content: "Exploring Kathmandu's temples on a budget of NPR 500 per day is possible! Beyond the famous Durbar Squares (entry NPR 1,000), I discovered tiny neighborhood shrines where elderly priests still perform ancient rituals. The most magical moment was stumbling upon a hidden courtyard in Patan where Newari craftsmen were creating intricate wood carvings using techniques unchanged for centuries.",
            likes: 156,
            comments: 23,
            category: "culture",
            readTime: "5 min read",
            icon: <GiTempleGate />
        }
    ];

    const recentStories = [
        {
            id: 3,
            title: "Jungle Safari in Chitwan: Spotting the Elusive Rhino",
            author: "Emma Wilson",
            date: "April 2, 2023",
            location: "Chitwan National Park",
            image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/77/9b/63/one-horn-rhino-in-chitwan.jpg?w=1200&h=-1&s=1",
            content: "Our 3-day jungle safari package cost NPR 15,000 including accommodation. We spotted rhinos, crocodiles, and countless birds. The elephant-back safari at sunrise (NPR 2,500 extra) was surreal - floating through the misty jungle as the world woke up. The Tharu cultural show in the evening (included) gave wonderful insight into local traditions.",
            likes: 98,
            comments: 15,
            category: "wildlife",
            readTime: "6 min read",
            icon: <GiElephant />
        },
        {
            id: 4,
            title: "Pokhara's Secret Sunrise Spot",
            author: "David Chen",
            date: "February 28, 2023",
            location: "Pokhara",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShDckp7IiPsT7Qzvh7QLeLIk_syAURWKFU3g&s",
            content: "Skip the crowded Sarangkot (NPR 500 entry) and visit the World Peace Pagoda instead (free entry). After a short boat ride (NPR 800) across Phewa Lake and a 30-minute hike, you reach this stunning white stupa with panoramic views of the Annapurnas. I arrived before dawn and had the place to myself as the first light painted the mountains pink.",
            likes: 132,
            comments: 28,
            category: "adventure",
            readTime: "4 min read",
            icon: <GiMountainRoad />
        }
    ];

    const popularStories = [
        {
            id: 5,
            title: "Living with Monks in a Himalayan Monastery",
            author: "Sophie Martin",
            date: "December 10, 2022",
            location: "Tengboche, Everest Region",
            image: "https://static-blog.treebo.com/wp-content/uploads/2023/04/Phuktal-Monastery-Zanskar-_flickr-1024x675.jpg",
            content: "I volunteered at Tengboche Monastery for NPR 5,000 donation, which included simple accommodation and meals. Waking at 4am for prayers, drinking endless butter tea, and learning about Buddhist philosophy transformed my understanding of happiness. The monks' laughter during our makeshift soccer games (played in maroon robes!) showed me joy exists everywhere.",
            likes: 421,
            comments: 67,
            category: "spiritual",
            readTime: "10 min read",
            icon: <GiTempleGate />
        },
        {
            id: 6,
            title: "The Hidden Valley of Upper Mustang",
            author: "Amit Sharma",
            date: "October 15, 2022",
            location: "Mustang, Nepal",
            image: "https://himalayasonfoot.com/wp-content/uploads/2024/02/Upper-Mustang-Trek.jpg",
            content: "The restricted area permit costs NPR 50,000 for 10 days, but this high desert kingdom is worth every rupee. Ancient cave dwellings, colorful prayer flags against red cliffs, and welcoming Lobas people who maintain traditions unchanged for centuries. Budget NPR 3,000-5,000 per day for basic accommodations but extraordinary landscapes.",
            likes: 387,
            comments: 53,
            category: "offbeat",
            readTime: "12 min read",
            icon: <GiMountainRoad />
        }
    ];

    const renderStories = () => {
        switch (activeTab) {
            case 'featured':
                return featuredStories;
            case 'recent':
                return recentStories;
            case 'popular':
                return popularStories;
            default:
                return [...featuredStories, ...recentStories, ...popularStories];
        }
    };

    return (
        <div className="travelerstories">
            <Navbar />
            <Header type="list" />
            
            {/* Banner */}
            <div className="travelerstories-banner">
                <div className="travelerstories-banner-content">
                    <h1>Travel Stories from Nepal</h1>
                    <p>Real experiences shared by travelers who've explored the Himalayas</p>
                </div>
            </div>

            <div className="travelerstories-container">
                <div className="travelerstories-header">
                    <h2>Inspiration for Your Journey</h2>
                    <p>Read personal accounts with practical budget tips in Nepali Rupees (NPR)</p>
                    
                    <div className="travelerstories-tabs">
                        <button 
                            className={activeTab === 'featured' ? 'active' : ''}
                            onClick={() => setActiveTab('featured')}
                        >
                            Featured Stories
                        </button>
                        <button 
                            className={activeTab === 'recent' ? 'active' : ''}
                            onClick={() => setActiveTab('recent')}
                        >
                            Recent Adventures
                        </button>
                        <button 
                            className={activeTab === 'popular' ? 'active' : ''}
                            onClick={() => setActiveTab('popular')}
                        >
                            Most Popular
                        </button>
                    </div>
                </div>

                <div className="travelerstories-grid">
                    {renderStories().map(story => (
                        <div key={story.id} className="travelerstories-card">
                            <div className="travelerstories-card-image">
                                <img src={story.image} alt={story.title} />
                                <div className="travelerstories-card-category">
                                    {story.icon}
                                    <span>{story.category}</span>
                                </div>
                            </div>
                            <div className="travelerstories-card-content">
                                <h3>{story.title}</h3>
                                
                                <div className="travelerstories-card-meta">
                                    <span><FaUserAlt /> {story.author}</span>
                                    <span><FaCalendarAlt /> {story.date}</span>
                                    <span><FaMapMarkerAlt /> {story.location}</span>
                                    <span>{story.readTime}</span>
                                </div>
                                
                                <p>{story.content}</p>
                                
                                <div className="travelerstories-card-actions">
                                    <button 
                                        className="travelerstories-like-btn"
                                        onClick={() => toggleLike(story.id)}
                                    >
                                        {likedStories[story.id] ? (
                                            <FaHeart className="liked" />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                        <span>{likedStories[story.id] ? story.likes + 1 : story.likes}</span>
                                    </button>
                                    <button className="travelerstories-comment-btn">
                                        <FaRegComment />
                                        <span>{story.comments}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="travelerstories-share">
                    <h3>Have a story to share?</h3>
                    <p>Contribute your own travel experience to inspire others</p>
                    <button className="travelerstories-cta-button">Share Your Story</button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TravelStories;