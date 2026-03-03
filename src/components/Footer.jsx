import { useState, useEffect } from 'react';
import '../styles/Footer.css';

export default function Footer() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const res = await fetch('https://dummyjson.com/products?limit=5');
                const data = await res.json();
                const featured = data.products.map(p => ({
                    id: p.id,
                    image: p.thumbnail || p.images?.[0] || ''
                }));
                setProducts(featured);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        fetchFeaturedProducts();
    }, []);

    const companyLinks = [
        { label: 'About Us', href: '/about' },
        { label: 'Delivery Information', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms & Conditions', href: '#' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Support Center', href: '#' }
    ];

    const categoryLinks = [
        { label: 'Dairy & Bakery', href: '/products?category=bakery' },
        { label: 'Fruits & Vegetable', href: '/products?category=produce' },
        { label: 'Snack & Spice', href: '/products?category=snacks' },
        { label: 'Juice & Drinks', href: '/products?category=beverages' },
        { label: 'Chicken & Meat', href: '/products?category=meat' },
        { label: 'Fast Food', href: '/products?category=fast-food' }
    ];

    const socialLinks = [
        { icon: 'f', label: 'Facebook', href: '#' },
        { icon: '𝕏', label: 'Twitter', href: '#' },
        { icon: '◆', label: 'Mastodon', href: '#' },
        { icon: '📷', label: 'Instagram', href: '#' }
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
    };

    return (
        <footer className="footer">
             {/* Product Gallery */}
            <div className="footer-gallery">
                <div className="container">
                    <div className="gallery-items">
                        {products.map((product) => (
                            <div key={product.id} className="gallery-item">
                                <img src={product.image} alt={`Product ${product.id}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-content">
                        {/* Left Section - Company Info */}
                        <div className="footer-section footer-company">
                            <div className="footer-logo">
                                <div className="footer-logo-icon">🍔</div>
                                <div>
                                    <h3 className="footer-logo-text"> RP Store</h3>
                                    <p className="footer-logo-subtitle">A treasure of Tastes</p>
                                </div>
                            </div>
                            <p className="footer-description">
                                RP Store is the biggest market of grocery products. Get your daily needs from our store.
                            </p>
                            <div className="footer-contact">
                                <div className="footer-contact-item">
                                    <span className="contact-icon">📍</span>
                                    <span>806, 807, Trinity Orion, near Jolly Residency, Vesu, Surat, Gujarat 395007</span>
                                </div>
                                <div className="footer-contact-item">
                                    <span className="contact-icon">✉️</span>
                                    <a href="mailto:rpatel.techark@gmail.com">rpatel.techark@gmail.com</a>
                                </div>
                                <div className="footer-contact-item">
                                    <span className="contact-icon">📞</span>
                                    <a href="tel:+911234567890">+91 123 4567890</a>
                                </div>
                            </div>
                        </div>

                        {/* Company Links Section */}
                        <div className="footer-section">
                            <h4 className="footer-section-title">Company</h4>
                            <ul className="footer-links">
                                {companyLinks.map((link, idx) => (
                                    <li key={idx}>
                                        <a href={link.href}>{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Category Links Section */}
                        <div className="footer-section">
                            <h4 className="footer-section-title">Category</h4>
                            <ul className="footer-links">
                                {categoryLinks.map((link, idx) => (
                                    <li key={idx}>
                                        <a href={link.href}>{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter Section */}
                        <div className="footer-section footer-newsletter">
                            <h4 className="footer-section-title">Subscribe Our Newsletter</h4>
                            <form className="newsletter-form" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    placeholder="Search here..."
                                    className="newsletter-input"
                                    required
                                />
                                <button type="submit" className="newsletter-btn">
                                    ➜
                                </button>
                            </form>
                            <div className="footer-social">
                                {socialLinks.map((social, idx) => (
                                    <a key={idx}
                                        href={social.href}
                                        className="social-link"
                                        title={social.label}
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           

            {/* Copyright Section */}
            <div className="footer-bottom">
                <div className="container">
                    <p className="footer-copyright">
                        &copy; 2026 <span className="brand-name">RP Store</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
