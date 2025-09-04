import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./image-slider.css";

function ImageSlider() {
    const [images, setImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef(null);

    // Fetch images from backend
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get("http://localhost:8800/api/imageslider");
                setImages(res.data);
            } catch (error) {
                console.error("Failed to fetch images:", error);
            }
        };
        fetchImages();
    }, []);

    const startAutoSlide = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 3000);
    }, [images.length]);

    // Set up continuous auto slide every 3s
    useEffect(() => {
        if (images.length === 0) return;

        startAutoSlide();
        return () => stopAutoSlide();
    }, [images, activeIndex, startAutoSlide]);

    const stopAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const slideNext = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const slidePrev = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (images.length === 0) {
        return <div>Loading images...</div>;
    }

    return (
        <div
            className="container__slider"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
        >
            {images.map((img, index) => (
                <div
                    key={img._id}
                    className={
                        "slider__item " +
                        (activeIndex === index ? "slider__item-active" : "slider__item-inactive")
                    }
                >
                    <img
                        src={img.imagePath}
                        alt={img.name}
                        className="slider__image"
                    />
                </div>
            ))}

            <div className="container__slider__links">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={
                            activeIndex === index
                                ? "container__slider__links-small container__slider__links-small-active"
                                : "container__slider__links-small"
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveIndex(index);
                        }}
                    ></button>
                ))}
            </div>

            <button className="slider__btn-next" onClick={slideNext}>
                {">"}
            </button>
            <button className="slider__btn-prev" onClick={slidePrev}>
                {"<"}
            </button>
        </div>
    );
}

export default ImageSlider;
