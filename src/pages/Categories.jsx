import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageBanner from '../components/PageBanner';
import { convertToINR } from '../utils/currencyUtils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/PopularProducts.css';
import '../styles/Wishlist.css';

export default function Categories() {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [displayCount, setDisplayCount] = useState(6);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const badges = ['Hot', 'Sale', 'New', 'Hot', 'Sale'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://dummyjson.com/products?limit=50');
                const data = await res.json();
                const normalized = data.products.map((p, idx) => {
                    const priceINR = convertToINR(p.price);
                    return {
                        id: p.id,
                        name: p.title,
                        image: p.thumbnail || p.images?.[0] || '',
                        price: priceINR,
                        originalPrice: Math.round(priceINR * 1.3),
                        category: p.category?.charAt(0).toUpperCase() + p.category?.slice(1) || 'General',
                        originalCategory: p.category,
                        rating: p.rating || 4.5,
                        reviews: Math.floor(Math.random() * 200) + 10,
                        seller: p.brand || 'Store',
                        badge: badges[idx % badges.length],
                        description: p.description
                    };
                });

                const byCategory = new Map();
                normalized.forEach((product) => {
                    if (!byCategory.has(product.category)) {
                        byCategory.set(product.category, product);
                    }
                });

                setCategoryProducts(Array.from(byCategory.values()));
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: `â‚¹${product.price}`,
            description: product.description
        }, 1);
    };

    const renderStars = (rating) => {
        return (
            <div className="product-stars">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
                        â˜…
                    </span>
                ))}
                <span className="rating-text">({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <Layout>
            <PageBanner
              title="Shop By Categories"
              subtitle="RP STORE"
              description="Handpicked picks from top categories. Explore a quick set of products across the store."
              backgroundImage="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=400&fit=crop&crop=center&q=80&ixlib=rb-4.0.3&auto=format"
              buttonText="Browse Products"
              buttonLink="/products"
            />

            <section className="popular-products py-5">
                <div className="container-lg">
                    <div className="popular-header">
                        <h2 className="popular-title">Featured From Categories</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Loading products...</div>
                    ) : (
                        <div className="products-grid">
                            {categoryProducts.slice(0, displayCount).map((product) => (
                                <div key={product.id} className="product-card-wrapper">
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                        <div className="product-card">
                                            <div className={`product-badge badge-${product.badge.toLowerCase()}`}>
                                                {product.badge}
                                            </div>
                                            <button
                                                type="button"
                                                className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                                title="Add to wishlist"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist({
                                                        id: product.id,
                                                        name: product.name,
                                                        image: product.image,
                                                        price: product.price,
                                                        category: product.category,
                                                        description: product.description
                                                    });
                                                }}
                                            >
                                                {isInWishlist(product.id) ? 'â¤' : 'â™¡'}
                                            </button>

                                            <div className="product-image-container">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="product-image"
                                                />
                                            </div>

                                            <div className="product-info">
                                                <p className="product-category">{product.category}</p>
                                                <h3 className="product-name">{product.name}</h3>
                                                {renderStars(product.rating)}
                                                <p className="product-seller">By {product.seller}</p>
                                                <div className="price-section">
                                                    <span className="price-current">â‚¹{product.price.toLocaleString('en-IN')}</span>
                                                    <span className="price-original">â‚¹{product.originalPrice.toLocaleString('en-IN')}</span>
                                                </div>
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAddToCart(product);
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {displayCount < categoryProducts.length && (
                        <div className="view-more-container">
                            <button
                                className="view-more-btn"
                                onClick={() => setDisplayCount(displayCount + 6)}
                            >
                                View More
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
