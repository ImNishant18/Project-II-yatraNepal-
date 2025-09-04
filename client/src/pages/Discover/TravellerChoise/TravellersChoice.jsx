import React, { useState } from 'react';
import './TravellersChoice.css';
import { FaMountain, FaHiking, FaUtensils, FaHotel, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { GiMountainRoad, GiTempleGate, GiMonkey, GiElephant } from 'react-icons/gi';
import { MdOutlineFlight, MdOutlineDirectionsBike, MdOutlineDirectionsBoat } from 'react-icons/md';
import { BiSolidBowlRice } from 'react-icons/bi';
import Navbar from '../../../components/navbar/Navbar';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';


const TravellersChoice = () => {
    const [selectedCategory, setSelectedCategory] = useState('destinations');

    const destinations = [
        {
            id: 1,
            name: "Kathmandu Valley",
            image: "https://photo.ntb.gov.np/public/uploads/preview/basantapur-durbar-square-117491652462254blbkfhxhsp.jpg",
            description: "Explore ancient temples, bustling markets, and rich cultural heritage in Nepal's capital region.",
            rating: 4.8,
            reviews: 2847,
            highlights: ["Durbar Squares", "Swayambhunath Temple", "Boudhanath Stupa", "Pashupatinath", "Thamel District"],
            bestTime: "Sep-Nov, Mar-May",
            priceRange: "NPR 5,000-15,000 per day",
            icon: <GiTempleGate />
        },
        {
            id: 2,
            name: "Pokhara",
            image: "https://www.adventurevisiontreks.com/uploads/pokhara-view-from-world-peace-stupa.jpg",
            description: "Gateway to the Annapurnas with stunning lake views and adventure activities.",
            rating: 4.9,
            reviews: 1923,
            highlights: ["Phewa Lake", "Sarangkot Sunrise", "Adventure Sports", "World Peace Pagoda", "Davis Falls"],
            bestTime: "Year-round",
            priceRange: "NPR 4,000-12,000 per day",
            icon: <GiMountainRoad />
        },
        {
            id: 3,
            name: "Everest Base Camp",
            image: "https://explorerspassage.com/wp-content/uploads/2021/12/everest-base-camp-trek-1-scaled-1.jpg",
            description: "The ultimate trekking destination offering breathtaking Himalayan views.",
            rating: 4.7,
            reviews: 1456,
            highlights: ["Mount Everest Views", "Sherpa Culture", "High Altitude Trek", "Namche Bazaar", "Kala Patthar"],
            bestTime: "Mar-May, Sep-Nov",
            priceRange: "NPR 80,000-150,000 (full trek)",
            icon: <FaMountain />
        },
        {
            id: 4,
            name: "Chitwan National Park",
            image: "https://www.greenparkchitwan.com/storage/posts/August2022/chitwan%20national%20park.png",
            description: "Wildlife safari destination famous for rhinos, tigers, and diverse ecosystems.",
            rating: 4.6,
            reviews: 987,
            highlights: ["Jungle Safari", "Rhino Spotting", "Canoe Rides", "Elephant Breeding Center", "Tharu Culture"],
            bestTime: "Oct-Mar",
            priceRange: "NPR 6,000-20,000 per day",
            icon: <GiElephant />
        },
        {
            id: 5,
            name: "Lumbini",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5zA4bFHOF9yvhxSO3DJsc7jCFG8p0UHRe4w&s",
            description: "Birthplace of Lord Buddha and important pilgrimage site with ancient monasteries.",
            rating: 4.5,
            reviews: 876,
            highlights: ["Maya Devi Temple", "Sacred Garden", "International Monasteries", "Peace Stupa", "Archaeological Sites"],
            bestTime: "Oct-Mar",
            priceRange: "NPR 3,000-10,000 per day",
            icon: <GiTempleGate />
        },
        {
            id: 6,
            name: "Bhaktapur",
            image: "https://holidaynepal.com/nepal/images/bhaktapur.jpg",
            description: "Medieval city with well-preserved architecture and traditional Newari culture.",
            rating: 4.7,
            reviews: 765,
            highlights: ["Bhaktapur Durbar Square", "Pottery Square", "Nyatapola Temple", "Local Cuisine", "Handicrafts"],
            bestTime: "Year-round",
            priceRange: "NPR 2,000-8,000 per day",
            icon: <GiTempleGate />
        }
    ];

    const experiences = [
        {
            id: 1,
            name: "Annapurna Circuit Trek",
            image: "https://www.nepalhightrek.com/wp-content/uploads/2023/10/Annapurna-Circuit-Trek-3.jpg",
            description: "Classic high-altitude trek through diverse landscapes and cultures.",
            rating: 4.8,
            reviews: 1234,
            duration: "15-20 days",
            difficulty: "Moderate to Challenging",
            priceRange: "NPR 100,000-200,000",
            bestSeason: "Mar-May, Sep-Nov",
            icon: <FaHiking />
        },
        {
            id: 2,
            name: "Cultural Heritage Tour",
            image: "https://mysticadventureholidays.com/_next/image?url=https%3A%2F%2Fmedia.app.mysticadventureholidays.com%2Fuploads%2Ffullbanner%2Fmystic-adventure-holidays-seven-heritage-sites.webp&w=3840&q=75",
            description: "Immerse yourself in Nepal's rich history and traditions.",
            rating: 4.7,
            reviews: 856,
            duration: "7-10 days",
            difficulty: "Easy",
            priceRange: "NPR 50,000-120,000",
            bestSeason: "Year-round",
            icon: <GiTempleGate />
        },
        {
            id: 3,
            name: "Paragliding in Pokhara",
            image: "https://hsj.com.np/uploads/0000/1/2020/06/05/paragliding-in-pokhara.jpg",
            description: "Soar above the beautiful Pokhara valley with Himalayan backdrop.",
            rating: 4.9,
            reviews: 654,
            duration: "Half day",
            difficulty: "Easy",
            priceRange: "NPR 8,000-12,000",
            bestSeason: "Oct-Dec, Feb-Apr",
            icon: <MdOutlineFlight />
        },
        {
            id: 4,
            name: "White Water Rafting",
            image: "https://smokymtnriverrat.com/nitropack_static/sjNDYflJxOlVBjYMKZOuIchGHlwfrXYG/assets/images/optimized/rev-22718fd/smokymtnriverrat.com/wp-content/uploads/2024/03/RRW-_-Family-Upper-_-8-_-faded-bottom-white.webp",
            description: "Exciting rapids on Nepal's Himalayan rivers with stunning scenery.",
            rating: 4.6,
            reviews: 543,
            duration: "1-3 days",
            difficulty: "Moderate",
            priceRange: "NPR 6,000-15,000",
            bestSeason: "Sep-Nov, Mar-May",
            icon: <MdOutlineDirectionsBoat />
        },
        {
            id: 5,
            name: "Mountain Biking",
            image: "https://fis-api.luxuryholidaynepal.com/media/attachments/Mountain-Biking-in-Nepal.jpg",
            description: "Explore Himalayan trails on two wheels with breathtaking views.",
            rating: 4.5,
            reviews: 432,
            duration: "1-7 days",
            difficulty: "Moderate",
            priceRange: "NPR 5,000-30,000",
            bestSeason: "Oct-May",
            icon: <MdOutlineDirectionsBike />
        },
        {
            id: 6,
            name: "Jungle Safari",
            image: "https://www.chitwanjunglesafaritour.com/wp-content/uploads/2020/02/chitwan-jeep-safari-1035x540.jpg",
            description: "Wildlife adventure in Chitwan or Bardia National Parks.",
            rating: 4.7,
            reviews: 321,
            duration: "2-4 days",
            difficulty: "Easy",
            priceRange: "NPR 15,000-40,000",
            bestSeason: "Oct-Mar",
            icon: <GiMonkey />
        }
    ];

    const foods = [
        {
            id: 1,
            name: "Dal Bhat",
            image: "https://mildlyindian.com/wp-content/uploads/2021/10/dal-bhat-1080x765.jpg",
            description: "Traditional Nepali meal with lentil soup, rice, vegetables, and pickles.",
            rating: 4.6,
            reviews: 432,
            type: "Main Course",
            mustTry: "With gundruk and achar",
            priceRange: "NPR 200-500",
            icon: <BiSolidBowlRice />
        },
        {
            id: 2,
            name: "Momos",
            image: "https://images.squarespace-cdn.com/content/v1/55d729cfe4b00ab3960e7989/1469961270168-7BAAAGCW7A6VOZA5QR0A/image-asset.jpeg",
            description: "Steamed dumplings filled with meat or vegetables, served with spicy sauce.",
            rating: 4.8,
            reviews: 789,
            type: "Snack",
            mustTry: "Buff momos with sesame chutney",
            priceRange: "NPR 150-400",
            icon: <FaUtensils />
        },
        {
            id: 3,
            name: "Newari Khaja Set",
            image: "https://i.pinimg.com/736x/08/51/82/0851825855bd4543baa9e67d4afac534.jpg",
            description: "Traditional Newari platter with various meats, beaten rice, and accompaniments.",
            rating: 4.7,
            reviews: 345,
            type: "Full Meal",
            mustTry: "With local aila (rice wine)",
            priceRange: "NPR 500-1,200",
            icon: <BiSolidBowlRice />
        },
        {
            id: 4,
            name: "Thakali Thali",
            image: "https://ajadynasty.com/wp-content/uploads/2022/06/IMG-0521.jpg",
            description: "Flavorful set meal from the Thakali people with buckwheat specialties.",
            rating: 4.6,
            reviews: 567,
            type: "Main Course",
            mustTry: "With local ghee and timur ko chhop",
            priceRange: "NPR 400-900",
            icon: <BiSolidBowlRice />
        },
        {
            id: 5,
            name: "Yomari",
            image: "https://photo.ntb.gov.np/public/uploads/preview/yomari-yamari-114031642952313kb0mrekb4r.jpg",
            description: "Sweet rice flour dumplings filled with molasses and sesame, a Newari delicacy.",
            rating: 4.5,
            reviews: 234,
            type: "Dessert",
            mustTry: "During Yomari Punhi festival",
            priceRange: "NPR 50-150 each",
            icon: <FaUtensils />
        },
        {
            id: 6,
            name: "Sel Roti",
            image: "https://i.ytimg.com/vi/aZa_N9e0Rdg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCfAISIc4rpLGPCp_TYu7oCykudMA",
            description: "Traditional homemade, sweet, ring-shaped rice bread/doughnut.",
            rating: 4.5,
            reviews: 456,
            type: "Snack",
            mustTry: "With yogurt or vegetable curry",
            priceRange: "NPR 30-100 each",
            icon: <FaUtensils />
        }
    ];

    const accommodations = [
        {
            id: 1,
            name: "Dwarika's Hotel",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbdC1QCc--9CgbzwqvjYgUG3zkVqEKF2XT_Q&s",
            description: "Luxury heritage hotel showcasing traditional Nepali architecture.",
            rating: 4.9,
            reviews: 987,
            type: "Luxury",
            location: "Kathmandu",
            priceRange: "NPR 25,000-50,000/night",
            icon: <FaHotel />
        },
        {
            id: 2,
            name: "Tiger Palace Resort",
            image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/291606241.jpg?k=e806fbf8520cb818f4a8f4e93ae03ede66b062bc76da62bb1276a83c81f265c3&o=&hp=1",
            description: "Wildlife-themed resort near Chitwan National Park.",
            rating: 4.7,
            reviews: 765,
            type: "Resort",
            location: "Bharatpur",
            priceRange: "NPR 15,000-30,000/night",
            icon: <FaHotel />
        },
        {
            id: 3,
            name: "Fishtail Lodge",
            image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/88/65/02/fish-tail-lodge-enjoys.jpg?w=900&h=-1&s=1",
            description: "Iconic lakeside retreat in Pokhara with stunning mountain views.",
            rating: 4.8,
            reviews: 876,
            type: "Boutique",
            location: "Pokhara",
            priceRange: "NPR 12,000-25,000/night",
            icon: <FaHotel />
        },
        {
            id: 4,
            name: "Yeti Mountain Home",
            image: "https://media.licdn.com/dms/image/D5612AQGgTMZAJq7ZpQ/article-cover_image-shrink_720_1280/0/1688093818979?e=2147483647&v=beta&t=7CoUloApeAf5tdNUBeHy55MhX9r2SoBulf3YxlWQr8M",
            description: "Comfortable teahouse lodges along Everest trekking routes.",
            rating: 4.6,
            reviews: 654,
            type: "Mountain Lodge",
            location: "Everest Region",
            priceRange: "NPR 5,000-10,000/night",
            icon: <FaHotel />
        },
        {
            id: 5,
            name: "Temple Tree Resort",
            image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/369288929.jpg?k=89e9411ed595a7932bab0a2125d0783171729349bdd10bb47dba00ba3c499d80&o=&hp=1",
            description: "Boutique resort with traditional Newari architecture in Pokhara.",
            rating: 4.7,
            reviews: 543,
            type: "Boutique",
            location: "Pokhara",
            priceRange: "NPR 10,000-20,000/night",
            icon: <FaHotel />
        },
        {
            id: 6,
            name: "Hyatt Regency",
            image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/430692688.jpg?k=5a0f144acafd427e7ff82b3abffb2160416bfa532688fa9d69b1235c59d6780d&o=&hp=1",
            description: "International luxury hotel in Kathmandu with excellent facilities.",
            rating: 4.8,
            reviews: 432,
            type: "Luxury",
            location: "Kathmandu",
            priceRange: "NPR 20,000-40,000/night",
            icon: <FaHotel />
        }
    ];

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="travelerchoice-star travelerchoice-star-filled" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="travelerchoice-star travelerchoice-star-half" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="travelerchoice-star travelerchoice-star-empty" />);
        }

        return stars;
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case 'destinations':
                return (
                    <div className="travelerchoice-cards-grid">
                        {destinations.map(destination => (
                            <div key={destination.id} className="travelerchoice-card">
                                <div className="travelerchoice-card-image">
                                    <img src={destination.image} alt={destination.name} />
                                    <div className="travelerchoice-card-badge">Top Choice</div>
                                </div>
                                <div className="travelerchoice-card-content">
                                    <div className="travelerchoice-card-icon">{destination.icon}</div>
                                    <h3>{destination.name}</h3>
                                    <div className="travelerchoice-rating">
                                        {renderStars(destination.rating)}
                                        <span className="travelerchoice-rating-text">
                                            {destination.rating} ({destination.reviews.toLocaleString()} reviews)
                                        </span>
                                    </div>
                                    <p>{destination.description}</p>
                                    <div className="travelerchoice-highlights">
                                        {destination.highlights.map((highlight, index) => (
                                            <span key={index} className="travelerchoice-highlight-tag">{highlight}</span>
                                        ))}
                                    </div>
                                    <div className="travelerchoice-details">
                                        <div className="travelerchoice-detail">
                                            <strong>Best Time:</strong> {destination.bestTime}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Price:</strong> {destination.priceRange}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'experiences':
                return (
                    <div className="travelerchoice-cards-grid">
                        {experiences.map(experience => (
                            <div key={experience.id} className="travelerchoice-card">
                                <div className="travelerchoice-card-image">
                                    <img src={experience.image} alt={experience.name} />
                                    {experience.rating >= 4.7 && <div className="travelerchoice-card-badge">Popular</div>}
                                </div>
                                <div className="travelerchoice-card-content">
                                    <div className="travelerchoice-card-icon">{experience.icon}</div>
                                    <h3>{experience.name}</h3>
                                    <div className="travelerchoice-rating">
                                        {renderStars(experience.rating)}
                                        <span className="travelerchoice-rating-text">
                                            {experience.rating} ({experience.reviews.toLocaleString()} reviews)
                                        </span>
                                    </div>
                                    <p>{experience.description}</p>
                                    <div className="travelerchoice-details">
                                        <div className="travelerchoice-detail">
                                            <strong>Duration:</strong> {experience.duration}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Difficulty:</strong> {experience.difficulty}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Price:</strong> {experience.priceRange}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Best Season:</strong> {experience.bestSeason}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'food':
                return (
                    <div className="travelerchoice-cards-grid travelerchoice-food-grid">
                        {foods.map(food => (
                            <div key={food.id} className="travelerchoice-card travelerchoice-food-card">
                                <div className="travelerchoice-card-image">
                                    <img src={food.image} alt={food.name} />
                                    {food.rating >= 4.7 && <div className="travelerchoice-card-badge">Must Try</div>}
                                </div>
                                <div className="travelerchoice-card-content">
                                    <div className="travelerchoice-card-icon">{food.icon}</div>
                                    <h3>{food.name}</h3>
                                    <div className="travelerchoice-rating">
                                        {renderStars(food.rating)}
                                        <span className="travelerchoice-rating-text">
                                            {food.rating} ({food.reviews.toLocaleString()} reviews)
                                        </span>
                                    </div>
                                    <p>{food.description}</p>
                                    <div className="travelerchoice-details">
                                        <div className="travelerchoice-detail">
                                            <strong>Type:</strong> {food.type}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Must Try:</strong> {food.mustTry}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Price:</strong> {food.priceRange}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'accommodations':
                return (
                    <div className="travelerchoice-cards-grid">
                        {accommodations.map(accommodation => (
                            <div key={accommodation.id} className="travelerchoice-card">
                                <div className="travelerchoice-card-image">
                                    <img src={accommodation.image} alt={accommodation.name} />
                                    <div className="travelerchoice-card-badge">Recommended</div>
                                </div>
                                <div className="travelerchoice-card-content">
                                    <div className="travelerchoice-card-icon">{accommodation.icon}</div>
                                    <h3>{accommodation.name}</h3>
                                    <div className="travelerchoice-rating">
                                        {renderStars(accommodation.rating)}
                                        <span className="travelerchoice-rating-text">
                                            {accommodation.rating} ({accommodation.reviews.toLocaleString()} reviews)
                                        </span>
                                    </div>
                                    <p>{accommodation.description}</p>
                                    <div className="travelerchoice-details">
                                        <div className="travelerchoice-detail">
                                            <strong>Type:</strong> {accommodation.type}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Location:</strong> {accommodation.location}
                                        </div>
                                        <div className="travelerchoice-detail">
                                            <strong>Price:</strong> {accommodation.priceRange}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="travelerchoice">
            <Navbar />
            <Header type="list" />

            <div className="travelerchoice-banner">
                <div className="travelerchoice-banner-content">
                    <h2>Discover Nepal's Treasures</h2>
                    <p>Explore the most recommended places, experiences, and flavors by fellow travelers</p>
                    <button className="travelerchoice-banner-btn">Start Exploring</button>
                </div>
            </div>

            <div className="travelerchoice-container">
                <nav className="travelerchoice-category-nav">
                    <button
                        className={`travelerchoice-category-btn ${selectedCategory === 'destinations' ? 'travelerchoice-active' : ''}`}
                        onClick={() => setSelectedCategory('destinations')}
                    >
                        <FaMountain className="travelerchoice-nav-icon" /> Destinations
                    </button>
                    <button
                        className={`travelerchoice-category-btn ${selectedCategory === 'experiences' ? 'travelerchoice-active' : ''}`}
                        onClick={() => setSelectedCategory('experiences')}
                    >
                        <FaHiking className="travelerchoice-nav-icon" /> Experiences
                    </button>
                    <button
                        className={`travelerchoice-category-btn ${selectedCategory === 'food' ? 'travelerchoice-active' : ''}`}
                        onClick={() => setSelectedCategory('food')}
                    >
                        <FaUtensils className="travelerchoice-nav-icon" /> Food & Drink
                    </button>
                    <button
                        className={`travelerchoice-category-btn ${selectedCategory === 'accommodations' ? 'travelerchoice-active' : ''}`}
                        onClick={() => setSelectedCategory('accommodations')}
                    >
                        <FaHotel className="travelerchoice-nav-icon" /> Stays
                    </button>
                </nav>

                <main className="travelerchoice-main-content">
                    <div className="travelerchoice-content-header">
                        <h2>
                            {selectedCategory === 'destinations' && 'Top Destinations in Nepal'}
                            {selectedCategory === 'experiences' && 'Must-Try Experiences'}
                            {selectedCategory === 'food' && 'Authentic Nepali Cuisine'}
                            {selectedCategory === 'accommodations' && 'Recommended Stays'}
                        </h2>
                        <p>
                            {selectedCategory === 'destinations' && 'From ancient temples to towering peaks, discover Nepal\'s most captivating places'}
                            {selectedCategory === 'experiences' && 'Adventure, culture, and unforgettable moments await you'}
                            {selectedCategory === 'food' && 'Taste the rich flavors and traditional dishes of Nepal'}
                            {selectedCategory === 'accommodations' && 'Find your perfect stay from luxury hotels to cozy guesthouses'}
                        </p>
                    </div>

                    {renderContent()}
                </main>

                <div className="travelerchoice-newsletter-section">
                    <h3>Get Travel Inspiration</h3>
                    <p>Subscribe to our newsletter for the latest travel tips and special offers</p>
                    <div className="travelerchoice-newsletter-form">
                        <input type="email" placeholder="Your email address" />
                        <button className="travelerchoice-subscribe-btn">Subscribe</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TravellersChoice;