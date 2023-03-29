import { useContext } from "react";
import { StoreContext } from "../store/context";

const useStore = () => {
  return useContext(StoreContext);
};

export default useStore;
