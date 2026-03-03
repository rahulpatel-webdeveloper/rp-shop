import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function RelatedProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products from DummyJSON API
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://dummyjson.com/products?limit=10');
                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scroll = (direction) => {
        const container = document.querySelector('.related-product__scroll-container');
        if (container) {
            const scrollAmount = 300;
            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        navigate('/cart');
    };

    const handleViewMore = (productId) => {
        // Navigate to product detail page (using dummyjson product id)
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return <div className="text-center py-5">Loading products...</div>;
    }

    return (
        <section className="related-product">
            <div className="container-fluid px-4 py-5">
                {/* Header */}
                <div className="related-product__header mb-4">
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <h2 className="related-product__title">Related Product</h2>
                        <Link to="/products" className=" ml-3 btn btn-outline-secondary related-product__view-all">View All</Link>
                    </div>
                </div>

                {/* Product Container with Scroll */}
                <div className="related-product__wrapper">
                    <button 
                        className="related-product__scroll-btn related-product__scroll-btn--left"
                        onClick={() => scroll('left')}
                    >
                        &#8249;
                    </button>

                    <div className="related-product__scroll-container">
                        {products.map((product) => (
                            <div key={product.id} className="related-product__card">
                                <div className="related-product__image-wrapper">
                                    <img 
                                        src={product.thumbnail} 
                                        alt={product.title}
                                        className="related-product__image"
                                    />
                                </div>
                                <div className="related-product__content">
                                    <h3 className="related-product__product-title">{product.title}</h3>
                                    <p className="related-product__product-brand">{product.brand || 'Brand'}</p>
                                    <p className="related-product__product-description">{product.description}</p>
                                    <div className="related-product__footer">
                                        <span className="related-product__price">${product.price}</span>
                                        <div className="related-product__rating">
                                            <span className="related-product__star">★</span>
                                            <span className="related-product__rating-value">{product.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="related-product__sold">{product.stock} Sold</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="related-product__actions mt-3">
                                        <button 
                                            className="related-product__btn related-product__btn--cart"
                                            onClick={(e) => handleAddToCart(product, e)}
                                            title="Add to Cart"
                                        >
                                            Add to Cart
                                        </button>
                                        <button 
                                            className="related-product__btn related-product__btn--view"
                                            onClick={() => handleViewMore(product.id)}
                                            title="View More"
                                        >
                                            View More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="related-product__scroll-btn related-product__scroll-btn--right"
                        onClick={() => scroll('right')}
                    >
                        &#8250;
                    </button>
                </div>
            </div>
        </section>
    );
}
