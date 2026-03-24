import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageBanner from '../components/PageBanner';
import { convertToINR } from '../utils/currencyUtils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/PopularProducts.css';
import '../styles/Wishlist.css';

export default function Deals() {
    const [dealProducts, setDealProducts] = useState([]);
    const [displayCount, setDisplayCount] = useState(6);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://dummyjson.com/products?limit=50');
                const data = await res.json();
                const normalized = data.products.map((p, idx) => {
                    const priceINR = convertToINR(p.price);
                    const multiplier = 1.15 + (idx % 4) * 0.08;
                    const originalPrice = Math.round(priceINR * multiplier);
                    return {
                        id: p.id,
                        name: p.title,
                        image: p.thumbnail || p.images?.[0] || '',
                        price: priceINR,
                        originalPrice,
                        category: p.category?.charAt(0).toUpperCase() + p.category?.slice(1) || 'General',
                        originalCategory: p.category,
                        rating: p.rating || 4.5,
                        reviews: Math.floor(Math.random() * 200) + 10,
                        seller: p.brand || 'Store',
                        badge: 'Sale',
                        description: p.description,
                        discount: originalPrice - priceINR
                    };
                });

                const topDeals = normalized
                    .sort((a, b) => b.discount - a.discount);

                setDealProducts(topDeals);
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
              title="Deals & Offers"
              subtitle="RP STORE"
              description="Limited-time discounts on trending gadgets. Grab a deal before it's gone."
              backgroundImage="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=400&fit=crop&crop=center&q=80&ixlib=rb-4.0.3&auto=format"
              buttonText="Shop All"
              buttonLink="/products"
            />

            <section className="popular-products py-5">
                <div className="container-lg">
                    <div className="popular-header">
                        <h2 className="popular-title">Top 6 Deals</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Loading products...</div>
                    ) : (
                        <div className="products-grid">
                            {dealProducts.slice(0, displayCount).map((product) => (
                                <div key={product.id} className="product-card-wrapper">
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                        <div className="product-card">
                                            <div className="product-badge badge-sale">Sale</div>
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

                    {displayCount < dealProducts.length && (
                        <div className="view-more-container">
                            <button
                                className="view-more-btn"
                                onClick={() => setDisplayCount(displayCount + 8)}
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
