import * as React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useCourseBlocks } from '../hooks';
import { BlockTypes } from '../constants';
import { AspectsSidebar } from './AspectsSidebar';
import { useAspectsSidebarContext } from './AspectsSidebarContext';
import messages from '../messages';
import { Section, Block, castToBlock } from '../types';

interface Props {
  courseId: string;
  courseName: string;
  sections: Section[];
}

function* getGradedSubsections(sections: Section[]) {
  for (const section of sections) {
    for (const subsection of section.childInfo.children) {
      if (subsection.graded) {
        yield subsection;
      }
    }
  }
}

export function CourseOutlineSidebar({ courseId, courseName, sections }: Props) {
  const intl = useIntl();
  const { filteredBlocks } = useAspectsSidebarContext();
  const { data } = useCourseBlocks(courseId);

  const gradedSubsections = sections ? Array.from(getGradedSubsections(sections)) : null;
  let problems = data?.problems;
  let videos = data?.videos;

  if (filteredBlocks?.length) {
    problems = problems?.filter(block => filteredBlocks.includes(block.id));
    videos = videos?.filter(block => filteredBlocks.includes(block.id));
  }
  const contentLists: { title: string, blocks: Block[] }[] = [];

  // graded subsections are shown only when unit-filtering is off
  if (!filteredBlocks?.length && gradedSubsections?.length) {
    contentLists.push({
      title: intl.formatMessage(messages.gradedSubsectionAnalytics),
      blocks: castToBlock(gradedSubsections) as Block[],
    });
  }
  if (problems?.length) {
    contentLists.push({
      title: intl.formatMessage(messages.problemAnalytics),
      blocks: problems,
    });
  }
  if (videos?.length) {
    contentLists.push({
      title: intl.formatMessage(messages.videoAnalytics),
      blocks: videos,
    });
  }

  return (
    <AspectsSidebar
      title={courseName}
      blockType={BlockTypes.course}
      dashboardId={courseId}
      contentLists={contentLists}
    />
  );
}
