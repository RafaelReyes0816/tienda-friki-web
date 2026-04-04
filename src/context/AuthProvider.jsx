import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

/**
 * AuthProvider: Este componente es el "corazón" de la seguridad en el frontend.
 * Su función principal es envolver a toda la aplicación para proveer el estado
 * de autenticación (usuario logueado, roles, tokens) a cualquier componente hijo.
 */
export const AuthProvider = ({ children }) => {
  // Estado para almacenar los datos del usuario logueado
  const [user, setUser] = useState(null);
  
  // Estado para controlar si la aplicación está verificando la sesión inicial
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  /**
   * useEffect: Se ejecuta una sola vez cuando la aplicación carga.
   * Su objetivo es la "Persistencia de Sesión": busca en el almacenamiento local (localStorage)
   * si ya existe un usuario y un token guardados de una sesión anterior.
   */
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      
      // Si ambos existen, restauramos el estado del usuario
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error al procesar el usuario guardado:", error);
          // Si los datos están corruptos, limpiamos todo para seguridad
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
        }
      }
      // Una vez terminada la verificación, dejamos de mostrar el estado de carga
      setLoading(false);
    };

    initializeAuth();
  }, []); // El array vacío asegura que solo corra al montar la app

  /**
   * login: Función para iniciar sesión.
   * Recibe los datos del usuario y el token JWT del backend.
   * useCallback: Se usa para que la función no se recree en cada renderizado,
   * optimizando el rendimiento de los componentes que la usan.
   */
  const login = useCallback((userData, token) => {
    // Guardamos en el navegador para que la sesión persista al recargar (F5)
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(userData));
    
    // Actualizamos el estado global
    setUser(userData);
    
    // Redirección inteligente basada en el ROL del usuario (RF-15)
    if (userData.rol === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }, [navigate]);

  /**
   * logout: Finaliza la sesión del usuario.
   * Borra los datos del almacenamiento y resetea el estado global.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Helpers rápidos para verificar roles en cualquier parte de la app
  const isAdmin = useCallback(() => user?.rol === 'Admin', [user]);
  const isCliente = useCallback(() => user?.rol === 'Cliente', [user]);

  /**
   * useMemo: Memoriza el objeto de valor del contexto.
   * Solo se recalcula si cambia el usuario o el estado de carga.
   * Esto evita renderizados innecesarios en TODA la aplicación.
   */
  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAdmin,
    isCliente,
    loading
  }), [user, login, logout, isAdmin, isCliente, loading]);

  return (
    <AuthContext.Provider value={value}>
      {/* Solo renderizamos el resto de la app cuando hayamos terminado de verificar la sesión inicial */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
