import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategorySection.css';

export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [displayedCards, setDisplayedCards] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCategoryName = (cat) => {
        // Handle both string and object types
        const catStr = typeof cat === 'string' ? cat : String(cat?.name || cat?.slug || cat || '');
        if (!catStr) return '';
        return catStr.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                // Fetch all categories
                const catRes = await fetch('https://dummyjson.com/products/categories');
                const catData = await catRes.json();
                let catList = Array.isArray(catData) ? catData.slice(0, 6) : [];
                
                // Extract category names if they are objects
                catList = catList.map(cat => typeof cat === 'string' ? cat : (cat?.name || cat?.slug || String(cat)));
                
                setCategories(catList);
                
                if (catList.length > 0) {
                    setActiveCategory(catList[0]);
                }

                // Fetch products for each category
                const productsMap = {};
                for (const cat of catList) {
                    try {
                        const res = await fetch(`https://dummyjson.com/products/category/${cat}?limit=4`);
                        const data = await res.json();
                        productsMap[cat] = data.products || [];
                    } catch (err) {
                        console.error(`Error fetching products for ${cat}:`, err);
                        productsMap[cat] = [];
                    }
                }
                setCategoryProducts(productsMap);
            } catch (err) {
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoriesAndProducts();
    }, []);

    useEffect(() => {
        if (activeCategory && categoryProducts[activeCategory]) {
            const products = categoryProducts[activeCategory];
            // Show 2 products with discount badges
            const displayed = products.slice(0, 2).map((product, index) => ({
                ...product,
                discount: index === 0 ? 50 : 40 // Alternate discounts
            }));
            setDisplayedCards(displayed);
        }
    }, [activeCategory, categoryProducts]);

    if (loading) {
        return <div className="text-center py-5">Loading categories...</div>;
    }

    return (
        <section className="container category-section py-5">
            <div className="container-fluid">
                <div className="row h-100">
                    {/* Left Side - Category List */}
                    <div className="col-lg-3 category-sidebar">
                        <div className="category-list">
                            <h3 className="category-list-title">Categories</h3>
                            <div className="category-items">
                                {categories.map((cat) => (
                                    <div
                                        key={cat}
                                        className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        <div className="category-item-name">
                                            {getCategoryName(cat)}
                                        </div>
                                        <div className="category-item-count">
                                            ({categoryProducts[cat]?.length || 0} items)
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="category-view-more">View More</button>
                        </div>
                    </div>

                    {/* Right Side - Category Cards */}
                    <div className="col-lg-9 category-cards-container">
                        <div className="row g-4">
                            {displayedCards.map((product, index) => (
                                <div key={product.id} className="col-md-6 col-lg-6">
                                    <Link to={`/product/${product.id}`} className="category-card" style={{textDecoration: 'none'}}>
                                        <div className="category-card-image-wrapper">
                                            <img
                                                src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400x300?text=Product'}
                                                alt={product.title}
                                                className="category-card-image"
                                            />
                                            <div className="category-card-discount">
                                                <span className="discount-value">{product.discount}%</span>
                                                <span className="discount-text">OFF</span>
                                            </div>
                                        </div>
                                        <div className="category-card-content">
                                            <h4 className="category-card-title">{product.title}</h4>
                                            <button className="category-card-btn">Shop Now</button>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
