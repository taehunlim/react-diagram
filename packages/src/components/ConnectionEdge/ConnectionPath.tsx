import { CSSProperties, useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

import { getStepPath } from '../../components/Edges/StepEdge';
import { getBezierPath } from '../Edges/BezierEdge';

import { internalsSymbol } from '../../utils';

import { Position } from '../../types';
import { ReactDiagramStore } from '../ReactDiagramProvider/type';

import { PortType } from '../Port/type';
import { ConnectionEdgeComponent, ConnectionEdgeType } from './type';

type ConnectionPathProps = {
   style?: CSSProperties;
   nodeId: string;
   portType: PortType;
   type?: ConnectionEdgeType;
   Component?: ConnectionEdgeComponent;
};

const oppositePosition = {
   [Position.Left]: Position.Right,
   [Position.Right]: Position.Left,
   [Position.Top]: Position.Bottom,
   [Position.Bottom]: Position.Top,
};

function ConnectionPath({
   style,
   nodeId,
   portType,
   type = ConnectionEdgeType.Straight,
   Component,
}: ConnectionPathProps) {
   const { fromNode, toX, toY } = useStore(
      useCallback(
         (s: ReactDiagramStore) => ({
            fromNode: s.nodeInternals.get(nodeId),

            toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
            toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
         }),
         [nodeId],
      ),
      shallow,
   );
   const fromPortBounds = fromNode?.[internalsSymbol]?.portBounds;

   const portBounds = fromPortBounds?.[portType];

   if (!fromNode || !portBounds) {
      return null;
   }

   const fromPort = portBounds[0];
   const fromPortX = fromPort
      ? fromPort.x + fromPort.width / 2
      : (fromNode.width ?? 0) / 2;
   const fromPortY = fromPort
      ? fromPort.y + fromPort.height / 2
      : fromNode.height ?? 0;
   const fromX = (fromNode.positionAbsolute?.x ?? 0) + fromPortX;
   const fromY = (fromNode.positionAbsolute?.y ?? 0) + fromPortY;
   const fromPosition = fromPort?.position;
   const toPosition = fromPosition ? oppositePosition[fromPosition] : null;

   if (!fromPosition || !toPosition) {
      return null;
   }

   if (Component) {
      return (
         <Component
            connectionEdgeType={type}
            connectionEdgeStyle={style}
            fromNode={fromNode}
            fromPort={fromPort}
            fromX={fromX}
            fromY={fromY}
            toX={toX}
            toY={toY}
            fromPosition={fromPosition}
            toPosition={toPosition}
         />
      );
   }

   let d = '';

   const pathParams = {
      sourceX: fromX,
      sourceY: fromY,
      sourcePosition: fromPosition,
      targetX: toX,
      targetY: toY,
      targetPosition: toPosition,
   };

   if (type === ConnectionEdgeType.Bezier) {
      [d] = getBezierPath(pathParams);
   } else if (type === ConnectionEdgeType.Step) {
      [d] = getStepPath({
         ...pathParams,
         borderRadius: 0,
      });
   } else {
      d = `M${fromX},${fromY} ${toX},${toY}`;
   }

   return (
      <path
         d={d}
         fill="none"
         className="react-diagram__connection-path"
         style={style}
      />
   );
}

ConnectionPath.displayName = 'ConnectionPath';

export default ConnectionPath;
