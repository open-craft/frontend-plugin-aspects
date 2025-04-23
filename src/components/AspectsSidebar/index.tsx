import { useIntl } from '@edx/frontend-platform/i18n';
import * as React from 'react';
import {
  Alert, Icon, IconButton, IconButtonWithTooltip, Stack, Sticky,
} from '@openedx/paragon';
import {
  ArrowBack, AutoGraph, Close, Warning,
} from '@openedx/paragon/icons';
import { BlockTypes, ICON_MAP } from '../../constants';
import { useAspectsSidebarContext } from '../../hooks';

import messages from '../../messages';
import { CourseContentList } from './CourseContentList';
import { Dashboard } from './Dashboard';
import { Block } from '../../types';

type ContentList = {
  title: string;
  blocks: Block[];
};

interface AspectsSidebarProps {
  title: string;
  blockType: BlockTypes;
  dashboardId: string;
  contentLists: ContentList[];
  blockActivatedCallback?: (block: Block) => void;
}

export function AspectsSidebar({
  title,
  blockType,
  dashboardId,
  contentLists,
  blockActivatedCallback,
}: AspectsSidebarProps) {
  const intl = useIntl();
  const {
    sidebarOpen, setSidebarOpen, setFilteredBlocks, activeBlock, setActiveBlock,
    filterUnit, setFilterUnit,
  } = useAspectsSidebarContext();

  // The activeBlock is not reset during page navigations, leading to stale dashboards.
  // This useEffect ensures things are reset. The "set" functions are not included in
  // the dependency list as they are recreated everytime the "hookState" changes, thus
  // resetting everything to null state on every re-render. Setting it to an empty
  // array makes sure it is run only on the first render after navigation.
  React.useEffect(() => {
    setActiveBlock(null);
    setFilterUnit(null);
    setFilteredBlocks([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!sidebarOpen) {
    return null;
  }

  const hideDashboard: boolean = (
    (!!activeBlock && (activeBlock.type === 'vertical'))
    || (!activeBlock && (blockType === 'vertical'))
  );
  const topTitle = activeBlock?.displayName || title;
  const activeBlockType = activeBlock?.type || blockType;
  const contentListSize: number = contentLists.reduce((acc, list) => acc + list.blocks.length, 0);

  const activateDashboard = (block: Block) => {
    setActiveBlock(block);
    if (activeBlockType === BlockTypes.vertical && !!blockActivatedCallback) {
      blockActivatedCallback(block);
    }
  };
  // reset all the active values to props
  const goBack = () => {
    // Currently viewing component dashboard of a filtered view of a specific unit
    // Go back to the filtered view of the unit
    if (filterUnit && (activeBlock?.id !== filterUnit.id)) {
      setActiveBlock(filterUnit);
    } else if (filterUnit?.id === activeBlock?.id) {
      // Viewing the filtered view of a unit - go back to full course view
      setActiveBlock(null);
      setFilterUnit(null);
      setFilteredBlocks([]);
    } else {
      // reset to default view for all other cases
      setActiveBlock(null);
    }
  };

  return (
    <div className="w-100 h-100">
      <Sticky className="shadow rounded" offset={2}>
        <div className="bg-white rounded w-100">
          <Stack className="sidebar-header">
            <Stack className="course-unit-sidebar-header px-4 pt-4" direction="horizontal">
              <h5 className="course-unit-sidebar-header-title h5 flex-grow-1 text-gray">
                {intl.formatMessage(messages.analyticsLabel)}
                <Icon
                  src={AutoGraph}
                  size="xs"
                  className="d-inline-block ml-1"
                  aria-hidden
                  style={{ verticalAlign: 'middle' }}
                />
              </h5>
              <IconButtonWithTooltip
                className="ml-auto"
                tooltipContent={intl.formatMessage(messages.closeButtonLabel)}
                tooltipPlacement="top"
                alt={intl.formatMessage(messages.closeButtonLabel)}
                src={Close}
                iconAs={Icon}
                variant="black"
                onClick={() => {
                  setSidebarOpen(false);
                }}
                size="sm"
              />
            </Stack>
            <h3 className="h3 px-4 pb-4 mb-0 d-flex align-items-center">
              {(activeBlock) && (
                <IconButton
                  className="mr-2"
                  alt={intl.formatMessage(messages.backButtonLabel)}
                  src={ArrowBack}
                  iconAs={Icon}
                  onClick={() => goBack()}
                  size="sm"
                />
              )}
              <Icon
                src={ICON_MAP[activeBlockType]}
                size="sm"
                className="d-inline-block mr-2 text-gray"
                aria-hidden
              />
              <span>{topTitle}</span>
            </h3>
          </Stack>
          { !hideDashboard && (
            <Dashboard usageKey={activeBlock?.id || dashboardId} title={topTitle} />
          )}
          {((activeBlockType === 'course') || (activeBlockType === 'vertical'))
            && contentLists.map(({ title: listTitle, blocks }) => (
              <CourseContentList
                key={listTitle}
                title={listTitle}
                blocks={blocks}
                activateDashboard={activateDashboard}
              />
            ))}

          {(hideDashboard && !contentListSize)
            && (
            <Alert icon={Warning} variant="warning" className="mb-0">
              {
                blockType === 'course'
                  ? intl.formatMessage(messages.noAnalyticsForCourse)
                  : intl.formatMessage(messages.noAnalyticsForUnit)
              }
            </Alert>
            )}
        </div>
      </Sticky>
    </div>
  );
}
