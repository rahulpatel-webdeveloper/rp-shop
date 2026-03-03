import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageBanner from '../components/PageBanner';
import CategorySection from '../components/CategorySection';
import OfferSection from '../components/OfferSection';
import FeaturesSection from '../components/FeaturesSection';
import PopularProducts from '../components/PopularProducts';
import { convertToINR } from '../utils/currencyUtils';
import { useCart } from '../context/CartContext';
import '../styles/PopularProducts.css';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [displayCount, setDisplayCount] = useState(12);
    const { addToCart } = useCart();

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

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        setDisplayCount(12);
        if (category === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === category));
        }
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

    return (
        <Layout>
            <PageBanner
              title="Discover Premium Gadgets"
              subtitle="RP STORE"
              description="Explore our curated collection of the latest technology and innovation. Find your perfect gadget today."
              backgroundImage="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop&crop=center&q=80&ixlib=rb-4.0.3&auto=format"
              buttonText="Shop Now"
              buttonLink="/products"
            />            
            <OfferSection />
            <PopularProducts />
            <FeaturesSection />
            <CategorySection />            
            <section className="popular-products py-5">
                <div className="container-lg">
                    {/* Header */}
                    <div className="popular-header">
                        <h2 className="popular-title">All Products</h2>
                        
                        {/* Category Filter */}
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
                                onClick={() => setDisplayCount(displayCount + 12)}
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


