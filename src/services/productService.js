import api from './api';

const productService = {
  /**
   * Obtiene todos los productos del catálogo.
   */
  getAllProducts: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las categorías disponibles.
   */
  getAllCategories: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  /**
   * Obtiene un producto por su ID.
   */
  getProductById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo producto. (Solo Admin)
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/productos', productData);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente. (Solo Admin)
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/productos/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un producto. (Solo Admin)
   */
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva categoría. (Solo Admin)
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categorias', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  },

  /**
   * Actualiza una categoría existente. (Solo Admin)
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categorias/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la categoría ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una categoría. (Solo Admin)
   */
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la categoría ${id}:`, error);
      throw error;
    }
  }
};

export default productService;
