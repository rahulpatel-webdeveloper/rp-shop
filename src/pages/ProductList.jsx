import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import PageBanner from '../components/PageBanner';
import CategorySection from '../components/CategorySection';
import OfferSection from '../components/OfferSection';
import FeaturesSection from '../components/FeaturesSection';
import PopularProducts from '../components/PopularProducts';
import { convertToINR } from '../utils/currencyUtils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/PopularProducts.css';
import '../styles/Wishlist.css';

export default function ProductList() {
    const location = useLocation();
    const activeFilter = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter');
        return filter === 'new' || filter === 'bestseller' ? filter : null;
    }, [location.search]);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [displayCount, setDisplayCount] = useState(12);
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
                
                setProducts(normalized);
                setFilteredProducts(normalized);

                // Set category options: All + unique categories
                const uniqueCategories = new Set(normalized.map(p => p.category));
                const cats = ['All', ...Array.from(uniqueCategories).sort()];
                setCategories([...new Set(cats)]);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length === 0) {
            return;
        }

        if (activeFilter) {
            const sorted = [...products].sort((a, b) => {
                if (activeFilter === 'new') {
                    return b.id - a.id;
                }
                return b.rating - a.rating;
            });
            setFilteredProducts(sorted);
            if (displayCount !== 6) {
                setDisplayCount(6);
            }
            if (selectedCategory !== 'All') {
                setSelectedCategory('All');
            }
            return;
        }

        if (displayCount === 6) {
            setDisplayCount(12);
        }

        if (selectedCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === selectedCategory));
        }
    }, [activeFilter, products, selectedCategory, displayCount]);

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        setDisplayCount(12);
    };

    const handleAddToCart = (product) => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: `₹${product.price}`,
            description: product.description
        }, 1);
    };

    const renderStars = (rating) => {
        return (
            <div className="product-stars">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
                        ★
                    </span>
                ))}
                <span className="rating-text">({rating.toFixed(1)})</span>
            </div>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">Loading products...</div>
            </Layout>
        );
    }

    const isFilteredView = Boolean(activeFilter);
    const bannerTitle = activeFilter === 'new' ? 'New Arrivals' : activeFilter === 'bestseller' ? 'Best Sellers' : 'Discover Premium Gadgets';
    const bannerDescription = activeFilter === 'new'
        ? 'Fresh drops and just-in products curated for you.'
        : activeFilter === 'bestseller'
            ? 'Top-rated products customers love the most.'
            : 'Explore our curated collection of the latest technology and innovation. Find your perfect gadget today.';

    return (
        <Layout>
            <PageBanner
              title={bannerTitle}
              subtitle="RP STORE"
              description={bannerDescription}
              backgroundImage="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop&crop=center&q=80&ixlib=rb-4.0.3&auto=format"
              buttonText="Shop Now"
              buttonLink="/products"
            />            
            {!isFilteredView && (
                <>
                    <OfferSection />
                    <PopularProducts />
                    <FeaturesSection />
                    <CategorySection />
                </>
            )}            
            <section className="popular-products py-5">
                <div className="container-lg">
                    {/* Header */}
                    <div className="popular-header">
                        <h2 className="popular-title">{isFilteredView ? bannerTitle : 'All Products'}</h2>
                        
                        {/* Category Filter */}
                        {!isFilteredView && (
                            <div className="category-filter">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => handleCategoryFilter(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {filteredProducts.slice(0, displayCount).map((product) => (
                            <div key={product.id} className="product-card-wrapper">
                                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="product-card">
                                        {/* Badge */}
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
                                            {isInWishlist(product.id) ? '❤' : '♡'}
                                        </button>

                                        {/* Image Container */}
                                        <div className="product-image-container">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="product-info">
                                            {/* Category */}
                                            <p className="product-category">{product.category}</p>

                                            {/* Product Name */}
                                            <h3 className="product-name">{product.name}</h3>

                                            {/* Rating */}
                                            {renderStars(product.rating)}

                                            {/* Seller */}
                                            <p className="product-seller">By {product.seller}</p>

                                            {/* Price Section */}
                                            <div className="price-section">
                                                <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
                                                <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                            </div>

                                            {/* Add to Cart Button */}
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

                    {/* View More Button */}
                    {displayCount < filteredProducts.length && (
                        <div className="view-more-container">
                            <button 
                                className="view-more-btn"
                                onClick={() => setDisplayCount(displayCount + (isFilteredView ? 6 : 12))}
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


