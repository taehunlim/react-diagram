import { getOverlappingArea } from 'utils';

import { XYPosition, Rect, Transform } from 'types';
import { Node, NodeOrigin, NodeInternals } from 'components/Node/type';
import { EdgeMarkerType } from 'components/Edges/type';

export const getNodePositionWithOrigin = (
   node: Node | undefined,
   nodeOrigin: NodeOrigin = [0, 0],
): XYPosition & { positionAbsolute: XYPosition } => {
   if (!node) {
      return {
         x: 0,
         y: 0,
         positionAbsolute: {
            x: 0,
            y: 0,
         },
      };
   }

   const offsetX = (node.width ?? 0) * nodeOrigin[0];
   const offsetY = (node.height ?? 0) * nodeOrigin[1];

   const position: XYPosition = {
      x: node.position.x - offsetX,
      y: node.position.y - offsetY,
   };

   return {
      ...position,
      positionAbsolute: node.positionAbsolute
         ? {
              x: node.positionAbsolute.x - offsetX,
              y: node.positionAbsolute.y - offsetY,
           }
         : position,
   };
};

export const getNodesInside = (
   nodeInternals: NodeInternals,
   rect: Rect,
   [tx, ty, tScale]: Transform = [0, 0, 1],
   partially = false,
   // set excludeNonSelectableNodes if you want to pay attention to the nodes "selectable" attribute
   excludeNonSelectableNodes = false,
   nodeOrigin: NodeOrigin = [0, 0],
): Node[] => {
   const paneRect = {
      x: (rect.x - tx) / tScale,
      y: (rect.y - ty) / tScale,
      width: rect.width / tScale,
      height: rect.height / tScale,
   };

   const visibleNodes: Node[] = [];

   nodeInternals.forEach((node) => {
      const { width, height, selectable = true, hidden = false } = node;

      if ((excludeNonSelectableNodes && !selectable) || hidden) {
         return false;
      }

      const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);

      const nodeRect = {
         x: positionAbsolute.x,
         y: positionAbsolute.y,
         width: width || 0,
         height: height || 0,
      };
      const overlappingArea = getOverlappingArea(paneRect, nodeRect);
      const notInitialized =
         typeof width === 'undefined' ||
         typeof height === 'undefined' ||
         width === null ||
         height === null;

      const partiallyVisible = partially && overlappingArea > 0;
      const area = (width || 0) * (height || 0);
      const isVisible =
         notInitialized || partiallyVisible || overlappingArea >= area;

      if (isVisible || node.dragging) {
         visibleNodes.push(node);
      }
   });

   return visibleNodes;
};

export const getMarkerId = (
   marker: EdgeMarkerType | undefined,
   rfId?: string,
): string => {
   if (typeof marker === 'undefined') {
      return '';
   }

   if (typeof marker === 'string') {
      return marker;
   }

   const idPrefix = rfId ? `${rfId}__` : '';

   return `${idPrefix}${Object.keys(marker)
      .sort()
      .map((key: string) => `${key}=${(marker as any)[key]}`)
      .join('&')}`;
};
