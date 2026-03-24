import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { convertToINR, formatINRPrice } from '../utils/currencyUtils';
import '../styles/PopularProducts.css';
import '../styles/Wishlist.css';

export default function PopularProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const badges = ['Hot', 'Sale', 'New', 'Hot', 'Sale'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch from multiple categories including smartphones and laptops
                const smartphoneRes = await fetch('https://dummyjson.com/products/category/smartphones?limit=5');
                const laptopRes = await fetch('https://dummyjson.com/products/category/laptops?limit=5');
                
                const smartphoneData = smartphoneRes.ok ? await smartphoneRes.json() : { products: [] };
                const laptopData = laptopRes.ok ? await laptopRes.json() : { products: [] };
                
                // Combine products from different categories
                const allProducts = [
                    ...smartphoneData.products,
                    ...laptopData.products
                ];

                const normalized = allProducts.slice(0, 10).map((p, idx) => ({
                    id: p.id,
                    name: p.title,
                    image: p.thumbnail || p.images?.[0] || '',
                    price: convertToINR(p.price),
                    originalPrice: convertToINR(Math.round(p.price * 1.3)),
                    category: p.category === 'smartphones' ? 'Mobile' : (p.category === 'laptops' ? 'Laptop' : p.category) || 'General',
                    originalCategory: p.category,
                    rating: p.rating || 4.5,
                    reviews: Math.floor(Math.random() * 200) + 10,
                    seller: p.brand || 'NestFood',
                    badge: badges[idx % badges.length],
                    description: p.description
                }));
                
                setProducts(normalized);
                setFilteredProducts(normalized);

                // Set category options: All, Mobile, Laptop, and any other categories
                const uniqueCategories = new Set(normalized.map(p => p.category));
                const cats = ['All', 'Mobile', 'Laptop', ...Array.from(uniqueCategories).filter(c => c !== 'Mobile' && c !== 'Laptop')];
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
        return <div className="text-center py-5">Loading products...</div>;
    }

    return (
        <section className="popular-products py-5">
            <div className="container-lg">
                {/* Header */}
                <div className="popular-header">
                    <h2 className="popular-title">Popular Products</h2>
                    
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
                    {filteredProducts.map((product) => (
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
            </div>
        </section>
    );
}
