import React from "react";

const IonnetContext = React.createContext<IonnetProviderData>(null!);

export function useIonnet() {
  return React.useContext(IonnetContext);
}

interface IonnetProviderProps {
  children: React.ReactNode;
}

export interface IonnetProviderData {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

/**
 * Provides a top-level interface for interacting with global state.
 */
export default function IonnetProvider(props: IonnetProviderProps) {
  const [showSidebar, setShowSidebar] = React.useState(true);
  
  return (
    <IonnetContext.Provider value={{
      showSidebar,
      setShowSidebar
    }}>
      {props.children}
    </IonnetContext.Provider>
  );
}