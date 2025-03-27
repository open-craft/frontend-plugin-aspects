import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  analyticsLabel: {
    id: 'aspects.label',
    defaultMessage: 'Analytics',
    description: 'Label for the analytics buttons on the course outline and unit header etc.',
  },
  closeButtonLabel: {
    id: 'aspects.button.close.alt',
    defaultMessage: 'Close',
    description: 'Label for the close icon button in the sidebar.',
  },
  backButtonLabel: {
    id: 'aspects.button.back.alt',
    defaultMessage: 'Back',
    description: 'Label for the back icon button in the sidebar.',
  },
  gradedSubsectionAnalytics: {
    id: 'aspects.title.graded-analytics',
    defaultMessage: 'Graded Subsection Analytics',
    description: 'Title for card showing list of graded subsections for analytics.',
  },
});

export default messages;
