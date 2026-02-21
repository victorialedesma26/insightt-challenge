import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import type { User } from '@auth0/auth0-react';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken } from '../services/tokenStorage';

const MissingAuthConfiguration = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #F3F5F7 0%, #E7EEF5 100%)',
      color: '#0C1B33',
    }}
  >
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Auth0 configuration needed</h1>
      <p style={{ marginBottom: '1rem', color: '#4A5568' }}>
        Define <code>VITE_AUTH0_DOMAIN</code> and <code>VITE_AUTH0_CLIENT_ID</code> inside
        <code>frontend/.env</code> (see <code>.env.example</code>) so the frontend can authenticate and display
        your tasks.
      </p>
      <p style={{ marginBottom: '1.25rem', color: '#4A5568' }}>
        Once configured, restart <code>npm run dev</code> in <code>frontend/</code> and log in normally.
      </p>
    </div>
  </div>
);

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthStateProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    error,
  } = useAuth0();
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const refreshToken = useCallback(async () => {
    const newToken = await getAccessTokenSilently();
    setToken(newToken);
    setStoredToken(newToken);
    return newToken;
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      void refreshToken();
    } else {
      setToken(null);
      clearStoredToken();
    }
  }, [isAuthenticated, refreshToken]);

  useEffect(() => {
    if (error) {
      console.error('Auth0 error', error);
    }
  }, [error]);

  const handleLogout = useCallback(() => {
    clearStoredToken();
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      token,
      login: async () => {
        await loginWithRedirect();
      },
      logout: handleLogout,
      getAccessToken: refreshToken,
    }),
    [isAuthenticated, isLoading, user, token, loginWithRedirect, handleLogout, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    console.warn('Auth0 environment variables are missing. Define VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID.');
    const fallbackValue: AuthContextValue = {
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
      token: null,
      login: async () => {
        alert('Configure Auth0 variables in frontend/.env before logging in.');
      },
      logout: () => {
        clearStoredToken();
      },
      getAccessToken: async () => {
        throw new Error('Auth0 is not configured');
      },
    };

    return (
      <AuthContext.Provider value={fallbackValue}>
        <MissingAuthConfiguration />
      </AuthContext.Provider>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
    >
      <AuthStateProvider>{children}</AuthStateProvider>
    </Auth0Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return context;
};
