import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Leaf,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
  category_label: string;
  category_blurb: string;
  is_veg: boolean;
  tags: string[];
  is_popular: boolean;
  sort_order: number;
};

const CATEGORIES = [
  { id: 'starters', label: 'Starters' },
  { id: 'main-course', label: 'Main Course' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'beverages', label: 'Beverages' },
];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading, logout } = useAdminAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: 'starters',
    is_veg: true,
    image: 'https://images.pexels.com/photos/37153389/pexels-photo-37153389.jpeg?auto=compress&cs=tinysrgb&w=1000',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Get admin token for Edge Function calls
  const getAdminToken = () => {
    const session = localStorage.getItem('admin_session');
    if (!session) return null;
    try {
      const { email } = JSON.parse(session);
      return btoa(`${email}:spicegarden123`);
    } catch {
      return null;
    }
  };

  // Call Edge Function for admin operations
  const adminFetch = async (method: string, body?: object) => {
    const token = getAdminToken();
    if (!token) throw new Error('Not authenticated');

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/admin-menu`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn) fetchItems();
  }, [isLoggedIn]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('GET');
      setItems(data as MenuItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      price: item.price,
      category_id: item.category_id,
      is_veg: item.is_veg,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setError('');

    const cat = CATEGORIES.find((c) => c.id === editForm.category_id);
    try {
      await adminFetch('PUT', {
        id: editingId,
        name: editForm.name,
        price: editForm.price,
        category_id: editForm.category_id,
        category_label: cat?.label || editForm.category_id,
        is_veg: editForm.is_veg,
      });
      setEditingId(null);
      setEditForm({});
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await adminFetch('DELETE', { id });
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const addNewItem = async () => {
    if (!newForm.name.trim() || newForm.price <= 0) {
      setError('Please fill in name and a valid price.');
      return;
    }

    setSaving(true);
    setError('');

    const cat = CATEGORIES.find((c) => c.id === newForm.category_id);
    try {
      await adminFetch('POST', {
        name: newForm.name.trim(),
        description: newForm.description.trim() || 'A delicious dish.',
        price: newForm.price,
        image: newForm.image,
        category_id: newForm.category_id,
        category_label: cat?.label || newForm.category_id,
        category_blurb: 'Delicious offerings.',
        is_veg: newForm.is_veg,
        tags: newForm.is_veg ? ['Veg'] : [],
        is_popular: false,
        sort_order: 999,
      });
      setAddingNew(false);
      setNewForm({
        name: '',
        description: '',
        price: 0,
        category_id: 'starters',
        is_veg: true,
        image: 'https://images.pexels.com/photos/37153389/pexels-photo-37153389.jpeg?auto=compress&cs=tinysrgb&w=1000',
      });
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
    setSaving(false);
  };

  // Stats
  const totalCount = items.length;
  const categoryCounts = CATEGORIES.map((c) => ({
    label: c.label,
    count: items.filter((i) => i.category_id === c.id).length,
  }));

  if (authLoading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-gray-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Spice Garden Menu Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              <p className="text-sm text-gray-500">Total Items</p>
            </div>
            {categoryCounts.map((c) => (
              <div key={c.label} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-2xl font-bold text-gray-900">{c.count}</p>
                <p className="text-sm text-gray-500">{c.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Manager */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Menu Items
            </h2>
            <button
              onClick={() => setAddingNew(true)}
              className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Add New Form */}
          {addingNew && (
            <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Menu Item</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                    placeholder="Dish name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select
                    value={newForm.category_id}
                    onChange={(e) => setNewForm({ ...newForm, category_id: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newForm.price}
                    onChange={(e) => setNewForm({ ...newForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select
                    value={newForm.is_veg ? 'veg' : 'non-veg'}
                    onChange={(e) => setNewForm({ ...newForm, is_veg: e.target.value === 'veg' })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={addNewItem}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save
                </button>
                <button
                  onClick={() => setAddingNew(false)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Items Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Dish Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {editingId === item.id ? (
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-gray-500 focus:outline-none"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === item.id ? (
                            <select
                              value={editForm.category_id || ''}
                              onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-gray-500 focus:outline-none"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-sm text-gray-600">{item.category_label}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === item.id ? (
                            <input
                              type="number"
                              value={editForm.price || 0}
                              onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                              className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-gray-500 focus:outline-none"
                              min={0}
                            />
                          ) : (
                            <span className="font-sans text-sm text-gray-900">{inr(item.price)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === item.id ? (
                            <select
                              value={editForm.is_veg ? 'veg' : 'non-veg'}
                              onChange={(e) => setEditForm({ ...editForm, is_veg: e.target.value === 'veg' })}
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-gray-500 focus:outline-none"
                            >
                              <option value="veg">Vegetarian</option>
                              <option value="non-veg">Non-Vegetarian</option>
                            </select>
                          ) : item.is_veg ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                              <Leaf className="h-3 w-3" />
                              Veg
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                              Non-Veg
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === item.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-green-50 text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50"
                              >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEdit(item)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
