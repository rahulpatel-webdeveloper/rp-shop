import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'rp-auth-users';
const CURRENT_KEY = 'rp-auth-current';

const readUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const readCurrent = () => {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const writeCurrent = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_KEY);
  }
};

const ensureProfile = (profile) => ({
  phone: profile?.phone ?? '',
  avatar: profile?.avatar ?? '',
});

const ensureAddresses = (addresses) => {
  if (!Array.isArray(addresses)) return [];
  return addresses.map((addr) => ({
    id: addr.id,
    label: addr.label ?? 'Address',
    name: addr.name ?? '',
    phone: addr.phone ?? '',
    line1: addr.line1 ?? '',
    line2: addr.line2 ?? '',
    city: addr.city ?? '',
    state: addr.state ?? '',
    zip: addr.zip ?? '',
    country: addr.country ?? '',
    type: addr.type ?? 'shipping',
    isDefault: Boolean(addr.isDefault),
  }));
};

const ensureOrders = (orders) => {
  if (!Array.isArray(orders)) return [];
  return orders.map((order) => ({
    id: order.id,
    date: order.date,
    status: order.status ?? 'Processing',
    total: order.total ?? 0,
    items: Array.isArray(order.items) ? order.items : [],
    shipping: order.shipping ?? null,
    billing: order.billing ?? null,
  }));
};

const normalizeUser = (user) => ({
  ...user,
  profile: ensureProfile(user.profile),
  addresses: ensureAddresses(user.addresses),
  orders: ensureOrders(user.orders),
});

const createSampleOrders = () => ([
  {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    status: 'Delivered',
    total: 12999,
    items: [
      {
        id: 101,
        name: 'Pulse Wireless Headphones',
        qty: 1,
        price: 7999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&q=80&auto=format',
      },
      {
        id: 102,
        name: 'Nordic Smart Watch',
        qty: 1,
        price: 5000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&q=80&auto=format',
      },
    ],
    shipping: null,
    billing: null,
  },
]);

const generateId = (prefix) =>
  typeof crypto?.randomUUID === 'function'
    ? `${prefix}_${crypto.randomUUID()}`
    : `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const rawUsers = readUsers();
    const normalizedUsers = rawUsers.map(normalizeUser);
    const rawCurrent = readCurrent();
    const normalizedCurrent = rawCurrent ? normalizeUser(rawCurrent) : null;
    setUsers(normalizedUsers);
    setCurrentUser(normalizedCurrent);
  }, []);

  useEffect(() => {
    writeUsers(users);
  }, [users]);

  useEffect(() => {
    writeCurrent(currentUser);
  }, [currentUser]);

  const signup = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some((u) => u.email === normalizedEmail);
    if (exists) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: generateId('user'),
      name: name.trim(),
      email: normalizedEmail,
      password,
      profile: ensureProfile({}),
      addresses: [],
      orders: createSampleOrders(),
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    setCurrentUser(newUser);
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const match = users.find(
      (u) => u.email === normalizedEmail && u.password === password
    );
    if (!match) {
      return { ok: false, message: 'Invalid email or password.' };
    }
    setCurrentUser(normalizeUser(match));
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return { ok: false };
    const nextEmail = updates.email?.trim().toLowerCase();
    if (nextEmail && nextEmail !== currentUser.email) {
      const exists = users.some((u) => u.email === nextEmail && u.id !== currentUser.id);
      if (exists) {
        return { ok: false, message: 'That email is already in use.' };
      }
    }
    const nextUser = {
      ...currentUser,
      name: updates.name?.trim() ?? currentUser.name,
      email: nextEmail ?? currentUser.email,
      profile: {
        ...currentUser.profile,
        phone: updates.phone ?? currentUser.profile.phone,
        avatar: updates.avatar ?? currentUser.profile.avatar,
      },
    };
    const nextUsers = users.map((u) => (u.id === nextUser.id ? nextUser : u));
    setUsers(nextUsers);
    setCurrentUser(nextUser);
    return { ok: true };
  };

  const changePassword = ({ currentPassword, newPassword }) => {
    if (!currentUser) return { ok: false, message: 'Not signed in.' };
    if (currentUser.password !== currentPassword) {
      return { ok: false, message: 'Current password is incorrect.' };
    }
    const nextUser = { ...currentUser, password: newPassword };
    const nextUsers = users.map((u) => (u.id === nextUser.id ? nextUser : u));
    setUsers(nextUsers);
    setCurrentUser(nextUser);
    return { ok: true };
  };

  const addAddress = (address) => {
    if (!currentUser) return { ok: false };
    const nextAddress = {
      id: generateId('addr'),
      label: address.label?.trim() || 'Address',
      name: address.name?.trim() || currentUser.name,
      phone: address.phone?.trim() || currentUser.profile.phone,
      line1: address.line1?.trim() || '',
      line2: address.line2?.trim() || '',
      city: address.city?.trim() || '',
      state: address.state?.trim() || '',
      zip: address.zip?.trim() || '',
      country: address.country?.trim() || '',
      type: address.type || 'shipping',
      isDefault: Boolean(address.isDefault),
    };

    const existing = currentUser.addresses ?? [];
    let nextAddresses = [...existing, nextAddress];
    const hasDefault = existing.some((a) => a.type === nextAddress.type && a.isDefault);
    if (!hasDefault) {
      nextAddress.isDefault = true;
    }
    if (nextAddress.isDefault) {
      nextAddresses = nextAddresses.map((addr) =>
        addr.id === nextAddress.id
          ? addr
          : addr.type === nextAddress.type
            ? { ...addr, isDefault: false }
            : addr
      );
    }

    const nextUser = { ...currentUser, addresses: nextAddresses };
    const nextUsers = users.map((u) => (u.id === nextUser.id ? nextUser : u));
    setUsers(nextUsers);
    setCurrentUser(nextUser);
    return { ok: true };
  };

  const updateAddress = (id, updates) => {
    if (!currentUser) return { ok: false };
    let nextAddresses = (currentUser.addresses ?? []).map((addr) => {
      if (addr.id !== id) return addr;
      return {
        ...addr,
        label: updates.label?.trim() ?? addr.label,
        name: updates.name?.trim() ?? addr.name,
        phone: updates.phone?.trim() ?? addr.phone,
        line1: updates.line1?.trim() ?? addr.line1,
        line2: updates.line2?.trim() ?? addr.line2,
        city: updates.city?.trim() ?? addr.city,
        state: updates.state?.trim() ?? addr.state,
        zip: updates.zip?.trim() ?? addr.zip,
        country: updates.country?.trim() ?? addr.country,
        type: updates.type ?? addr.type,
        isDefault: updates.isDefault ?? addr.isDefault,
      };
    });

    const updated = nextAddresses.find((addr) => addr.id === id);
    if (updated?.isDefault) {
      nextAddresses = nextAddresses.map((addr) =>
        addr.id === id
          ? addr
          : addr.type === updated.type
            ? { ...addr, isDefault: false }
            : addr
      );
    }

    const nextUser = { ...currentUser, addresses: nextAddresses };
    const nextUsers = users.map((u) => (u.id === nextUser.id ? nextUser : u));
    setUsers(nextUsers);
    setCurrentUser(nextUser);
    return { ok: true };
  };

  const removeAddress = (id) => {
    if (!currentUser) return { ok: false };
    const existing = currentUser.addresses ?? [];
    const removed = existing.find((addr) => addr.id === id);
    let nextAddresses = existing.filter((addr) => addr.id !== id);
    if (removed?.isDefault) {
      const sameType = nextAddresses.filter((addr) => addr.type === removed.type);
      if (sameType.length > 0) {
        const first = sameType[0];
        nextAddresses = nextAddresses.map((addr) =>
          addr.id === first.id ? { ...addr, isDefault: true } : addr
        );
      }
    }
    const nextUser = { ...currentUser, addresses: nextAddresses };
    const nextUsers = users.map((u) => (u.id === nextUser.id ? nextUser : u));
    setUsers(nextUsers);
    setCurrentUser(nextUser);
    return { ok: true };
  };

  const setDefaultAddress = (id) => {
    if (!currentUser) return { ok: false };
    const target = currentUser.addresses?.find((addr) => addr.id === id);
    if (!target) return { ok: false };
    const nextAddresses = (currentUser.addresses ?? []).map((addr) =>
      addr.id === id
        ? { ...addr, isDefault: true }
        : addr.type === target.type
          ? { ...addr, isDefault: false }
          : addr
    );
    const nextUser = { ...currentUser, addresses: nextAddresses };
    const nextUsers = users.map((u) => (u.id === nextUser.id ? nextUser : u));
    setUsers(nextUsers);
    setCurrentUser(nextUser);
    return { ok: true };
  };

  const value = useMemo(
    () => ({
      users,
      currentUser,
      signup,
      login,
      logout,
      updateProfile,
      changePassword,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
    }),
    [users, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
