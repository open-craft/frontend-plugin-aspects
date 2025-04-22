import * as React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CourseOutlineSidebar } from './CourseOutlineSidebar';
import { AspectsSidebarContext } from './AspectsSidebarContext';

afterEach(cleanup);

// <Sticky> uses the IntersectionObserver API
beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

const createSidebarContext = (overrides) => ({
  sidebarOpen: false,
  setSidebarOpen: jest.fn(),
  activeBlock: null,
  setActiveBlock: jest.fn(),
  filteredBlocks: [],
  setFilteredBlocks: jest.fn(),
  filterUnit: null,
  setFilterUnit: jest.fn(),
  ...overrides,
});

const queryClient = new QueryClient();

const renderComponent = (children, props) => render(
  <IntlProvider locale="en">
    <QueryClientProvider client={queryClient}>
      <AspectsSidebarContext.Provider value={createSidebarContext(props.sidebarContext)}>
        {children}
      </AspectsSidebarContext.Provider>
    </QueryClientProvider>
  </IntlProvider>,
);

describe('CourseOutlineSidebar', () => {
  it('renders null without crashing', () => {
    const { container } = renderComponent(
      <CourseOutlineSidebar
        courseId="DemoCourse"
        courseName="Course Name"
        sections={[]}
      />,
      { sidebarContext: {} },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders course dashboard when there is not data and sidebar is open', () => {
    const { getByText } = renderComponent(
      <CourseOutlineSidebar
        courseId="DemoCourse"
        courseName="Course Name"
        sections={[]}
      />,
      { sidebarContext: { sidebarOpen: true } },
    );
    expect(getByText('Analytics')).toBeInTheDocument();
  });
});
