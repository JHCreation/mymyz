import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <li 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
    >
      {/* <div ref={setActivatorNodeRef} {...listeners}>Drag handle</div> */}
      {props.children}  
    </li>
  );
}