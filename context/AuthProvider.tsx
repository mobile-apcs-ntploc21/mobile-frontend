import React, { createContext, useReducer, useContext, useEffect } from 'react';

import {
  getUser,
  register as CreateUser,
  login as GQLLogin
} from '@/services/auth';

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
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

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    username: string,
    phone: string,
    email: string,
    password: string
  ) => Promise<void>;
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

/**
 * @var handlers
 * @brief A collection of handler functions for the different action types.
 *
 * Each handler function takes the current state and an action, and returns the new state.
 * The `LOGIN`, `LOGOUT`, and `REGISTER` handlers handle the respective actions by updating the authentication state and user.
 */
const handlers: {
  [key: string]: (state: AuthState, action: AuthAction) => AuthState;
} = {
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

/**
 * @fn reducer
 * @brief The reducer function for the authentication state.
 *
 * This function takes the current state and an action, and returns the new state.
 * It uses the `handlers` object to handle the different action types.
 * If there's no handler for the action type, it returns the current state unchanged.
 *
 * @param state The current authentication state.
 * @param action The action to handle.
 * @return The new authentication state.
 */
const reducer = (state: AuthState, action: AuthAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

/**
 * @fn AuthProvider
 * @brief The context provider for the authentication state and actions.
 *
 * This component uses the `useReducer` and `useEffect` hooks to manage the authentication state and initialize it when the component mounts.
 * It provides the authentication state and dispatch function to its children via the `AuthContext`.
 *
 * @param children The child components to render.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      const user = await getUser();

      if (user != null) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await GQLLogin(email, password);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    // await AsyncStorage.clear();
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (
    username: string,
    phone: string,
    email: string,
    password: string
  ) => {
    const user = await CreateUser(username, phone, email, password);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
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

// Hook
export const useAuth = () => useContext(AuthContext);
