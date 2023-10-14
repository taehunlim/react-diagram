import { forwardRef } from 'react';

import DiagramView from './DiagramView';
import StoreUpdater from '../../components/StoreUpdater';

import { useNodeOrEdgeTypes } from '../../hooks/useNodeOrEdgeTypes';

import Nodes from '../../components/Node';
import StepEdge from '../../components/Edges/StepEdge';

import { createNodeTypes } from '../../container/NodeRenderer/utils';
import { createEdgeTypes } from '../../container/EdgeRenderer/utils';

import Wrapper from './Wrapper';

import {
   ReactDiagramRefType,
   ReactDiagramProps,
   Viewport,
   NodeOrigin,
   NodeTypes,
   EdgeTypes,
} from '../../types';

const initViewport: Viewport = { x: 0, y: 0, zoom: 1 };
const initNodeOrigin: NodeOrigin = [0, 0];

const defaultNodeTypes: NodeTypes = {
   default: Nodes,
};

const defaultEdgeTypes: EdgeTypes = {
   step: StepEdge,
};

const ReactDiagram = forwardRef<ReactDiagramRefType, ReactDiagramProps>(
   (
      {
         id,
         // DiagramView props
         panning = true,
         minZoom,
         maxZoom,
         translateExtent,
         nodeExtent,
         defaultViewport = initViewport,

         onlyRenderVisibleElements = false,
         disableKeyboardA11y = false,
         noDragClassName = 'nodrag',
         noPanClassName = 'nopan',
         nodeOrigin = initNodeOrigin,
         nodeTypes = defaultNodeTypes,
         onNodeClick,
         onNodeDoubleClick,
         onNodeContextMenu,
         onNodeMouseEnter,
         onNodeMouseMove,
         onNodeMouseLeave,

         edgeTypes = defaultEdgeTypes,
         onEdgeClick,
         onEdgeDoubleClick,
         onEdgeContextMenu,
         onEdgeMouseEnter,
         onEdgeMouseMove,
         onEdgeMouseLeave,
         onEdgeUpdate,
         onEdgeUpdateStart,
         onEdgeUpdateEnd,

         onMove,
         onMoveStart,
         onMoveEnd,

         // StoreUpdater props
         nodes,
         edges,
         nodesDraggable,
         elevateNodesOnSelect,
         autoPanOnNodeDrag,
         autoPanOnConnect,
         onNodesChange,
         onNodeDrag,
         onNodeDragStart,
         onNodeDragEnd,

         onEdgesChange,

         onConnect,
         onConnectStart,
         onConnectEnd,

         onError,
      },
      ref,
   ) => {
      const rfId = id || '1';
      const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
      const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);

      return (
         <div ref={ref} className="react-diagram">
            <Wrapper>
               <DiagramView
                  rfId={rfId}
                  panning={panning}
                  defaultViewport={defaultViewport}
                  onlyRenderVisibleElements={onlyRenderVisibleElements}
                  disableKeyboardA11y={disableKeyboardA11y}
                  noDragClassName={noDragClassName}
                  noPanClassName={noPanClassName}
                  nodeOrigin={nodeOrigin}
                  nodeTypes={nodeTypesWrapped}
                  edgeTypes={edgeTypesWrapped}
                  onNodeClick={onNodeClick}
                  onNodeDoubleClick={onNodeDoubleClick}
                  onNodeContextMenu={onNodeContextMenu}
                  onNodeMouseEnter={onNodeMouseEnter}
                  onNodeMouseMove={onNodeMouseMove}
                  onNodeMouseLeave={onNodeMouseLeave}
                  onEdgeClick={onEdgeClick}
                  onEdgeDoubleClick={onEdgeDoubleClick}
                  onEdgeContextMenu={onEdgeContextMenu}
                  onEdgeMouseEnter={onEdgeMouseEnter}
                  onEdgeMouseMove={onEdgeMouseMove}
                  onEdgeMouseLeave={onEdgeMouseLeave}
                  onEdgeUpdate={onEdgeUpdate}
                  onEdgeUpdateStart={onEdgeUpdateStart}
                  onEdgeUpdateEnd={onEdgeUpdateEnd}
                  onMove={onMove}
                  onMoveStart={onMoveStart}
                  onMoveEnd={onMoveEnd}
               />
               <StoreUpdater
                  rfId={rfId}
                  nodes={nodes}
                  edges={edges}
                  nodesDraggable={nodesDraggable}
                  elevateNodesOnSelect={elevateNodesOnSelect}
                  autoPanOnNodeDrag={autoPanOnNodeDrag}
                  autoPanOnConnect={autoPanOnConnect}
                  nodeExtent={nodeExtent}
                  translateExtent={translateExtent}
                  minZoom={minZoom}
                  maxZoom={maxZoom}
                  onNodesChange={onNodesChange}
                  onNodeDrag={onNodeDrag}
                  onNodeDragStart={onNodeDragStart}
                  onNodeDragEnd={onNodeDragEnd}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onConnectStart={onConnectStart}
                  onConnectEnd={onConnectEnd}
                  onError={onError}
               />
            </Wrapper>
         </div>
      );
   },
);

export default ReactDiagram;