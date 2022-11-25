import { createContext } from 'react';
import { initialState } from '~/providers/LoadingProvider';
export const LoadingContext = createContext({} as {
    state: initialState;
    loadingDispatch: React.Dispatch<{
        type: string,
        payload: any
    }>;
});