import React from 'react';
import useFetch from '../../hooks/useFetch';
import './featuredProperties.css';


const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("http://localhost:8800/api/hotels?featured=true&limit=4");

  return (
    <div className="fp">
      {loading ? (
        "Loading please wait..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        data?.map((item, i) => (
          <div className="fpItem" key={item._id || i}>
            <img
              src={item.photos[0]}
              alt={item.name}
              className="fpImg"
            />
            <span className="fpName">{item.name}</span>
            <span className="fpCity">{item.city}</span>
            <span className="fpPrice">Starting from NPR {item.cheapestPrice} </span>
            {item.rating && (
              <div className="fpRating">
                <button>{item.rating}</button>
                <span>{item.rating >= 9 ? "Exceptional" : "Excellent"}</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FeaturedProperties;