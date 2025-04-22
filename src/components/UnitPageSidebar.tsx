import * as React from 'react';
// @ts-ignore
import { useIframe } from 'CourseAuthoring/generic/hooks/context/hooks';
import { BlockTypes } from '../constants';
import { AspectsSidebar } from './AspectsSidebar';
import { castToBlock, XBlock, Block } from '../types';

interface Props {
  blockId: string;
  unitTitle: string;
  verticalBlocks: XBlock[];
}

export function UnitPageSidebar({
  blockId, unitTitle, verticalBlocks,
}: Props) {
  const { sendMessageToIframe } = useIframe();
  const contentList = {
    title: '',
    blocks: React.useMemo(
      () => {
        const blocks = castToBlock(verticalBlocks) as Block[];
        return blocks.filter(block => (block.type === 'problem') || (block.type === 'video'));
      },
      [verticalBlocks],
    ),
  };

  return (
    <AspectsSidebar
      title={unitTitle}
      blockType={BlockTypes.vertical}
      dashboardId={blockId}
      contentLists={[contentList]}
      blockActivatedCallback={(block: Block) => sendMessageToIframe('scrollToXBlock', { locator: block.id })}
    />
  );
}
