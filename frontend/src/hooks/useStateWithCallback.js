import { useEffect } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useState } from "react";

export const useStateWithCallBack = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);
  const updateState = useCallback(
    (newState, cb) => {
      cbRef.current = cb;
      setState((prev) =>
        typeof newState === "function" ? newState(prev) : newState
      );
    },
    [state]
  );
  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};
