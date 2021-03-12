import {useState} from "react";

export const useSetState = (initialState ) => {
  const [state, setState] = useState(initialState);

  const getState = async () => {
    let state;

    await setState((currentState) => {
      state = currentState;

      return currentState;
    });

    return state;
  };

  return [state, setState, getState];
};