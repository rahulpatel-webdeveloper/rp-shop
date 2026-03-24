import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <Layout>
                <div className="cart-empty text-center py-5">
                    <div className="cart-empty__icon mb-4">
                        <span style={{ fontSize: '4rem' }}>🛒</span>
                    </div>
                    <h2 className="mb-3">Your Cart is Empty</h2>
                    <p className="text-muted mb-4">Start shopping to add items to your cart</p>
                    <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
                </div>
            </Layout>
        );
    }

    const total = getCartTotal();

    return (
        <Layout>
            <div className="container py-4">
                <h1 className="mb-4">Shopping Cart</h1>
                <div className="row g-4">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        <div className="cart-items">
                            {cartItems.map(item => {
                                const price = typeof item.price === 'string' 
                                    ? parseFloat(item.price.replace('£', '').replace('$', '').replace('₹', '')) 
                                    : item.price;
                                const itemTotal = price * item.quantity;

                                return (
                                    <div key={item.id} className="cart-item" data-product-id={item.id}>
                                        <div className="cart-item__image">
                                            <img src={item.image} alt={item.name} />
                                        </div>

                                        <div className="cart-item__details">
                                            <h5 className="cart-item__title">{item.name}</h5>
                                            <p className="cart-item__sku text-muted small">SKU: {item.id}</p>
                                        </div>

                                        <div className="cart-item__price">
                                            <span className="cart-item__unit-price">₹{price.toFixed(2)}</span>
                                        </div>

                                        <div className="cart-item__quantity">
                                            <button 
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                −
                                            </button>
                                            <input 
                                                type="text" 
                                                value={item.quantity} 
                                                readOnly 
                                                className="cart-item__qty-input"
                                            />
                                            <button 
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="cart-item__total">
                                            <span className="cart-item__total-price">₹{itemTotal.toFixed(2)}</span>
                                        </div>

                                        <button 
                                            className="cart-item__remove"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Remove item"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center mt-4">
                            <button 
                                className="btn btn-outline-danger"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="col-lg-4">
                        <div className="cart-summary">
                            <h5 className="cart-summary__title mb-4">Order Summary</h5>

                            {/* Summary Rows */}
                            <div className="cart-summary__row">
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <div className="cart-summary__row">
                                <span>Shipping</span>
                                <span className="text-success">Free</span>
                            </div>

                            <div className="cart-summary__row">
                                <span>Tax</span>
                                <span>₹{(total * 0.2).toFixed(2)}</span>
                            </div>

                            <hr className="my-3" />

                            <div className="cart-summary__total">
                                <span>Total</span>
                                <span>₹{(total + total * 0.2).toFixed(2)}</span>
                            </div>

                            {/* Checkout Button */}
                            <Link to="/checkout" className="btn btn-dark btn-lg w-100 py-3 mt-4">
                                Proceed to Checkout
                            </Link>

                            <Link to="/products" className="btn btn-outline-secondary btn-lg w-100 py-3 mt-2">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
