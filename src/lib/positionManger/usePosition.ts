import { useContext } from "react";
import { PositionContext } from "./context";

const usePosition = () => {
  return useContext(PositionContext);
};

export default usePosition;
