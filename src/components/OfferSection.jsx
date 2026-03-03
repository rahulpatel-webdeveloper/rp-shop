import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/OfferSection.css';

export default function OfferSection() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('https://dummyjson.com/products?limit=3');
                const data = await res.json();
                const offerCards = data.products.slice(0, 3).map((product, index) => ({
                    id: product.id,
                    title: ['Healthy Bakery Products', 'Premium Dairy Selection', 'Fresh Organic Produce'][index],
                    discount: [30, 25, 35][index],
                    image: product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400x300?text=Product',
                    bgColor: ['#FFE5DB', '#E8F4F8', '#F0E8D8'][index]
                }));
                setOffers(offerCards);
            } catch (err) {
                console.error('Error fetching offers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return <div className="text-center py-5">Loading offers...</div>;
    }

    return (
        <section className="offer-section py-5">
            <div className="container">
                <div className="row g-5">
                    {offers.map((offer) => (
                        <div key={offer.id} className="col-lg-4 col-md-6 col-12">
                            <Link to={`/product/${offer.id}`} style={{ textDecoration: 'none' }}>
                                <div className="offer-card" style={{ backgroundColor: offer.bgColor }}>
                                    {/* Left Content */}
                                    <div className="offer-card-content">
                                        <h3 className="offer-card-title">{offer.title}</h3>
                                        <p className="offer-card-discount">
                                            <span className="discount-percent">{offer.discount}%</span>
                                            {/* <span className="discount-text">Off on first order</span> */}
                                        </p>
                                        <button className="offer-card-btn">Shop Now</button>
                                    </div>

                                    {/* Right Image */}
                                    <div className="offer-card-image">
                                        <img src={offer.image} alt={offer.title} />
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
