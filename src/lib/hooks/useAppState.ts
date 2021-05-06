import { useContext } from "react";
import { StateContext } from "../context/state/stateContext";

const useAppState = () => {
  const state = useContext(StateContext);

  return state;
};

export { useAppState };
