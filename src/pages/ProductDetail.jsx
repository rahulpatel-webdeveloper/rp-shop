import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import RelatedProduct from '../components/RelatedProduct';
import { useCart } from '../context/CartContext';
import { convertToINR } from '../utils/currencyUtils';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('brown');
    const [selectedSize, setSelectedSize] = useState('8');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`https://dummyjson.com/products/${id}`);
                const data = await res.json();
                const priceINR = convertToINR(data.price);
                setProduct({
                    id: data.id,
                    images: data.images || (data.thumbnail ? [data.thumbnail] : []),
                    image: data.thumbnail || data.images?.[0] || '',
                    name: data.title,
                    price: `₹${priceINR.toLocaleString('en-IN')}`,
                    priceNumeric: priceINR,
                    description: data.description,
                    details: data.description,
                    category: data.category
                });
            } catch (err) {
                console.error('Error fetching product', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">Loading...</div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <h2 className="mb-4">Product not found</h2>
                    <Link to="/products" className="btn btn-secondary">Back to Products</Link>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <h2 className="mb-4">Product not found</h2>
                    <Link to="/products" className="btn btn-secondary">Back to Products</Link>
                </div>
            </Layout>
        );
    }

    const colors = ['brown', 'beige', 'blue', 'black'];
    const sizes = ['6', '8', '10', '14', '18', '20'];
    const price = typeof product.price === 'string' ? product.price : `₹${product.price}`;
    const isStyleProduct = product.category && ['clothing', 'footwear'].includes(product.category.toLowerCase());

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Added ${quantity} item(s) to cart!`);
        setQuantity(1);
    };

    return (
        <Layout>
            <div className="container p-5 mb-5">
                {/* Breadcrumb */}
                <nav className="breadcrumb-nav mb-4">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                            <Link to="/">Homepage</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/products">Women</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="#" className="text-decoration-none">Women's Shirts & Tops</a>
                        </li>
                        <li className="breadcrumb-item active">{product.name}</li>
                    </ol>
                </nav>

                <div className="row g-4">
                    {/* Product Image Section */}
                    <div className="col-lg-5">
                        <div className="product-detail__image-main">
                            <img src={product.images[currentImageIndex] || product.image} alt={product.name} className="product-detail__main-image" />
                            <div className="product-detail__actions">
                                <button className="product-detail__action-btn">
                                    <span>📤</span>
                                </button>
                                <button className="product-detail__action-btn">
                                    <span>❤️</span>
                                </button>
                            </div>
                            {product.images.length > 1 && (
                                <>
                                    <button 
                                        className="product-detail__slider-nav product-detail__slider-nav--prev"
                                        onClick={handlePrevImage}
                                        aria-label="Previous image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                        </svg>
                                    </button>
                                    <button 
                                        className="product-detail__slider-nav product-detail__slider-nav--next"
                                        onClick={handleNextImage}
                                        aria-label="Next image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Thumbnail Gallery */}
                        {product.images.length > 1 && (
                            <div className="product-detail__thumbnails mt-3">
                                {product.images.map((img, index) => (
                                    <div 
                                        key={index}
                                        className={`product-detail__thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="col-lg-7">
                        <div className="product-detail__info">
                            {/* Brand & Title */}
                            <p className="product-detail__brand">John Lewis ANYDAY</p>
                            <h1 className="product-detail__title">{product.name}</h1>

                            {/* Price & Rating */}
                            <div className="product-detail__price-row">
                                <span className="product-detail__original-price">£40.00</span>
                                <span className="product-detail__sale-price">{price}</span>
                                <span className="product-detail__sold">1238 Sold</span>
                                <div className="product-detail__rating">
                                    <span className="product-detail__stars">★</span>
                                    <span className="product-detail__rating-value">4.5</span>
                                </div>
                            </div>

                            <hr className="my-4" />

                            {/* Description */}
                            <div className="product-detail__description mb-4">
                                <h5 className="fw-bold mb-2">Description:</h5>
                                <p className="text-secondary">{product.details}</p>
                                <a href="#" className="product-detail__see-more">See More...</a>
                            </div>

                            {/* Color Selection */}
                            <div className="product-detail__options mb-4">
                                <label className="product-detail__option-label">
                                    <span className="fw-bold">Color:</span>
                                    <span className="product-detail__color-name">{selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</span>
                                </label>
                                <div className="product-detail__colors">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            className={`product-detail__color-btn ${selectedColor === color ? 'active' : ''}`}
                                            style={{ 
                                                backgroundColor: color === 'brown' ? '#8B6F47' : 
                                                               color === 'beige' ? '#E8DCC4' :
                                                               color === 'blue' ? '#2C5F8D' :
                                                               color === 'black' ? '#1a1a1a' : 'white'
                                            }}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="product-detail__options mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="product-detail__option-label">
                                        <span className="fw-bold">Size:</span>
                                        <span className="product-detail__size-name ms-2">{selectedSize}</span>
                                    </label>
                                    <a href="#" className="text-decoration-none text-secondary small">View Size Chart</a>
                                </div>
                                <div className="product-detail__sizes">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`product-detail__size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            {!isStyleProduct && (
                            <div className="product-detail__quantity mb-4">
                                <label className="product-detail__option-label mb-2">Quantity:</label>
                                <div className="product-detail__qty-selector">
                                    <button 
                                        className="product-detail__qty-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        −
                                    </button>
                                    <input 
                                        type="text" 
                                        value={quantity} 
                                        readOnly 
                                        className="product-detail__qty-input"
                                    />
                                    <button 
                                        className="product-detail__qty-btn"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            )}

                            {/* Action Buttons */}
                            <div className="product-detail__actions-main d-flex gap-3 mb-4">
                                <button 
                                    className="btn btn-dark btn-lg fw-bold py-3"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                                <button className="btn btn-outline-dark btn-lg fw-bold py-3">
                                    Checkout Now
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="product-detail__footer">
                                <a href="#" className="product-detail__delivery-link">Delivery T&C</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <RelatedProduct />
        </Layout>
    );
}
