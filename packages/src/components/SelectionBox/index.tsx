import { memo, useRef } from 'react';
import cc from 'classcat';

import { Rect } from '../../types';

function SelectionBox({ rect }: { rect: Rect }) {
   const nodeRef = useRef<HTMLDivElement>(null);

   const { width, height, x, y } = rect;

   return (
      <div
         className={cc([
            'react-diagram__selection-box',
            'react-diagram__container',
         ])}
      >
         <div
            ref={nodeRef}
            className="react-diagram__selection-box-rect"
            tabIndex={-1}
            style={{
               width,
               height,
               top: y,
               left: x,
            }}
         />
      </div>
   );
}

export default memo(SelectionBox);
