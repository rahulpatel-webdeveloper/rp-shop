import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Header() {
    const { getCartCount } = useCart();
    const { currentUser, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const cartCount = getCartCount();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
            setSearchQuery('');
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="navbar-header">
            {/* Top Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div className="container-fluid px-4">
                    {/* Logo */}
                    <Link to="/" className="navbar-brand fw-bold fs-3 text-primary me-4" onClick={closeMobileMenu}>
                        RP Store
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form className="search-form d-none d-lg-flex flex-grow-1 mx-3" onSubmit={handleSearch}>
                        <div className="search-wrapper">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                🔍
                            </button>
                        </div>
                    </form>

                    {/* Icons Container - Desktop */}
                    <div className="navbar-icons d-none d-lg-flex align-items-center gap-3">
                        {/* Wishlist Icon */}
                        <Link to="/wishlist" className="icon-link" title="Wishlist">
                            <span className="icon-badge">❤️</span>
                        </Link>

                        {/* Cart Icon */}
                        <Link to="/cart" className="icon-link position-relative" title="Cart">
                            <span className="icon-badge">🛒</span>
                            {cartCount > 0 && (
                                <span className="badge-count">{cartCount > 9 ? '9+' : cartCount}</span>
                            )}
                        </Link>

                        {/* Account Icon */}
                        <Link to={currentUser ? "/account" : "/login"} className="icon-link" title="Account">
                            <span className="icon-badge">👤</span>
                        </Link>
                        {currentUser && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={logout}
                            >
                                Log out
                            </button>
                        )}
                    </div>

                    {/* Mobile Toggle Button */}
                    <button 
                        className="navbar-toggler d-lg-none" 
                        type="button"
                        onClick={toggleMobileMenu}
                        aria-controls="navbarNav" 
                        aria-expanded={mobileMenuOpen} 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

            {/* Menu Navbar */}
            <nav className="menu-navbar bg-light border-bottom d-none d-lg-block">
                <div className="container-fluid px-4">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <Link to="/" onClick={closeMobileMenu}>Home</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/products" onClick={closeMobileMenu}>Shop</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/categories" onClick={closeMobileMenu}>Categories</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/products?filter=new" onClick={closeMobileMenu}>New Arrivals</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/products?filter=bestseller" onClick={closeMobileMenu}>Best Sellers</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/deals" onClick={closeMobileMenu}>Deals / Offers</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/about" onClick={closeMobileMenu}>About Us</Link>
                        </li>
                        <li className="menu-item">
                            <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <h5>Menu</h5>
                    <button 
                        className="close-btn" 
                        onClick={closeMobileMenu}
                    >
                        ✕
                    </button>
                </div>

                {/* Mobile Search Bar */}
                <form className="mobile-search-form p-3 border-bottom" onSubmit={handleSearch}>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            🔍
                        </button>
                    </div>
                </form>

                {/* Mobile Menu Items */}
                <ul className="mobile-menu-list">
                    <li className="mobile-menu-item">
                        <Link to="/" onClick={closeMobileMenu}>Home</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/products" onClick={closeMobileMenu}>Shop</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/categories" onClick={closeMobileMenu}>Categories</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/products?filter=new" onClick={closeMobileMenu}>New Arrivals</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/products?filter=bestseller" onClick={closeMobileMenu}>Best Sellers</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/deals" onClick={closeMobileMenu}>Deals / Offers</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/about" onClick={closeMobileMenu}>About Us</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
                    </li>
                    <li className="mobile-menu-divider"></li>
                    <li className="mobile-menu-item">
                        <Link to="/wishlist" onClick={closeMobileMenu}>❤️ Wishlist</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to="/cart" onClick={closeMobileMenu}>🛒 Cart</Link>
                    </li>
                    <li className="mobile-menu-item">
                        <Link to={currentUser ? "/account" : "/login"} onClick={closeMobileMenu}>👤 My Account</Link>
                    </li>
                    {currentUser && (
                        <li className="mobile-menu-item">
                            <button
                                type="button"
                                className="btn btn-link p-0 text-start"
                                onClick={() => {
                                    logout();
                                    closeMobileMenu();
                                }}
                            >
                                Log out
                            </button>
                        </li>
                    )}
                </ul>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
            )}
        </header>
    );
}
