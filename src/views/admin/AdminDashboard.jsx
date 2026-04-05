import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { 
  Plus, Edit2, Trash2, Package, Layers, 
  Search, AlertCircle, CheckCircle2, X 
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para modales de edición/creación
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('product'); // 'product' o 'category'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Error al cargar datos del panel.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'product') {
      setFormData(item || {
        nombre: '', precio: 0, stock: 0, imagen: '', 
        franquicia: '', oferta: false, destacado: false, categoriaId: categories[0]?.id || ''
      });
    } else {
      setFormData(item || { nombre: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (modalType === 'product') {
        if (editingItem) {
          await productService.updateProduct(editingItem.id, formData);
          setSuccess('Producto actualizado con éxito.');
        } else {
          await productService.createProduct(formData);
          setSuccess('Producto creado con éxito.');
        }
      } else {
        if (editingItem) {
          await productService.updateCategory(editingItem.id, formData);
          setSuccess('Categoría actualizada con éxito.');
        } else {
          await productService.createCategory(formData);
          setSuccess('Categoría creada con éxito.');
        }
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError('Error al procesar la solicitud.');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;
    try {
      if (type === 'product') {
        await productService.deleteProduct(id);
      } else {
        await productService.deleteCategory(id);
      }
      setSuccess('Eliminado con éxito.');
      fetchData();
    } catch (err) {
      setError('Error al eliminar.');
    }
  };

  if (loading && products.length === 0) return <div className="admin-loading">Cargando panel...</div>;

  return (
    <div className="admin-dashboard container">
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} /> Productos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Layers size={18} /> Categorías
          </button>
        </div>
      </header>

      {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}
      {success && <div className="alert alert-success"><CheckCircle2 size={18} /> {success}</div>}

      <main className="admin-main">
        {activeTab === 'products' ? (
          <section className="admin-section">
            <div className="section-actions">
              <button className="btn btn-primary" onClick={() => handleOpenModal('product')}>
                <Plus size={18} /> Nuevo Producto
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Franquicia</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.imagen} alt={p.nombre} className="table-img" /></td>
                      <td>{p.nombre}</td>
                      <td>{p.franquicia}</td>
                      <td>Bs. {p.precio.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td className="table-actions">
                        <button className="action-btn edit" onClick={() => handleOpenModal('product', p)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete('product', p.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="admin-section">
            <div className="section-actions">
              <button className="btn btn-primary" onClick={() => handleOpenModal('category')}>
                <Plus size={18} /> Nueva Categoría
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table mini">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>
                      <td className="table-actions">
                        <button className="action-btn edit" onClick={() => handleOpenModal('category', c)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete('category', c.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modal para Crear/Editar */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <header className="modal-header">
              <h3>{editingItem ? 'Editar' : 'Crear'} {modalType === 'product' ? 'Producto' : 'Categoría'}</h3>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </header>
            <form onSubmit={handleSubmit} className="modal-form">
              {modalType === 'product' ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Franquicia</label>
                    <input name="franquicia" value={formData.franquicia} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Precio (Bs.)</label>
                    <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group full">
                    <label>Imagen URL</label>
                    <input name="imagen" value={formData.imagen} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select name="categoriaId" value={formData.categoriaId} onChange={handleInputChange} required>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-checkboxes">
                    <label className="checkbox-label">
                      <input type="checkbox" name="oferta" checked={formData.oferta} onChange={handleInputChange} />
                      ¿En Oferta?
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleInputChange} />
                      ¿Destacado?
                    </label>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Nombre de Categoría</label>
                  <input name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
