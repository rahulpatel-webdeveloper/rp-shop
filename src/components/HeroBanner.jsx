import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function HeroBanner() {
    const [featuredProducts, setFeatured] = useState([]);
    const badges = ['New', 'Popular', 'Featured'];

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('https://dummyjson.com/products?limit=3');
                const data = await res.json();
                // normalize to include image property
                const mapped = data.products.map(p => ({
                    id: p.id,
                    name: p.title,
                    image: p.thumbnail || (p.images && p.images[0]) || '',
                    description: p.description
                }));
                setFeatured(mapped);
            } catch (err) {
                console.error('Failed to load featured products', err);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <>
        <section className="hero-banner">
            <div className="hero-banner_container">
                <div className="hero-banner_row">
                    {/* Left Content Section */}
                    <div className="hero-banner_content">
                        <div className="hero-banner_content-inner">
                            <h1 className="hero-banner_title">
                                Discover
                                <br />
                                <span className="hero-banner_title-highlight">Premium</span>
                                <br />
                                Gadgets
                            </h1>
                            <p className="hero-banner_description">
                                Our collection features the finest technology products,
                                carefully curated for modern lifestyle and innovation.
                            </p>
                            <div className="hero-banner_buttons">
                                <Link to="/" className="hero-banner_btn hero-banner_btn--primary">
                                    Shop now
                                </Link>
                                <Link to="/about" className="hero-banner_btn hero-banner_btn--secondary">
                                    Explore products
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Product Cards Section */}
                    <div className="hero-banner_cards-section">
                        <div className="hero-banner_cards-container">
                            {featuredProducts.length === 0 ? (
                                <p className="hero-banner_loading">Loading featured products&hellip;</p>
                            ) : (
                                <>
                                    <div className="hero-banner_cards-grid">
                                        {/* First Column - Two stacked cards */}
                                        <div className="hero-banner_cards-column">
                                            <div className="hero-banner_cards-stack">
                                                {featuredProducts.length >= 2 && featuredProducts.slice(0, 2).map((product, index) => (
                                                    <div className="hero-banner_card-wrapper" key={product.id}>
                                                        <Link to={`/product/${product.id}`} className="hero-banner_card-link">
                                                            <div className="hero-banner_card hero-banner_card--small">
                                                                <div className="hero-banner_card-image-container">
                                                                    <span className={`hero-banner_badge hero-banner_badge--${index === 0 ? 'new' : 'popular'}`}>
                                                                        {badges[index]}
                                                                    </span>
                                                                    <div className="hero-banner_card-image-wrapper">
                                                                        <img
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            className="hero-banner_card-image"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                {/* Second Column - Featured large card */}
                                <div className="hero-banner_cards-column">
                                    {featuredProducts.length > 2 && (
                                        <div className="hero-banner_card hero-banner_card--featured">
                                            <div className="hero-banner_card-image-container hero-banner_card-image-container--featured">
                                                <span className="hero-banner_badge hero-banner_badge--featured">
                                                    {badges[2]}
                                                </span>
                                                <div className="hero-banner_card-image-wrapper hero-banner_card-image-wrapper--featured">
                                                    <img
                                                        src={featuredProducts[2].image}
                                                        alt={featuredProducts[2].name}
                                                        className="hero-banner_card-image hero-banner_card-image--featured"
                                                    />
                                                </div>
                                                <div className="hero-banner_card-overlay">
                                                    <h3 className="hero-banner_card-title">{featuredProducts[2].name}</h3>
                                                    <p className="hero-banner_card-text">
                                                        {featuredProducts[2].description.substring(0, 80)}...
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="hero-banner_card-footer">
                                                <h4 className="hero-banner_card-footer-title">{featuredProducts[2].name}</h4>
                                                <Link to={`/product/${featuredProducts[2].id}`} className="hero-banner_card-view-more">
                                                    View More
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                            {/* Decorative dots */}
                            <div className="hero-banner_dots">
                                {[...Array(12)].map((_, i) => (
                                    <span key={i} className="hero-banner_dot"></span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Additional split-screen variant below the original banner */}
        <section className="hero-banner-split">
            <div className="hero-banner_container">
                {/* For Him Section */}
                <Link to="/products" className="hero-banner_section hero-banner_section--left">
                    <div className="hero-banner_section-image">
                        <div className="hero-banner_section-overlay"></div>
                    </div>
                    {/* <div className="hero-banner_section-content">
                        <p className="hero-banner_section-label">WATCHES</p>
                        <h2 className="hero-banner_section-title">For Him</h2>
                    </div> */}
                </Link>

                {/* For Her Section */}
                <Link to="/products" className="hero-banner_section hero-banner_section--right">
                    <div className="hero-banner_section-image">
                        <div className="hero-banner_section-overlay"></div>
                    </div>
                    {/* <div className="hero-banner_section-content">
                        <p className="hero-banner_section-label">WATCHES</p>
                        <h2 className="hero-banner_section-title">For Her</h2>
                    </div> */}
                </Link>
            </div>
        </section>

        {/* split-screen section ended above */}
        </>
    );
}
