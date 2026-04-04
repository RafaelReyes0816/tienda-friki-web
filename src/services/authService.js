import api from './api';

const authService = {
  login: async (email, contrasena) => {
    try {
      const response = await api.post('/Usuarios/login', { email, contrasena });
      return response.data; // { token, usuario }
    } catch (error) {
      throw error.response?.data || 'Error en el inicio de sesión';
    }
  },

  register: async (userData) => {
    try {
      // Estructura según UsuarioCreateDTO: Nombre, Email, Telefono, Contrasena, Rol
      const response = await api.post('/Usuarios', {
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        contrasena: userData.contrasena,
        rol: userData.rol || 'Cliente'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Error en el registro';
    }
  }
};

export default authService;
