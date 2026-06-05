import { useAuthContext } from '../context/AuthContext';

/**
 * useAuth — thin wrapper around AuthContext
 * Usage: const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => useAuthContext();
