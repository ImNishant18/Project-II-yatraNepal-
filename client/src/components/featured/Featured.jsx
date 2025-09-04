import React from 'react';
import "./featured.css";
import useFetch from '../../hooks/useFetch.js';

const Featured = () => {
  const { data, loading, error } = useFetch(
    "http://localhost:8800/api/hotels/countByCity?cities=Kathmandu,Lalitpur,Bhaktapur"
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data — check console</div>;

  if (!Array.isArray(data) || data.length < 3) {
    console.error("Unexpected data shape:", data);
    return <div>Unexpected data format from API</div>;
  }

  return (
    <div className="featured">
      
      <div className="featuredItem">
        <img
          src="https://images.squarespace-cdn.com/content/v1/53ecd1bde4b0a6f9524254f8/1414752490093-6W1D5IV5FTQXW10IN20I/image-asset.jpeg?format=2500w"
          alt="Kathmandu"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Kathmandu</h1>
          <h2>{data[0]} Accommodation</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://www.nepalholiday.com/wp-content/uploads/2024/11/Kathmandu-Durbar-Square-City-Tour.webp"
          alt="Lalitpur"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Lalitpur</h1>
          <h2>{data[1]} Accommodation</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://greatergo.org/uploads/assets/Belt-and-road/Nepal/bake.jpg"
          alt="Bhaktapur"
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Bhaktapur</h1>
          <h2>{data[2]} Accommodation</h2>
        </div>
      </div>
    </div>
  );
};

export default Featured;