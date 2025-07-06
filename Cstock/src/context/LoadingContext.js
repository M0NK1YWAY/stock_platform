import { createContext, useContext } from "react";

export const LoadingContext = createContext({
  setLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);
