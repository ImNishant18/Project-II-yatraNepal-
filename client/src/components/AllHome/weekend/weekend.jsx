import React from "react"
import "./weekend.css"

export default function WeekendGetaways() {
    const destinations = [
        {
            id: 1,
            name: "Lalitpur",
            country: "Nepal",
            image:
                "https://i.guim.co.uk/img/media/f399717f6fb80a54f8c8e8191e5ae94c8f2c80fc/0_100_3487_2092/master/3487.jpg?width=700&quality=85&auto=format&fit=max&s=0d4b88c7abe3c0011bb03f64203fa336",
        },
        {
            id: 2,
            name: "Bhaktapur",
            country: "Nepal",
            image:
                "https://assets.simplotel.com/simplotel/image/upload/x_0,y_34,w_644,h_362,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/the-nanee-nepal/Bhaktapur_By_night_3_ycysnm",
        },
        {
            id: 3,
            name: "Kavrepalanchowk",
            country: "Nepal",
            image: "https://indreshworhomestay.wordpress.com/wp-content/uploads/2024/03/indreshwor-temple-1.jpg?w=1024",
        },
        {
            id: 4,
            name: "Pokhara",
            country: "Nepal",
            image: "https://accessnepaltour.com/wp-content/uploads/2023/12/lake-5903329-2-scaled-1.jpg",
        },
    ]

    return (
        <div className="weekend-container">
            <h1 className="weekend-heading">Weekend getaways from Kathmandu</h1>
            <div className="weekend-destinations">
                {destinations.map((destination) => (
                    <div className="weekend-destination-card" key={destination.id}>
                        <img
                            src={destination.image || "/placeholder.svg"}
                            alt={`${destination.name}, ${destination.country}`}
                            className="weekend-destination-image"
                        />
                        <div className="weekend-destination-label">
                            <h2>
                                {destination.name}, {destination.country}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Promotional Banner */}
            <div className="weekend-promo-banner">
                <div className="weekend-banner-image">
                    <img
                        src="https://nepalpeakadventure.com/wp-content/uploads/2024/03/historical-places-1024x512.webp"
                        alt="Adventure in Nepal"
                        className="weekend-banner-photo"
                    />
                </div>
                <div className="weekend-banner-content">
                    <div className="weekend-sponsor-text">
                        <span className="weekend-sponsor-logo">
                            <img
                                src="https://ntb.gov.np/storage/media/1920/ntb_logo-1663927863_resized1920.jpg"
                                alt="Nepal Tourism"
                                width={50}
                                height={50}
                            />
                        </span>
                        <span>
                            Sponsored by <strong>Nepal Tourism</strong>
                        </span>
                    </div>
                    <h2 className="weekend-banner-headline">Adventure is better with local guides</h2>
                    <p className="weekend-banner-description">
                        Exploring Nepal just got easier. Find authentic experiences, local insights, and must-visit cultural
                        hotspots to start planning your perfect Himalayan getaway together.
                    </p>
                    <button className="weekend-learn-more-btn">Learn more</button>
                </div>
            </div>
        </div>
    )
}