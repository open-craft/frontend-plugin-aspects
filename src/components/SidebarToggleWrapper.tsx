import { ReactNode } from 'react';
import { useAspectsSidebarContext } from '../hooks';

/**
 * This plugin component is meant to wrap the sidebar so that the other/default sidebars
 * are hidden when the Aspects sidebar is displayed.
 */
export const SidebarToggleWrapper = ({ component }: { component: ReactNode }) => {
  const { sidebarOpen } = useAspectsSidebarContext();
  return !sidebarOpen && component;
};
