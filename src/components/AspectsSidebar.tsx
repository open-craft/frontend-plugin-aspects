import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Card,
  Icon,
  IconButton,
  IconButtonWithTooltip,
  Stack,
  Button,
} from '@openedx/paragon';
import {
  ArrowBack, Close, ViewAgenda, AutoGraph, ChevronRight,
} from '@openedx/paragon/icons';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDashboardEmbed } from '../hooks';
import messages from '../messages';
import { AspectsSidebarContext } from './AspectsSidebarContext';

function* getGradedSubsections(sectionsList) {
  for (const section of sectionsList) {
    for (const subsection of section.childInfo.children) {
      if (subsection.graded) {
        yield subsection;
      }
    }
  }
}

const GradedSubsectionsList = () => {
  const intl = useIntl();

  const {
    sidebarOpen,
    sidebarTitle,
    location,
    setSidebarOpen,
    setLocation,
    setSidebarTitle,
  } = React.useContext(AspectsSidebarContext);
  const sectionsList = useSelector(state => state.courseOutline.sectionsList);
  const gradedSubsections = Array.from(getGradedSubsections(sectionsList));
  console.log({ sectionsList });
  return (
    <div className="d-flex flex-column shadow p-2 my-2 bg-white">
      <h3>{intl.formatMessage(messages.gradedSubsectionAnalytics)}</h3>
      {gradedSubsections.map(subsection => (
        <Button
          className="d-flex flex-row align-items-start justify-content-start flex-grow-1 my-1"
          variant="inline"
          onClick={() => {
            setLocation(subsection.id);
            setSidebarTitle(subsection.displayName);
          }}
        >

          <Icon src={ViewAgenda} aria-hidden />
          <span className="d-flex flex-grow-1 text-left">
            {subsection.displayName}
          </span>
          <Icon src={ChevronRight} aria-hidden />

        </Button>
      ))}
    </div>
  );
};

export const AspectsSidebar = () => {
  const intl = useIntl();
  const {
    sidebarOpen,
    sidebarTitle,
    location,
    setSidebarOpen,
    setLocation,
  } = React.useContext(AspectsSidebarContext);
  const { courseId } = useParams();
  const courseName = useSelector(state => state.models?.courseDetails?.[courseId]?.name);
  const dashboardContainerId = 'dashboard-container';

  const { error } = useDashboardEmbed(dashboardContainerId, location ?? courseId, sidebarOpen);

  return sidebarOpen && (
    <Card className="rounded position-sticky" style={{ top: '2rem' }}>
      <div className="sidebar-header d-flex flex-column shadow p-2 bg-white">
        <Stack className="course-unit-sidebar-header" direction="horizontal">
          <h3 className="course-unit-sidebar-header-title m-0 d-flex align-items-center flex-grow-1">
            {intl.formatMessage(messages.analyticsLabel)} <Icon
              src={AutoGraph}
              aria-hidden
            />
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
            />
          </h3>
        </Stack>
        <div className="d-flex flex-row align-items-center my-2">
          {location && (
          <IconButton
            alt={intl.formatMessage(messages.backButtonLabel)}
            src={ArrowBack}
            iconAs={Icon}
            variant="black"
            onClick={() => setLocation(null)}
            size="inline"
          />
          )}
          {location
            ? sidebarTitle
            : courseName}
        </div>
      </div>
      <div id={dashboardContainerId} className="d-flex w-100" />
        {!location && <GradedSubsectionsList />}
        {error && <div>Error: {error.message}</div>}
    </Card>
  );
};
