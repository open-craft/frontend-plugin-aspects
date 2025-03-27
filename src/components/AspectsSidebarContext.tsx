import * as React from 'react';
import { ReactNode } from 'react';

export type SidebarContext = {
    sidebarOpen: boolean,
    setSidebarOpen: (value: boolean) => void,
    location: string,
    setLocation: (value: string) => void,
    sidebarTitle: string,
    setSidebarTitle: (value: string) => void,
}

export const AspectsSidebarContext = React.createContext<SidebarContext>({
  sidebarOpen: false,
  location: null,
  sidebarTitle: null,
  setSidebarOpen: (value: boolean) => {},
  setLocation: (value: string) => {},
  setSidebarTitle: (value: string) => {},
});

export const AspectsSidebarProvider = ({ component }: { component: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [sidebarTitle, setSidebarTitle] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<string | null>(null);
  return (
    <AspectsSidebarContext.Provider
      value={{
        sidebarOpen,
        sidebarTitle,
        setSidebarTitle,
        location,
        setSidebarOpen,
        setLocation,
      }}
    >
      {component}
    </AspectsSidebarContext.Provider>
  );
};
