import type { HTMLAttributes, MouseEvent as ReactMouseEvent } from 'react';

import {
   CoordinateExtent,
   EdgeTypes,
   GridStep,
   Viewport,
   Node,
   NodeOrigin,
   NodeMouseHandler,
   NodeDragHandler,
   NodeTypes,
   Edge,
   OnNodesChange,
   OnEdgesChange,
   OnConnect,
   OnConnectStart,
   OnConnectEnd,
   OnEdgeUpdateFunc,
   PortType,
   OnMove,
   EdgeMouseHandler,
   OnError,
} from '.';

export type ReactDiagramProps = HTMLAttributes<HTMLDivElement> & {
   onlyRenderVisibleElements?: boolean;
   disableKeyboardA11y?: boolean;

   nodeExtent?: CoordinateExtent;
   nodeOrigin?: NodeOrigin;
   gridStep?: GridStep;

   elevateNodesOnSelect?: boolean;

   nodes?: Node[];
   nodeTypes?: NodeTypes;

   edges?: Edge[];
   edgeTypes?: EdgeTypes;

   onNodesChange?: OnNodesChange;
   onNodeClick?: NodeMouseHandler;
   onNodeDoubleClick?: NodeMouseHandler;
   onNodeContextMenu?: NodeMouseHandler;
   onNodeMouseEnter?: NodeMouseHandler;
   onNodeMouseMove?: NodeMouseHandler;
   onNodeMouseLeave?: NodeMouseHandler;
   onNodeDragStart?: NodeDragHandler;
   onNodeDrag?: NodeDragHandler;
   onNodeDragEnd?: NodeDragHandler;

   onEdgesChange?: OnEdgesChange;
   onEdgeClick?: (event: ReactMouseEvent, node: Edge) => void;
   onEdgeDoubleClick?: EdgeMouseHandler;
   onEdgeContextMenu?: EdgeMouseHandler;
   onEdgeMouseEnter?: EdgeMouseHandler;
   onEdgeMouseMove?: EdgeMouseHandler;
   onEdgeMouseLeave?: EdgeMouseHandler;

   onEdgeUpdate?: OnEdgeUpdateFunc;
   onEdgeUpdateStart?: (
      event: ReactMouseEvent,
      edge: Edge,
      portType: PortType,
   ) => void;
   onEdgeUpdateEnd?: (
      event: MouseEvent | TouchEvent,
      edge: Edge,
      portType: PortType,
   ) => void;

   onConnect?: OnConnect;
   onConnectStart?: OnConnectStart;
   onConnectEnd?: OnConnectEnd;

   onMove?: OnMove;
   onMoveStart?: OnMove;
   onMoveEnd?: OnMove;

   onError?: OnError;

   minZoom?: number;
   maxZoom?: number;
   defaultViewport?: Viewport;
   translateExtent?: CoordinateExtent;

   nodesDraggable?: boolean;
   noDragClassName?: string;
   noPanClassName?: string;
   panning?: boolean;
   autoPanOnNodeDrag?: boolean;
   autoPanOnConnect?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;