import { useContext } from "react";
import { stateContext, StateContext } from "../context/state/stateContext";

const useAppState = () => {
  const state = useContext<stateContext>(StateContext);

  return state;
};

export { useAppState };
