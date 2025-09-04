import React from "react"
import "./touristBanner.css"

const TouristGuideBanner = () => {
    const guideData = {
        id: "1",
        image: "https://media.istockphoto.com/id/1071461664/photo/having-a-tour-through-the-city-streets.jpg?s=612x612&w=0&k=20&c=nlr914eKeQkYVpv7UgKCGU1oWLd97eRCi5e3jRggEhw=",
        sponsor: "Expert Local Help",
        title: "Hire Your Tourist Guide Here",
        description:
            "Embark on an unforgettable journey through the heart of our city with our expert-guided tour. Whether you're a history enthusiast, art lover, or culinary explorer, our tour offers something special for everyone...",
    }

    const handleLearnMore = () => {
        window.location.href = "/touristguide"
    }

    return (
        <div className="tourist-banner-container">
            <div className="tourist-banner-card">
                <div className="tourist-banner-image">
                    <img src={guideData.image || "/placeholder.svg"} alt={guideData.title} />
                </div>

                <div className="tourist-banner-content">
                    <div className="tourist-sponsor-text">{guideData.sponsor}</div>
                    <h2 className="tourist-banner-title">{guideData.title}</h2>
                    <p className="tourist-banner-description">{guideData.description}</p>
                </div>

                <div className="tourist-banner-action">
                    <button className="tourist-explore-button" onClick={handleLearnMore}>
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    )
}

const MoneyExchangeBanner = () => {
    const exchangeData = {
        id: "2",
        image: "https://thumbs.dreamstime.com/b/hand-holding-money-us-dollar-bills-money-exchange-concept-banknotes-44633182.jpg",
        sponsor: "Trusted Currency Services",
        title: "Best Rates for Currency Exchange",
        description:
            "Get the most competitive exchange rates for your travel money. Our secure and convenient currency exchange service ensures you get more value from your money with no hidden fees. Available at multiple locations throughout the city...",
    }

    const handleExchangeNow = () => {
        window.location.href = "/money-exchange"
    }

    return (
        <div className="tourist-banner-container">
            <div className="tourist-banner-card money-exchange-card">
                <div className="tourist-banner-image">
                    <img src={exchangeData.image || "/placeholder.svg"} alt={exchangeData.title} />
                </div>

                <div className="tourist-banner-content">
                    <div className="tourist-sponsor-text money-sponsor-text">{exchangeData.sponsor}</div>
                    <h2 className="tourist-banner-title">{exchangeData.title}</h2>
                    <p className="tourist-banner-description">{exchangeData.description}</p>
                </div>

                <div className="tourist-banner-action">
                    <button className="tourist-explore-button money-exchange-button" onClick={handleExchangeNow}>
                        Exchange Now
                    </button>
                </div>
            </div>
        </div>
    )
}
const TouristServices = () => {
    return (
        <div className="tourist-services-container">
            <TouristGuideBanner />
            <MoneyExchangeBanner />
        </div>
    )
}
export default TouristServices