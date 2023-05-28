import { memo } from 'react';

import BaseEdge from './BaseEdge';
import { getEdgeCenter } from './utils';
import { Position } from '../../types';
import type { StepEdgeProps, XYPosition } from '../../types';

export interface GetStepPathParams {
   sourceX: number;
   sourceY: number;
   sourcePosition?: Position;
   targetX: number;
   targetY: number;
   targetPosition?: Position;
   borderRadius?: number;
   centerX?: number;
   centerY?: number;
   offset?: number;
}

const HANDLE_DIRECTIONS = {
   [Position.Left]: { x: -1, y: 0 },
   [Position.Right]: { x: 1, y: 0 },
   [Position.Top]: { x: 0, y: -1 },
   [Position.Bottom]: { x: 0, y: 1 },
};

const getDirection = ({
   source,
   sourcePosition = Position.Bottom,
   target,
}: {
   source: XYPosition;
   sourcePosition: Position;
   target: XYPosition;
}): XYPosition => {
   if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
      // when source Node position is on the left side of a Port of target Node => x = 1
      return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
   }
   //when source Node position is above of a Port of target Node => y = 1
   return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};

const distance = (a: XYPosition, b: XYPosition) =>
   Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

function getPoints({
   source,
   sourcePosition = Position.Bottom,
   target,
   targetPosition = Position.Top,
   center,
   offset,
}: {
   source: XYPosition;
   sourcePosition: Position;
   target: XYPosition;
   targetPosition: Position;
   center: Partial<XYPosition>;
   offset: number;
}): [XYPosition[], number, number] {
   const sourceDir = HANDLE_DIRECTIONS[sourcePosition];
   const targetDir = HANDLE_DIRECTIONS[targetPosition];
   const sourceGapped: XYPosition = {
      x: source.x + sourceDir.x * offset,
      y: source.y + sourceDir.y * offset,
   };
   const targetGapped: XYPosition = {
      x: target.x + targetDir.x * offset,
      y: target.y + targetDir.y * offset,
   };
   const direction = getDirection({
      source: sourceGapped,
      sourcePosition,
      target: targetGapped,
   });
   const dirAccessor = direction.x !== 0 ? 'x' : 'y';
   const currentDirection = direction[dirAccessor];

   let points: XYPosition[] = [];
   let centerX, centerY;
   const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] =
      getEdgeCenter({
         sourceX: source.x,
         sourceY: source.y,
         targetX: target.x,
         targetY: target.y,
      });

   // going from the bottom of a node to the top of a node
   // source Port position is bottom, target Port positions is top
   const isBottomToTop = sourceDir[dirAccessor] * targetDir[dirAccessor] === -1;
   if (isBottomToTop) {
      centerX = center.x || defaultCenterX;
      centerY = center.y || defaultCenterY;
      //    --->
      //    |
      // >---
      const verticalSplit: XYPosition[] = [
         { x: centerX, y: sourceGapped.y },
         { x: centerX, y: targetGapped.y },
      ];
      //    |
      //  ---
      //  |
      const horizontalSplit: XYPosition[] = [
         { x: sourceGapped.x, y: centerY },
         { x: targetGapped.x, y: centerY },
      ];

      if (sourceDir[dirAccessor] === currentDirection) {
         // when target Port position is above source Port position
         points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
      } else {
         // when source Port position is above target Port position
         points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
      }
   }

   const pathPoints = [source, sourceGapped, ...points, targetGapped, target];

   return [
      pathPoints,
      //  centerX,
      //   centerY,
      defaultOffsetX,
      defaultOffsetY,
   ];
}

function getBend(
   a: XYPosition,
   b: XYPosition,
   c: XYPosition,
   size: number,
): string {
   const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
   const { x, y } = b;

   // no bend
   if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
      return `L${x} ${y}`;
   }

   // first segment is horizontal
   if (a.y === y) {
      const xDir = a.x < c.x ? -1 : 1;
      const yDir = a.y < c.y ? 1 : -1;
      return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${
         y + bendSize * yDir
      }`;
   }

   const xDir = a.x < c.x ? 1 : -1;
   const yDir = a.y < c.y ? -1 : 1;
   return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${
      x + bendSize * xDir
   },${y}`;
}

export function getStepPath({
   sourceX,
   sourceY,
   sourcePosition = Position.Bottom,
   targetX,
   targetY,
   targetPosition = Position.Top,
   borderRadius = 5,
   centerX,
   centerY,
   offset = 20,
}: GetStepPathParams): [path: string, offsetX: number, offsetY: number] {
   const [points, offsetX, offsetY] = getPoints({
      source: { x: sourceX, y: sourceY },
      sourcePosition,
      target: { x: targetX, y: targetY },
      targetPosition,
      center: { x: centerX, y: centerY },
      offset,
   });

   const path = points.reduce<string>((res, p, i) => {
      let segment = '';

      if (i > 0 && i < points.length - 1) {
         segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
      } else {
         segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
      }

      res += segment;

      return res;
   }, '');

   return [path, offsetX, offsetY];
}

const StepEdge = memo(
   ({
      sourceX,
      sourceY,
      targetX,
      targetY,

      style,
      sourcePosition = Position.Bottom,
      targetPosition = Position.Top,
      markerEnd,
      markerStart,
      pathOptions,
   }: StepEdgeProps) => {
      const [path] = getStepPath({
         sourceX,
         sourceY,
         sourcePosition,
         targetX,
         targetY,
         targetPosition,
         borderRadius: pathOptions?.borderRadius,
         offset: pathOptions?.offset,
      });

      return (
         <BaseEdge
            path={path}
            style={style}
            markerEnd={markerEnd}
            markerStart={markerStart}
         />
      );
   },
);

StepEdge.displayName = 'StepEdge';

export default StepEdge;