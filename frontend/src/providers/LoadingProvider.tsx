import React from 'react';
import LoadingScreen from '~/components/LoadingScreen';
import { LoadingContext } from '~/context/LoadingContext';

type Props = {
  children: JSX.Element;
};
export interface initialState {
  loading: boolean;
}
const loadingReducer = (
  state: initialState,
  action: {
    type: string;
    payload: any;
  }
) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

      //   return new Promise((resolve, reject)=>{
      //     setTimeout(()=>{
      //         resolve( {
      //             ...state,
      //             loading: action.payload,
      //           })

      //     },500)
      //   }).then(res=> res);
      break;
    default:
      return state;
  }
};
const actions = {
  setLoading: (value: boolean) => {
    if (value)
      return {
        type: 'SET_LOADING',
        payload: value,
      };
    else {
      return new Promise<{
        type: string;
        payload: boolean;
      }>((resolve, reject) => {
        setTimeout(() => {
          resolve({
            type: 'SET_LOADING',
            payload: value,
          });
        }, 500);
      }).then((res) => res);
    }
  },
};
const initialLoadingState: initialState = {
  loading: false,
};

export default function LoadingProvider({ children }: Props) {
  const [loadingState, dispatch] = React.useReducer(
    loadingReducer,
    initialLoadingState
  );
  console.log(123);
  return (
    <LoadingContext.Provider
      value={{ state: loadingState, loadingDispatch: dispatch }}
    >
      {loadingState.loading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
}

export const { setLoading } = actions;
