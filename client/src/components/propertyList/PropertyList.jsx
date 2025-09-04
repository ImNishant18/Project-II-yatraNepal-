import React from 'react';
import useFetch from '../../hooks/useFetch.js';
import './propertyList.css';

const propertyTypeData = [
  {
    type: "Hotel",
    image: "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o="
  },
    {
    type: "Boutique",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/c1/4c/boutique-hotels.jpg"
  }
  ,
  {
    type: "Apartment",
    image: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg"
  },
  {
    type: "Villa",
    image: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg"
  },
  {
    type: "Cabin",
    image: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg"
  },
  {
    type: "Resort",
    image: "https://www.cvent.com/sites/default/files/image/2024-10/Hyatt-Regency-Grand-Reserve.jpg"
  }
];

const PropertyList = () => {
  const { data, loading, error } = useFetch("http://localhost:8800/api/hotels/countByType");

  // Create a map from API response: type -> count
  const countMap = {};
  if (data) {
    data.forEach(item => {
      countMap[item.type.toLowerCase()] = item.count;
    });
  }

  return (
    <div className="pList">
      {loading ? (
        "Loading please wait..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        propertyTypeData.map((item, i) => {
          const typeKey = item.type.toLowerCase();
          const count = countMap[typeKey] || 0;

          return (
            <div className="pListItem" key={i}>
              <img src={item.image} alt={item.type} className="pListImg" />
              <div className="pListTitles">
                <h1>{item.type}</h1>
                <h2>{count} {item.type}</h2>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PropertyList;
