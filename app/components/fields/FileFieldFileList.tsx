import React, {useCallback, useState} from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {SortableItem} from './SortableItem.client';
import { IconCircleX, IconX } from "@tabler/icons-react"

import _ from 'lodash';
import { useFormContext } from 'react-hook-form';

export default function FileFieldFileList({ list, field }) {
    const { register, setValue, resetField } = useFormContext()
    const [activeId, setActiveId] = useState();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
    }, []);

    const handleDragEnd= (event)=> {
        const {active, over} = event;
        if (active.id !== over.id) {
            const oldIndex = field.value.findIndex(item => item.id === active.id);
            const newIndex = field.value.findIndex(item => item.id === over.id);
            const newValue= arrayMove(field.value, oldIndex, newIndex);
            console.log(oldIndex, newIndex, field.value, newValue)
            setValue(field.name, newValue, { shouldValidate: true })
            // field.onChange(newValue)
        }
    }
    const handleRemove= (id)=> (e)=> {
        e.preventDefault();
        e.stopPropagation()
        
        const newValue= field.value.filter(f=> f.id != id)
        console.log(id, newValue)
        setValue(field.name, newValue, { shouldValidate: true })
        // field.onChange(newValue)
    }

    const handleRemoveAll = (e)=> {
        setValue(field.name, [], { shouldValidate: true })
        // resetField(field.name)
    }
    if( field?.value?.length == 0 ) return null
    return (
        <div className=''>
            <button 
                onClick={handleRemoveAll}
                className="btn btn-error"
            >지우기</button>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={field.value.map(item => item.id)}
                    strategy={rectSortingStrategy}
                >
                    <ul className="text-sm text-gray-600 mt-2 flex flex-wrap gap-1.5">
                    {
                        Array.from(field.value as any).map((f:any, id) => (
                            <SortableItem key={f.id} id={f.id} >
            
                                <div className="w-20 p-1 border relative cursor-grab">
                                    <div
                                        onClick={handleRemove(f.id)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        className="absolute top-[-12px] left-[-12px] cursor-pointer">
                                        <IconCircleX stroke={1} className='fill-white'/>
                                    </div>
                                    <div>
                                        <img
                                            key={id}
                                            src={URL.createObjectURL(f.file)}
                                            alt={`preview-${id}`}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="line-clamp-2">
                                        <p className="text-2xs">{f.file.name}</p>
                                    </div>
            
                                </div>
                            </SortableItem>
                        ))
                    }
                    </ul>
                </SortableContext>
                {/* <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
                    {activeId ? <div className="">{activeId}</div> : null}
                </DragOverlay> */}
            </DndContext>
        </div>
    );
  
  
}