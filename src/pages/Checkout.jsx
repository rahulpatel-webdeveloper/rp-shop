import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Checkout.css';

const formatPrice = (value) => {
  if (typeof value === 'number') {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  }
  if (typeof value === 'string') return value;
  return '₹0';
};

const emptyAddress = {
  label: '',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  type: 'shipping',
};

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser, addAddress } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(true);
  const [status, setStatus] = useState('');

  const total = getCartTotal();
  const tax = total * 0.2;
  const grandTotal = total + tax;

  const savedAddresses = useMemo(
    () => currentUser?.addresses || [],
    [currentUser]
  );

  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
      setSelectedAddress(defaultAddress?.id || savedAddresses[0].id);
    }
  }, [savedAddresses]);

  const handleAddressChange = (e) => {
    setAddressForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setStatus('Please sign in before placing an order.');
      return;
    }
    if (savedAddresses.length === 0) {
      if (!addressForm.line1 || !addressForm.city || !addressForm.state) {
        setStatus('Please fill in your shipping address.');
        return;
      }
      if (saveAddress) {
        addAddress({ ...addressForm, isDefault: true });
      }
    }
    setStatus('Order placed! Your confirmation will arrive shortly.');
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <section className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Browse products and add items before checking out.</p>
          <Link to="/products" className="checkout-primary-btn">
            Continue shopping
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="checkout">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Secure checkout for your RP Store order.</p>
        </div>

        <div className="checkout-shell">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="checkout-card">
              <h2>Contact details</h2>
              <div className="checkout-grid">
                <label className="checkout-label">
                  Full name
                  <input
                    className="checkout-input"
                    type="text"
                    value={currentUser?.name || ''}
                    readOnly
                  />
                </label>
                <label className="checkout-label">
                  Email
                  <input
                    className="checkout-input"
                    type="email"
                    value={currentUser?.email || ''}
                    readOnly
                  />
                </label>
              </div>
              {!currentUser && (
                <div className="checkout-alert">
                  Please <Link to="/login">sign in</Link> to complete checkout.
                </div>
              )}
            </div>

            <div className="checkout-card">
              <h2>Shipping address</h2>
              {savedAddresses.length > 0 ? (
                <div className="address-choice">
                  {savedAddresses.map((addr) => (
                    <label key={addr.id} className="address-option">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                      />
                      <div>
                        <h4>{addr.label}</h4>
                        <p>{addr.name}</p>
                        <p>{addr.phone}</p>
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                        <p>{addr.country}</p>
                        {addr.isDefault && <span className="address-tag">Default</span>}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="checkout-grid">
                  <label className="checkout-label">
                    Address line 1
                    <input
                      className="checkout-input"
                      name="line1"
                      value={addressForm.line1}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>
                  <label className="checkout-label">
                    Address line 2
                    <input
                      className="checkout-input"
                      name="line2"
                      value={addressForm.line2}
                      onChange={handleAddressChange}
                    />
                  </label>
                  <label className="checkout-label">
                    City
                    <input
                      className="checkout-input"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>
                  <label className="checkout-label">
                    State
                    <input
                      className="checkout-input"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>
                  <label className="checkout-label">
                    ZIP
                    <input
                      className="checkout-input"
                      name="zip"
                      value={addressForm.zip}
                      onChange={handleAddressChange}
                    />
                  </label>
                  <label className="checkout-label">
                    Country
                    <input
                      className="checkout-input"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                    />
                  </label>
                  <label className="checkout-checkbox">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                    />
                    Save this address to my account
                  </label>
                </div>
              )}
            </div>

            <div className="checkout-card">
              <h2>Payment</h2>
              <div className="checkout-grid">
                <label className="checkout-label">
                  Card number
                  <input
                    className="checkout-input"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </label>
                <label className="checkout-label">
                  Name on card
                  <input className="checkout-input" type="text" required />
                </label>
                <label className="checkout-label">
                  Expiry
                  <input className="checkout-input" type="text" placeholder="MM/YY" required />
                </label>
                <label className="checkout-label">
                  CVV
                  <input className="checkout-input" type="password" required />
                </label>
              </div>
            </div>

            {status && <div className="checkout-status">{status}</div>}

            <button className="checkout-primary-btn" type="submit">
              Place order
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Order summary</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="summary-name">{item.name}</p>
                    <p className="summary-meta">Qty {item.quantity}</p>
                  </div>
                  <span>{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
            <Link to="/cart" className="checkout-secondary-btn">
              Back to cart
            </Link>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
