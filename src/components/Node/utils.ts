import { MouseEvent, RefObject } from 'react';
import { StoreApi } from 'zustand';

import { getDimensions } from 'utils';

import { PortElement, Position } from 'types';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { Node, NodeOrigin } from './type';

export const getPortBounds = (
   selector: string,
   nodeElement: HTMLDivElement,
   zoom: number,
   nodeOrigin: NodeOrigin,
): PortElement[] | null => {
   const ports = nodeElement.querySelectorAll(selector);

   if (!ports || !ports.length) {
      return null;
   }

   const portsArray = Array.from(ports) as HTMLDivElement[];
   const nodeBounds = nodeElement.getBoundingClientRect();
   const nodeOffset = {
      x: nodeBounds.width * nodeOrigin[0],
      y: nodeBounds.height * nodeOrigin[1],
   };

   return portsArray.map((port): PortElement => {
      const portBounds = port.getBoundingClientRect();

      return {
         id: port.getAttribute('data-portid'),
         position: port.getAttribute('data-portpos') as unknown as Position,
         x: (portBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
         y: (portBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
         ...getDimensions(port),
      };
   });
};

export function getMouseHandler(
   id: string,
   getState: StoreApi<ReactDiagramState>['getState'],
   handler?: (event: MouseEvent, node: Node) => void,
) {
   return handler === undefined
      ? handler
      : (event: MouseEvent) => {
           const node = getState().nodeInternals.get(id)!;
           handler(event, { ...node });
        };
}

export function handleNodeClick({
   id,
   store,
   unselect = false,
   nodeRef,
}: {
   id: string;
   store: {
      getState: StoreApi<ReactDiagramState>['getState'];
      setState: StoreApi<ReactDiagramState>['setState'];
   };
   unselect?: boolean;
   nodeRef?: RefObject<HTMLDivElement>;
}) {
   const {
      addSelectedNodes,
      unSelectNodes,
      multiSelectionActive,
      nodeInternals,
   } = store.getState();
   const node = nodeInternals.get(id)!;

   store.setState({ nodesSelectionActive: false });

   if (!node.selected) {
      addSelectedNodes([id]);
   } else if (unselect || (node.selected && multiSelectionActive)) {
      unSelectNodes({ nodes: [node] });

      requestAnimationFrame(() => nodeRef?.current?.blur());
   }
}
