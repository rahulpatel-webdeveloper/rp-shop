import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function ProductSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const sliderRef = useRef(null);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlay]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    return (
        <section className="product-slider">
            <div className="product-slider__header">
                <h2 className="product-slider__title">Featured Products</h2>
                <p className="product-slider__subtitle">Swipe through our best sellers</p>
            </div>

            <div
                className="product-slider__container"
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
                ref={sliderRef}
            >
                {/* Previous Button */}
                <button
                    className="product-slider__nav product-slider__nav--prev"
                    onClick={goToPrevious}
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </button>

                {/* Slides Track */}
                <div className="product-slider__track">
                    <div
                        className="product-slider__slides"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {products.map((product) => (
                            <div className="product-slider__slide" key={product.id}>
                                <div className="product-slider__card">
                                    <div className="product-slider__card-image">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-slider__card-content">
                                        <h3 className="product-slider__card-title">{product.name}</h3>
                                        <p className="product-slider__card-description">{product.description}</p>
                                        <div className="product-slider__card-footer">
                                            <span className="product-slider__card-price">₹{product.price}</span>
                                            <Link to={`/product/${product.id}`} className="product-slider__card-button">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    className="product-slider__nav product-slider__nav--next"
                    onClick={goToNext}
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>
            </div>

            {/* Dots Navigation */}
            <div className="product-slider__dots">
                {products.map((_, index) => (
                    <button
                        key={index}
                        className={`product-slider__dot ${index === currentIndex ? 'product-slider__dot--active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
