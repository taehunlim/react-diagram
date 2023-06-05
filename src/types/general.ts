import { ComponentType, MemoExoticComponent } from 'react';

import { NodeChange, EdgeChange } from '.';

import { WrapEdgeProps, EdgeProps } from 'components/Edges/type';

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;

export type OnError = (id: string, message: string) => void;

export type GridStep = [number, number];

export type Viewport = {
   x: number;
   y: number;
   zoom: number;
};

export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>>;
};
