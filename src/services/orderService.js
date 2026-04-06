import api from './api';

const orderService = {
  /**
   * Crea un nuevo pedido a partir del carrito.
   */
  createOrder: async (orderData) => {
    try {
      console.log('Enviando datos del pedido:', orderData);
      
      // Primero verificar y actualizar el stock de cada producto
      for (const detalle of orderData.detalles) {
        try {
          // Obtener el producto actual para verificar stock
          const productResponse = await api.get(`/productos/${detalle.productoId}`);
          const product = productResponse.data;
          
          // Verificar si hay stock suficiente
          if (product.stock < detalle.cantidad) {
            throw new Error(`Stock insuficiente para el producto ${product.nombre}. Stock disponible: ${product.stock}, solicitado: ${detalle.cantidad}`);
          }
          
          // Actualizar el stock
          const updatedProduct = {
            ...product,
            stock: product.stock - detalle.cantidad
          };
          
          await api.put(`/productos/${detalle.productoId}`, updatedProduct);
          console.log(`Stock actualizado para producto ${detalle.productoId}: ${product.stock} -> ${updatedProduct.stock}`);
          
        } catch (stockError) {
          console.error(`Error al actualizar stock del producto ${detalle.productoId}:`, stockError);
          throw new Error(`Error al actualizar stock: ${stockError.message}`);
        }
      }
      
      // Después de actualizar el stock, crear el pedido
      const response = await api.post('/pedidos', orderData);
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      console.error('Datos del error:', error.response?.data);
      const message = error.response?.data?.message || error.message || 'No se pudo procesar el pedido.';
      throw new Error(message);
    }
  },

  /**
   * Obtiene el historial de pedidos de un usuario.
   */
  getOrdersByUser: async (usuarioId) => {
    try {
      console.log(`Obteniendo pedidos para usuario ${usuarioId}`);
      const response = await api.get(`/pedidos/usuario/${usuarioId}`);
      console.log('Pedidos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      console.error('Datos del error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Obtiene todos los pedidos (Solo Admin).
   */
  getAllOrders: async () => {
    try {
      const response = await api.get('/pedidos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los pedidos:', error);
      throw error;
    }
  },

  /**
   * Actualiza el estado de un pedido (Solo Admin).
   */
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      // Primero obtener el pedido completo
      const orderResponse = await api.get(`/pedidos/${orderId}`);
      const order = orderResponse.data;
      
      // Actualizar el estado
      order.estado = newStatus;
      
      // Enviar el pedido completo con PUT
      const response = await api.put(`/pedidos/${orderId}`, order);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      if (error.response?.status === 405) {
        throw new Error('El backend no soporta la actualización de pedidos. Contacta al administrador.');
      }
      throw error;
    }
  }
};

export default orderService;
