import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, IconButton } from '@openedx/paragon';
import { AutoGraph } from '@openedx/paragon/icons';
import * as React from 'react';
import messages from '../messages';
import { useAspectsSidebarContext, useChildBlockCounts } from '../hooks';
import { Block, Unit, castToBlock } from '../types';

export function UnitActionsButton({
  unit,
}: { unit: Unit }) {
  const intl = useIntl();
  const {
    sidebarOpen,
    setSidebarOpen,
    setFilteredBlocks,
    setActiveBlock,
    filterUnit,
    setFilterUnit,
    activeBlock,
  } = useAspectsSidebarContext();
  const { data, error } = useChildBlockCounts(unit?.id);

  if (error || !data || (data?.blocks && (Object.keys(data?.blocks).length === 0))) {
    return null;
  }

  return (
    <IconButton
      isActive={
        sidebarOpen && (
          (filterUnit?.id === unit.id)
          || (!!activeBlock && (activeBlock?.id in data.blocks))
        )
      }
      alt={intl.formatMessage(messages.analyticsLabel)}
      src={AutoGraph}
      iconAs={Icon}
      variant="black"
      onClick={() => {
        setSidebarOpen(true);
        if (filterUnit?.id === unit.id) {
          setActiveBlock(null);
          setFilteredBlocks([]);
          setFilterUnit(null);
        } else {
          setActiveBlock(castToBlock(unit) as Block);
          setFilteredBlocks(Object.keys(data.blocks));
          setFilterUnit(castToBlock(unit) as Block);
        }
      }}
    />
  );
}
