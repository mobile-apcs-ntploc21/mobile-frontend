import React, { createContext, useEffect, useReducer } from 'react';

interface AuthState {
  isAuthenticated: boolean | false;
  isInitialized: boolean | false;
  user: any | null;
}

interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers: { [key: string]: (state: AuthState, action: AuthAction) => AuthState } = {
  INITIALIZE: (state: AuthState, { payload }: AuthAction) => {
    const { isAuthenticated, user } = payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: AuthState, { payload }: AuthAction) => {
    const { user } = payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: AuthState) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  },
  REGISTER: (state: AuthState, { payload }: AuthAction) => {
    const { user } = payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state: AuthState, action: AuthAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  login: async () => {},
  logout: async () => {},
  register: async () => {}
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      const user = null; // getUser()
      if (user) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await null; // Login(email, password)
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    await null; // logout()
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email: string, password: string) => {
    const user = await null; // Register(email, password)
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
