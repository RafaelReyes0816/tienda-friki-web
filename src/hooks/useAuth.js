import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth: Hook personalizado para consumir el contexto de autenticación de forma sencilla.
 * 
 * En lugar de importar AuthContext y useContext en cada componente, simplemente
 * usamos: const { user, login, logout } = useAuth();
 * 
 * Esto hace que el código sea más limpio y fácil de mantener.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Seguridad: Si alguien intenta usar useAuth fuera del AuthProvider, lanzamos un error descriptivo.
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};
