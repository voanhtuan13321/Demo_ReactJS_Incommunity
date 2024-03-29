import { createContext, useReducer } from 'react';

// create a new context
const AppContext = createContext();

// reducer
const appReducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case 'ADD_ID_USER':
      return {
        ...state,
        idUser: data,
      };

    case 'ADD_COUNT_CART':
      return {
        ...state,
        countCart: data,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: data,
      };

    default:
      return state;
  }
};

// custom provider of context provider
const AppContextProvider = ({ children }) => {
  const [appContext, appContextDispatch] = useReducer(appReducer, {
    idUser: undefined,
    countCart: 0,
    loading: false,
  });
  return (
    <AppContext.Provider value={{ appContext, appContextDispatch }}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
