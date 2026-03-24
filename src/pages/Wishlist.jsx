


import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import '../styles/Wishlist.css';

const formatPrice = (value) => {
  if (typeof value === 'number') {
    return `₹${value.toLocaleString('en-IN')}`;
  }
  if (typeof value === 'string') return value;
  return '₹0';
};

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <section className="wishlist-empty">
          <h1>Your wishlist is empty</h1>
          <p>Save favorites so you can compare and buy later.</p>
          <Link to="/products" className="wishlist-primary-btn">
            Browse Products
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="wishlist-page">
        <div className="wishlist-header">
          <h1>Wishlist</h1>
          <p>{items.length} saved item{items.length > 1 ? 's' : ''}</p>
        </div>

        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="wishlist-content">
                <p className="wishlist-category">{item.category || 'Product'}</p>
                <h3>{item.name}</h3>
                <p className="wishlist-price">{formatPrice(item.price)}</p>
                <div className="wishlist-actions">
                  <button
                    className="wishlist-primary-btn"
                    onClick={() =>
                      addToCart(
                        {
                          id: item.id,
                          name: item.name,
                          image: item.image,
                          price: formatPrice(item.price),
                          description: item.description,
                        },
                        1
                      )
                    }
                  >
                    Add to Cart
                  </button>
                  <button
                    className="wishlist-secondary-btn"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
