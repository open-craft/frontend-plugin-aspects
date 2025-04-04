import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import * as React from 'react';
import { useParams } from 'react-router-dom';

const guestTokenUrl = (courseId: string) => `${getConfig().LMS_BASE_URL}/aspects/superset_guest_token/${courseId}`;
const dashboardUrl = (usageKey: string) => `${getConfig().LMS_BASE_URL}/aspects/superset_in_context_dashboard/${usageKey}`;

const fetchGuestTokenFromBackend = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(guestTokenUrl(courseId));
  return data.guestToken;
};

type DashBoardConfig = {
    supersetUrl: string,
    dashboardId: string,
}

export const useDashboardEmbed = (containerId: string, usageKey: string, visible: boolean) => {
  const { courseId } = useParams();
  const [dashboardConfig, setDashboardConfig] = React.useState<DashBoardConfig | null>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!usageKey) { return; }
    (async () => {
      setError(null);
      try {
        const { data } = await getAuthenticatedHttpClient()
          .get(dashboardUrl(usageKey));
        setDashboardConfig(data);
      } catch (e) {
        setError(e);
      }
    })();
  }, [usageKey]);

  React.useEffect(() => {
    if (!visible || !dashboardConfig?.supersetUrl || !dashboardConfig?.dashboardId) { return; }
    (async () => {
      try {
        await embedDashboard({
          id: dashboardConfig.dashboardId,
          supersetDomain: dashboardConfig.supersetUrl,
          mountPoint: document.getElementById(containerId),
          fetchGuestToken: async () => fetchGuestTokenFromBackend(courseId),
          dashboardUiConfig: {
            hideTitle: true,
            hideTab: true,
            filters: {
              visible: false,
              expanded: false,
            },
            urlParams: {
              native_filters: dashboardConfig.courseRuns[dashboardConfig.defaultCourseRun].native_filters,
            },
          },
        });
        setLoaded(true);
      } catch (e) {
        setError(e);
      }
    })();
  }, [dashboardConfig, containerId, visible, courseId]);
  return { loaded, error };
};
