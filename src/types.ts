export type UsageId = string;

// types from the props
export type Unit = {
  category: 'vertical';
  displayName: string;
  graded: boolean;
  id: UsageId;
};
export type SubSection = {
  category: 'sequential';
  childInfo: {
    category: 'vertical';
    children?: Unit[];
    displayName: string;
  }
  displayName: string;
  graded: boolean;
  id: UsageId;
};
export type Section = {
  category: 'chapter';
  id: UsageId;
  childInfo: {
    category: 'sequential';
    displayName: string;
    children: SubSection[];
  },
  displayName: string;
  graded: boolean;
};
export type XBlock = {
  id: string;
  name: string;
  blockType: string;
};

// generic types used across this plugin
export type Block = {
  id: UsageId;
  type: string;
  displayName: string;
  graded?: boolean;
  childInfo?: any
};
export type BlockMap = {
  [blockId: UsageId]: Block;
};
export type BlockResponse = {
  blocks: BlockMap;
  root: UsageId;
};

function categoryItemToBlock(item: SubSection | Unit): Block {
  const block: Block = {
    id: item.id,
    displayName: item.displayName,
    type: item.category,
    graded: item.graded,
  };
  if ('childInfo' in item) {
    block.childInfo = item.childInfo;
  }
  return block;
}
/**
 * Converts multiple types of context blocks into a consistent type
 * that can be used across the components.
 *
 * @param items - Various kinds of blocks received from API and Props
 * @return Block[]
 */
export function castToBlock(items: SubSection | SubSection[] | Unit | XBlock[]): Block[] | Block {
  if (!Array.isArray(items)) {
    return categoryItemToBlock(items);
  }

  const blocks: Block[] = [];
  for (const item of items) {
    if ('category' in item) {
      blocks.push(categoryItemToBlock(item));
    } else if ('blockType' in item) { // XBlock
      blocks.push({
        id: item.id,
        type: item.blockType,
        displayName: item.name,
        graded: false,
      });
    }
  }
  return blocks;
}
