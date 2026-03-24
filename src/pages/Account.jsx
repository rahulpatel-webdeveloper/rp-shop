import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Auth.css';
import '../styles/AccountDashboard.css';

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'orders', label: 'Orders' },
];

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
  isDefault: false,
};

const formatPrice = (value) => {
  if (typeof value === 'number') {
    return `₹${value.toLocaleString('en-IN')}`;
  }
  if (typeof value === 'string') return value;
  return '₹0';
};

const buildInvoice = (order, customerName) => {
  const lines = [
    'RP Store Invoice',
    `Order ID: ${order.id}`,
    `Date: ${new Date(order.date).toLocaleDateString()}`,
    `Customer: ${customerName}`,
    '',
    'Items:',
  ];
  order.items.forEach((item) => {
    lines.push(`- ${item.name} x${item.qty} - ${formatPrice(item.price)}`);
  });
  lines.push('');
  lines.push(`Total: ${formatPrice(order.total)}`);
  lines.push(`Status: ${order.status}`);
  return lines.join('\n');
};

export default function Account() {
  const {
    currentUser,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  } = useAuth();
  const { addToCart } = useCart();
  const [activeSection, setActiveSection] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [profileStatus, setProfileStatus] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordStatus, setPasswordStatus] = useState('');
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [addressStatus, setAddressStatus] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.profile?.phone || '',
        avatar: currentUser.profile?.avatar || '',
      });
    }
  }, [currentUser]);

  const initials = useMemo(() => {
    if (!currentUser?.name) return 'RS';
    return currentUser.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileStatus('');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const result = updateProfile(profileForm);
    if (!result.ok) {
      setProfileStatus(result.message || 'Unable to update profile.');
      return;
    }
    setProfileStatus('Profile updated.');
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordStatus('');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordForm.next.length < 6) {
      setPasswordStatus('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordStatus('New passwords do not match.');
      return;
    }
    const result = changePassword({
      currentPassword: passwordForm.current,
      newPassword: passwordForm.next,
    });
    if (!result.ok) {
      setPasswordStatus(result.message || 'Unable to change password.');
      return;
    }
    setPasswordForm({ current: '', next: '', confirm: '' });
    setPasswordStatus('Password updated.');
  };

  const handleAddressChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAddressForm((prev) => ({ ...prev, [e.target.name]: value }));
    setAddressStatus('');
  };

  const startEditAddress = (address) => {
    setEditingId(address.id);
    setAddressForm({
      label: address.label || '',
      name: address.name || '',
      phone: address.phone || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || '',
      type: address.type || 'shipping',
      isDefault: Boolean(address.isDefault),
    });
  };

  const resetAddressForm = () => {
    setEditingId(null);
    setAddressForm(emptyAddress);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.line1 || !addressForm.city || !addressForm.state) {
      setAddressStatus('Please complete the required address fields.');
      return;
    }
    if (editingId) {
      updateAddress(editingId, addressForm);
      setAddressStatus('Address updated.');
    } else {
      addAddress(addressForm);
      setAddressStatus('Address added.');
    }
    resetAddressForm();
  };

  const handleInvoice = (order) => {
    const content = buildInvoice(order, currentUser.name);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.id}-invoice.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!currentUser) {
    return (
      <Layout>
        <section className="auth-page">
          <div className="auth-card auth-card--wide">
            <div className="auth-card__header">
              <p className="auth-kicker">Account</p>
              <h1 className="auth-title">Sign in to manage your account</h1>
              <p className="auth-subtitle">
                Access your profile details, addresses, and order history.
              </p>
            </div>
            <div className="auth-actions-row">
              <Link to="/login" className="auth-primary-btn">
                Go to Login
              </Link>
              <Link to="/signup" className="auth-secondary-btn">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="dashboard">
        <div className="dashboard-shell">
          <aside className="dashboard-sidebar">
            <div className="dashboard-profile">
              <div className="dashboard-avatar">
                {profileForm.avatar ? (
                  <img src={profileForm.avatar} alt={currentUser.name} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div>
                <h2>{currentUser.name}</h2>
                <p>{currentUser.email}</p>
              </div>
            </div>
            <nav className="dashboard-nav">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`dashboard-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </nav>
            <button className="dashboard-logout" onClick={logout}>
              Log out
            </button>
          </aside>

          <div className="dashboard-content">
            {activeSection === 'profile' && (
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h3>Profile management</h3>
                    <p>Update personal info and keep your account secure.</p>
                  </div>
                </div>

                <form className="panel-form" onSubmit={handleProfileSave}>
                  <div className="panel-grid">
                    <label className="auth-label">
                      Full name
                      <input
                        className="auth-input"
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </label>
                    <label className="auth-label">
                      Email address
                      <input
                        className="auth-input"
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </label>
                    <label className="auth-label">
                      Phone
                      <input
                        className="auth-input"
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="+1 000 000 0000"
                      />
                    </label>
                    <label className="auth-label panel-span-2">
                      Profile picture URL
                      <input
                        className="auth-input"
                        type="url"
                        name="avatar"
                        value={profileForm.avatar}
                        onChange={handleProfileChange}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </label>
                  </div>
                  <div className="panel-actions">
                    <button className="auth-primary-btn" type="submit">
                      Save profile
                    </button>
                    {profileStatus && <span className="panel-status">{profileStatus}</span>}
                  </div>
                </form>

                <div className="panel-divider"></div>

                <form className="panel-form" onSubmit={handlePasswordSave}>
                  <div className="panel-header">
                    <div>
                      <h3>Change password</h3>
                      <p>Make sure your account stays protected.</p>
                    </div>
                  </div>
                  <div className="panel-grid">
                    <label className="auth-label">
                      Current password
                      <input
                        className="auth-input"
                        type="password"
                        name="current"
                        value={passwordForm.current}
                        onChange={handlePasswordChange}
                        required
                      />
                    </label>
                    <label className="auth-label">
                      New password
                      <input
                        className="auth-input"
                        type="password"
                        name="next"
                        value={passwordForm.next}
                        onChange={handlePasswordChange}
                        required
                      />
                    </label>
                    <label className="auth-label">
                      Confirm password
                      <input
                        className="auth-input"
                        type="password"
                        name="confirm"
                        value={passwordForm.confirm}
                        onChange={handlePasswordChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="panel-actions">
                    <button className="auth-secondary-btn" type="submit">
                      Update password
                    </button>
                    {passwordStatus && <span className="panel-status">{passwordStatus}</span>}
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'addresses' && (
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h3>Saved addresses</h3>
                    <p>Manage shipping and billing addresses for faster checkout.</p>
                  </div>
                </div>

                <div className="address-grid">
                  {(currentUser.addresses || []).map((address) => (
                    <div key={address.id} className="address-card">
                      <div className="address-card__head">
                        <div>
                          <h4>{address.label}</h4>
                          <p className="address-meta">
                            {address.type === 'billing' ? 'Billing' : 'Shipping'}
                            {address.isDefault ? ' • Default' : ''}
                          </p>
                        </div>
                        {address.isDefault && <span className="address-badge">Default</span>}
                      </div>
                      <p className="address-line">{address.name}</p>
                      <p className="address-line">{address.phone}</p>
                      <p className="address-line">{address.line1}</p>
                      {address.line2 && <p className="address-line">{address.line2}</p>}
                      <p className="address-line">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className="address-line">{address.country}</p>
                      <div className="address-actions">
                        <button
                          className="auth-secondary-btn"
                          type="button"
                          onClick={() => startEditAddress(address)}
                        >
                          Edit
                        </button>
                        <button
                          className="auth-secondary-btn"
                          type="button"
                          onClick={() => removeAddress(address.id)}
                        >
                          Delete
                        </button>
                        {!address.isDefault && (
                          <button
                            className="auth-primary-btn"
                            type="button"
                            onClick={() => setDefaultAddress(address.id)}
                          >
                            Set default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {currentUser.addresses?.length === 0 && (
                    <div className="address-empty">
                      <h4>No addresses yet</h4>
                      <p>Add a shipping or billing address to get started.</p>
                    </div>
                  )}
                </div>

                <div className="panel-divider"></div>

                <form className="panel-form" onSubmit={handleAddressSubmit}>
                  <div className="panel-header">
                    <div>
                      <h3>{editingId ? 'Edit address' : 'Add new address'}</h3>
                      <p>Keep address details accurate for delivery updates.</p>
                    </div>
                  </div>
                  <div className="panel-grid">
                    <label className="auth-label">
                      Label
                      <input
                        className="auth-input"
                        type="text"
                        name="label"
                        value={addressForm.label}
                        onChange={handleAddressChange}
                        placeholder="Home, Office"
                      />
                    </label>
                    <label className="auth-label">
                      Full name
                      <input
                        className="auth-input"
                        type="text"
                        name="name"
                        value={addressForm.name}
                        onChange={handleAddressChange}
                      />
                    </label>
                    <label className="auth-label">
                      Phone
                      <input
                        className="auth-input"
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                      />
                    </label>
                    <label className="auth-label panel-span-2">
                      Address line 1
                      <input
                        className="auth-input"
                        type="text"
                        name="line1"
                        value={addressForm.line1}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                    <label className="auth-label panel-span-2">
                      Address line 2
                      <input
                        className="auth-input"
                        type="text"
                        name="line2"
                        value={addressForm.line2}
                        onChange={handleAddressChange}
                      />
                    </label>
                    <label className="auth-label">
                      City
                      <input
                        className="auth-input"
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                    <label className="auth-label">
                      State
                      <input
                        className="auth-input"
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                    <label className="auth-label">
                      ZIP
                      <input
                        className="auth-input"
                        type="text"
                        name="zip"
                        value={addressForm.zip}
                        onChange={handleAddressChange}
                      />
                    </label>
                    <label className="auth-label">
                      Country
                      <input
                        className="auth-input"
                        type="text"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                      />
                    </label>
                    <label className="auth-label">
                      Address type
                      <select
                        className="auth-input"
                        name="type"
                        value={addressForm.type}
                        onChange={handleAddressChange}
                      >
                        <option value="shipping">Shipping</option>
                        <option value="billing">Billing</option>
                      </select>
                    </label>
                    <label className="auth-label checkbox-label">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressChange}
                      />
                      Set as default
                    </label>
                  </div>
                  <div className="panel-actions">
                    <button className="auth-primary-btn" type="submit">
                      {editingId ? 'Update address' : 'Save address'}
                    </button>
                    {editingId && (
                      <button
                        className="auth-secondary-btn"
                        type="button"
                        onClick={resetAddressForm}
                      >
                        Cancel
                      </button>
                    )}
                    {addressStatus && <span className="panel-status">{addressStatus}</span>}
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h3>Order history</h3>
                    <p>Track previous orders and reorder your favorites.</p>
                  </div>
                </div>

                <div className="orders-grid">
                  {(currentUser.orders || []).map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card__head">
                        <div>
                          <h4>{order.id}</h4>
                          <p>{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-summary">
                        <p>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        <p className="order-total">{formatPrice(order.total)}</p>
                      </div>
                      <div className="order-actions">
                        <button
                          className="auth-secondary-btn"
                          type="button"
                          onClick={() =>
                            setExpandedOrder(expandedOrder === order.id ? null : order.id)
                          }
                        >
                          {expandedOrder === order.id ? 'Hide details' : 'View details'}
                        </button>
                        <button
                          className="auth-primary-btn"
                          type="button"
                          onClick={() => {
                            order.items.forEach((item) => {
                              addToCart(
                                {
                                  id: item.id,
                                  name: item.name,
                                  image: item.image,
                                  price: formatPrice(item.price),
                                  description: '',
                                },
                                item.qty
                              );
                            });
                          }}
                        >
                          Reorder
                        </button>
                        <button
                          className="auth-secondary-btn"
                          type="button"
                          onClick={() => handleInvoice(order)}
                        >
                          Download invoice
                        </button>
                      </div>
                      {expandedOrder === order.id && (
                        <div className="order-details">
                          {order.items.map((item) => (
                            <div key={`${order.id}-${item.id}`} className="order-item">
                              <img src={item.image} alt={item.name} />
                              <div>
                                <p className="order-item__name">{item.name}</p>
                                <p className="order-item__meta">
                                  Qty {item.qty} · {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {currentUser.orders?.length === 0 && (
                    <div className="address-empty">
                      <h4>No orders yet</h4>
                      <p>Once you place an order, it will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
