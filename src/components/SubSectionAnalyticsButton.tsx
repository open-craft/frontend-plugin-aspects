import * as React from 'react';
import { IconButton } from '@openedx/paragon';
import { AutoGraph } from '@openedx/paragon/icons';
import { useAspectsSidebarContext } from '../hooks';
import { Block, SubSection, castToBlock } from '../types';

export function SubSectionAnalyticsButton({ subsection }: { subsection: SubSection }) {
  const { activeBlock, setActiveBlock, setSidebarOpen } = useAspectsSidebarContext();
  if (!subsection.graded) {
    return null;
  }
  return (
    <IconButton
      alt="Analytics"
      iconAs={AutoGraph}
      isActive={activeBlock?.id === subsection.id}
      onClick={() => {
        setSidebarOpen(true);
        setActiveBlock(castToBlock(subsection) as Block);
      }}
    />
  );
}
