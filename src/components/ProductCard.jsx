import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/Wishlist.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = () => {
        addToCart(product, 1);
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className='container'>
            <div className="card h-100 shadow-sm border-0 transition-hover position-relative">
                <button
                    type="button"
                    className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                    title="Add to wishlist"
                    onClick={() =>
                        toggleWishlist({
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            category: product.category,
                            description: product.description
                        })
                    }
                >
                    {isInWishlist(product.id) ? '❤' : '♡'}
                </button>
                <div className="card-img-top bg-light p-4 d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                    <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="h5 card-title mb-0 text-dark fw-bold">{product.name}</h3>
                        <span className="h5 text-primary fw-bold mb-0">{product.price}</span>
                    </div>
                    <p className="card-text text-muted small mb-3 flex-grow-1">{product.description}</p>
                    <div className="d-flex gap-2 mt-2">
                        <Link to={`/product/${product.id}`} className="btn btn-outline-primary flex-grow-1">
                            View Details
                        </Link>
                        <button className="btn btn-primary px-3 shadow-sm" title="Add to Cart" onClick={handleAddToCart}>
                            <i className="bi bi-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
