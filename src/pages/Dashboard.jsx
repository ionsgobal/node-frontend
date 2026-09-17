import React, { useState, useEffect, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // 1. Retrieve products inventory on view mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data);
      } catch (err) {
        console.log('Error fetching catalog.');
      }
    };
    fetchProducts();
  }, []);

  // 2. Dispatch product creation (Admin Only)
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', { title, description, price: Number(price), stock: Number(stock) });
      setProducts([res.data.data, ...products]);
      setTitle(''); setDescription(''); setPrice(''); setStock('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Product creation failed.');
    }
  };

  // 3. Dispatch Product Purge/Delete (Admin Only)
  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/` + id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || 'Delete action unauthorized.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-wide">SaaS MANAGEMENT CONSOLE</h1>
          <p className="text-xs text-slate-400">Logged in as: <span className="text-sky-400 font-bold">{user?.username}</span> ({user?.role})</p>
        </div>
        <button onClick={logoutUser} className="bg-red-500 hover:bg-red-600 text-slate-950 px-4 py-2 font-bold rounded-lg transition-colors text-xs uppercase">Exit System</button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {user?.role === 'admin' && (
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-fit shadow-lg">
            <h3 className="text-lg font-bold mb-6 text-sky-400">ADD INVENTORY ITEM</h3>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" placeholder="e.g. Premium Hub" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500 h-20" placeholder="Specifications..." />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Price ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="99" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Stock</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="5" />
              </div>
            </div>
            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold py-2 rounded-lg transition-colors text-xs uppercase">Insert Record</button>
          </form>
        )}

        <div className={user?.role === 'admin' ? "lg:col-span-2 space-y-4" : "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6"}>
          {products.map((product) => (
            <div key={product._id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-bold text-white">{product.title}</h4>
                  <span className="text-emerald-400 font-bold">${product.price}</span>
                </div>
                <p className="text-slate-400 text-xs mb-4">{product.description}</p>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800/50 pt-4 mt-2">
                <span className="text-slate-400 text-xs">Stock: {product.stock} units
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(product._id)} className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 px-3 py-1 font-semibold rounded-lg text-xs">Purge</button>
                )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}