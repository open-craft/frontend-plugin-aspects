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
};
export type BlockMap = {
  [blockId: UsageId]: Block;
};
export type BlockResponse = {
  blocks: BlockMap;
  root: UsageId;
};

/**
 * Converts multiple types of context blocks into a consistent type
 * that can be used across the components.
 *
 * @param items - Various kinds of blocks received from API and Props
 * @return Block[]
 */
export function castToBlock(items: SubSection | SubSection[] | Unit | XBlock[]): Block[] | Block {
  if (!Array.isArray(items)) {
    return { ...items, type: items.category };
  }

  const blocks: Block[] = [];
  for (const item of items) {
    if ('category' in item) {
      blocks.push({ ...item, type: item.category });
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
