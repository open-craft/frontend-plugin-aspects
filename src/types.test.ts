import {
  castToBlock, SubSection, Block, XBlock,
} from './types';

describe('castToBlock', () => {
  it('converts subsections to blocks', () => {
    const subSections: SubSection[] = [
      {
        category: 'sequential',
        childInfo: {
          category: 'vertical',
          children: [],
          displayName: 'Units',
        },
        displayName: 'Test SubSection One',
        graded: false,
        id: 'block-v1:subsection',
      },
    ];

    const blocks: Block[] = [{
      id: 'block-v1:subsection',
      type: 'sequential',
      displayName: 'Test SubSection One',
      graded: false,
    }];

    expect(castToBlock(subSections)).toEqual(blocks);
  });

  it('converts XBlocks to blocks', () => {
    const xblocks: XBlock[] = [{
      id: 'block-v1:problem-block',
      blockType: 'problem',
      name: 'Problem Block 1',
    }];

    const blocks: Block[] = [{
      id: 'block-v1:problem-block',
      type: 'problem',
      displayName: 'Problem Block 1',
      graded: false,
    }];

    expect(castToBlock(xblocks)).toEqual(blocks);
  });
});
