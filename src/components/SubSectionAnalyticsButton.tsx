import * as React from 'react';
import { IconButton } from '@openedx/paragon';
import { AutoGraph } from '@openedx/paragon/icons';
import { useAspectsSidebarContext } from './AspectsSidebarContext';
import { Block, SubSection, castToBlock } from '../types';

export function SubSectionAnalyticsButton({ subsection }: { subsection: SubSection }) {
  const { activeBlock, setActiveBlock } = useAspectsSidebarContext();
  if (!subsection.graded) {
    return null;
  }
  return (
    <IconButton
      alt="Analytics"
      iconAs={AutoGraph}
      isActive={activeBlock?.id === subsection.id}
      onClick={() => setActiveBlock(castToBlock(subsection) as Block)}
    />
  );
}
