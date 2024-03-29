import { internalsSymbol, isNumeric } from '../utils';

import { getNodePositionWithOrigin } from '../utils/graph';

import { XYZPosition } from '../types';
import { NodeInternals } from './type';
import { Node } from '../components/Node/type';
import { NodeOrigin } from '../components/Node/utils';

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(
   node: Node,
   nodeInternals: NodeInternals,
   result: XYZPosition,
   nodeOrigin: NodeOrigin,
): XYZPosition {
   if (!node.parentNode) {
      return result;
   }
   const parentNode = nodeInternals.get(node.parentNode)!;
   const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);

   return calculateXYZPosition(
      parentNode,
      nodeInternals,
      {
         x: (result.x ?? 0) + parentNodePosition.x,
         y: (result.y ?? 0) + parentNodePosition.y,
         z:
            (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0)
               ? parentNode[internalsSymbol]?.z ?? 0
               : result.z ?? 0,
      },
      nodeOrigin,
   );
}

export function updateAbsoluteNodePositions(
   nodeInternals: NodeInternals,
   nodeOrigin: NodeOrigin,
   parentNodes?: ParentNodes,
) {
   nodeInternals.forEach((node) => {
      if (node.parentNode && !nodeInternals.has(node.parentNode)) {
         throw new Error(`Parent node ${node.parentNode} not found`);
      }

      if (node.parentNode || parentNodes?.[node.id]) {
         const { x, y, z } = calculateXYZPosition(
            node,
            nodeInternals,
            {
               ...node.position,
               z: node[internalsSymbol]?.z ?? 0,
            },
            nodeOrigin,
         );

         node.positionAbsolute = {
            x,
            y,
         };

         node[internalsSymbol]!.z = z;
         if (parentNodes?.[node.id]) {
            node[internalsSymbol]!.isParent = true;
         }
      }
   });
}

export function createNodeInternals(
   nodes: Node[],
   nodeInternals: NodeInternals,
   nodeOrigin: NodeOrigin,
   elevateNodesOnSelect: boolean,
): NodeInternals {
   const nextNodeInternals = new Map<string, Node>();
   const parentNodes: ParentNodes = {};
   const selectedNodeZ: number = elevateNodesOnSelect ? 1000 : 0;

   nodes.forEach((node) => {
      const z =
         (isNumeric(node.zIndex) ? node.zIndex : 0) +
         (node.selected ? selectedNodeZ : 0);
      const currInternals = nodeInternals.get(node.id);

      const internals: Node = {
         width: currInternals?.width,
         height: currInternals?.height,
         ...node,
         positionAbsolute: {
            x: node.position.x,
            y: node.position.y,
         },
      };

      if (node.parentNode) {
         internals.parentNode = node.parentNode;
         parentNodes[node.parentNode] = true;
      }

      Object.defineProperty(internals, internalsSymbol, {
         enumerable: false,
         value: {
            portBounds: currInternals?.[internalsSymbol]?.portBounds,
            z,
         },
      });

      // console.log('create', currInternals, node);
      nextNodeInternals.set(node.id, internals);
   });

   // console.log(parentNodes, nextNodeInternals);

   updateAbsoluteNodePositions(nextNodeInternals, nodeOrigin, parentNodes);

   return nextNodeInternals;
}

export const isIntersected = (
   compareNode: Node,
   nodeInternals: NodeInternals,
): boolean => {
   const { id, width, height, positionAbsolute } = compareNode;

   if (!width || !height) return false;

   let intersected = false;
   for (const [key, node] of nodeInternals) {
      // key == node.id
      if (id === key) continue;

      const {
         positionAbsolute: dPositionAbsolute,
         width: dWidth,
         height: dHeight,
      } = node;

      if (!dWidth || !dHeight) continue;

      const leftIn = dPositionAbsolute.x + dWidth >= positionAbsolute.x,
         rightIn = positionAbsolute.x + width >= dPositionAbsolute.x,
         topIn = dPositionAbsolute.y + dHeight >= positionAbsolute.y,
         bottomIn = positionAbsolute.y + height >= dPositionAbsolute.y;

      const isIn = leftIn && rightIn && topIn && bottomIn;

      if (isIn) {
         intersected = true;
         break;
      }
   }

   return intersected;
};
