import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    return (
        <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                <Link to="/" className="navbar-brand fw-bold fs-3 text-primary">RP Store</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>                       
                        <li className="nav-item">
                            <Link to="/about" className="nav-link">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/blog" className="nav-link">Blog</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">Contact Us</Link>
                        </li>
                        <li className="nav-item ms-3">
                            <Link to="/cart" className="nav-link position-relative cart-icon" style={{padding: "0", fontSize: "24px", color: "black" }}>
                                🛒
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
