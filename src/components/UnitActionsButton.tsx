import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, IconButton } from '@openedx/paragon';
import { AutoGraph } from '@openedx/paragon/icons';
import * as React from 'react';
import messages from '../messages';
import { AspectsSidebarContext, SidebarContext } from './AspectsSidebarContext';

interface UnitActionsButtonProps {
    unit: { id: string, displayName: string } | undefined,
    subsection: {id: string, displayName: string, graded: boolean},
}

export const UnitActionsButton = ({
  unit,
  subsection,
}: UnitActionsButtonProps) => {
  const intl = useIntl();
  const {
    sidebarOpen,
    location,
    setSidebarOpen,
    setSidebarTitle,
    setLocation,
  } = React.useContext<SidebarContext>(AspectsSidebarContext);

  const buttonLocation = unit
    ? unit.id
    : subsection.id;
  const title = unit
    ? unit.displayName
    : subsection.displayName;
  return subsection?.graded && (
    <IconButton
      isActive={sidebarOpen && location === buttonLocation}
      alt={intl.formatMessage(messages.analyticsLabel)}
      src={AutoGraph}
      iconAs={Icon}
      variant="black"
      onClick={() => {
        if (location === buttonLocation) {
          setSidebarOpen(false);
        } else {
          setLocation(buttonLocation);
          setSidebarOpen(true);
          setSidebarTitle(title);
        }
      }}
    />
  );
};
