import * as React from 'react';
import { ReactNode } from 'react';
import { AspectsSidebarContext, SidebarContext } from './AspectsSidebarContext';

/**
 * This plugin component is meant to wrap the sidebar so that the other/default sidebars
 * are hidden when the Aspects sidebar is displayed.
 */
export const SidebarToggleWrapper = ({ component }: { component: ReactNode }) => {
  const { sidebarOpen } = React.useContext<SidebarContext>(AspectsSidebarContext);
  return !sidebarOpen && component;
};
