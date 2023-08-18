import { memo } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from 'hooks/useStore';

import MarkerComponent from './MarkerComponent';

import { getEdgePositions, getHandle, getNodeData } from './utils';

import { Edge } from 'components/Edges/type';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { Position } from 'types';
import { EdgeTypesWrapped } from './type';

import './style.css';

type GraphViewEdgeProps = Pick<ReactDiagramState, 'rfId'>;

type EdgeRendererProps = GraphViewEdgeProps & {
   edgeTypes: EdgeTypesWrapped;
};

const selector = (s: ReactDiagramState) => ({
   edges: s.edges,
   width: s.width,
   height: s.height,
   nodeInternals: s.nodeInternals,
   onError: s.onError,
});

function EdgeRenderer({ rfId, edgeTypes }: EdgeRendererProps) {
   const { edges, width, height, nodeInternals } = useStore(selector, shallow);

   return (
      <svg
         width={width || '100vw'}
         height={height || '100vh'}
         className="react-diagram__edges react-diagram__container"
      >
         <MarkerComponent defaultColor="#000000" rfId={rfId} />
         <g>
            {edges.map((edge: Edge) => {
               const {
                  data,
                  type,
                  // elProps
                  id,
                  className,
                  style,
                  ariaLabel,

                  // sourceAndTargetIds
                  source,
                  sourceHandle,
                  target,
                  targetHandle,

                  // marker
                  markerEnd,
                  markerStart,

                  // labelProps
                  label,
                  labelStyle,
                  labelShowBg,
                  labelBgStyle,
                  labelBgPadding,
                  labelBgBorderRadius,
               } = edge;

               const [sourceNodeRect, sourceHandleBounds, sourceIsValid] =
                  getNodeData(nodeInternals.get(source));
               const [targetNodeRect, targetHandleBounds, targetIsValid] =
                  getNodeData(nodeInternals.get(target));

               if (!sourceIsValid || !targetIsValid) {
                  return null;
               }

               let edgeType = type || 'step';

               const EdgeComponent = edgeTypes[edgeType] || edgeTypes.default;
               const targetNodeHandles = targetHandleBounds!.target;
               const sourceHandleInfo = getHandle(
                  sourceHandleBounds!.source!,
                  sourceHandle,
               );
               const targetHandleInfo = getHandle(
                  targetNodeHandles!,
                  targetHandle,
               );
               const sourcePosition =
                  sourceHandleInfo?.position || Position.Bottom;
               const targetPosition =
                  targetHandleInfo?.position || Position.Top;
               const isFocusable = !!edge.focusable;

               if (!sourceHandleInfo || !targetHandleInfo) {
                  return null;
               }

               const elProps = {
                  key: id,
                  id,
                  className,
                  style,
                  ariaLabel,
               };

               const sourceAndTargetIds = {
                  source,
                  sourceHandle,
                  target,
                  targetHandle,
               };

               const marker = {
                  markerEnd,
                  markerStart,
               };

               const labelProps = {
                  label,
                  labelStyle,
                  labelShowBg,
                  labelBgStyle,
                  labelBgPadding,
                  labelBgBorderRadius,
               };

               const edgePositions = getEdgePositions(
                  sourceNodeRect,
                  sourceHandleInfo,
                  sourcePosition,
                  targetNodeRect,
                  targetHandleInfo,
                  targetPosition,
               );

               const position = {
                  ...edgePositions,
                  sourcePosition,
                  targetPosition,
               };

               return (
                  <EdgeComponent
                     {...elProps}
                     {...sourceAndTargetIds}
                     {...marker}
                     {...labelProps}
                     {...position}
                     rfId={rfId}
                     type={edgeType}
                     data={data}
                     isFocusable={isFocusable}
                  />
               );
            })}
         </g>
      </svg>
   );
}

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
