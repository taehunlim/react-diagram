import type {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { useStoreApi } from 'hooks/useStore';

import { PortProps } from './type';

import { isMouseEvent, handlePointerDown } from './utils';

import './style.css';

function Port({ type, position }: PortProps) {
   const store = useStoreApi();

   const onPointerDown = (
      event: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>,
   ) => {
      const isMouseTriggered = isMouseEvent(event);

      if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
         handlePointerDown({
            event,
            getState: store.getState,
         });
      }
   };

   return (
      <div
         data-port-position={position}
         className={`react-diagram__port react-diagram__port-${position} ${type} nodrag`}
         onClick={onPointerDown}
      />
   );
}

export default Port;
