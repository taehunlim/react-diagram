import type { HTMLAttributes } from 'react';

import type {
   NodeTypes,
   CoordinateExtent,
   OnNodesChange,
   OnEdgesChange,
   GridStep,
   Viewport,
} from '.';
import {
   Node,
   NodeOrigin,
   NodeMouseHandler,
   NodeDragHandler,
} from 'components/Node/type';
import { Edge } from 'components/Edges/type';

export type ReactDiagramProps = HTMLAttributes<HTMLDivElement> & {
   onlyRenderVisibleElements?: boolean;
   disableKeyboardA11y?: boolean;

   nodeExtent?: CoordinateExtent;
   nodeOrigin?: NodeOrigin;
   gridStep?: GridStep;
   nodes?: Node[];
   defaultNodes?: Node[];
   nodeTypes?: NodeTypes;

   edges?: Edge[];

   onNodeClick?: NodeMouseHandler;
   onNodeDoubleClick?: NodeMouseHandler;
   onNodeMouseEnter?: NodeMouseHandler;
   onNodeMouseMove?: NodeMouseHandler;
   onNodeMouseLeave?: NodeMouseHandler;
   onNodeContextMenu?: NodeMouseHandler;
   onNodesChange?: OnNodesChange;
   onNodeDragStart?: NodeDragHandler;
   onNodeDrag?: NodeDragHandler;

   onEdgesChange?: OnEdgesChange;

   selectNodesOnDrag?: boolean;

   minZoom?: number;
   maxZoom?: number;
   defaultViewport?: Viewport;
   translateExtent?: CoordinateExtent;
};

export type ReactDiagramRefType = HTMLDivElement;
