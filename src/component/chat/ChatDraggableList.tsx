import * as React from 'react';
import ChatListItem from './ChatListItem';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder
} from 'react-beautiful-dnd';
import { Item } from './ChatListItem';
import styled from 'styled-components';
const ProDrag = styled.div `
`

export type DraggableListProps = {
  items: Item[];
  onDragEnd: OnDragEndResponder;
};

const test:Item[] = []
for(var i = 0 ; i < 100; i++) {
  var newTest:Item = {
    Id: i,
    nickName: '13',
    lastWords: '13414',
    notReadCount: 0
  }
  test.push(newTest)
}

// {items?items.map((item, index) => (
//   <ChatListItem item={item} index={index} key={item.qqNumber.toString()} />
// )):'聊天列表未生成'}
const DraggableList = React.memo(({ items, onDragEnd }: DraggableListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <Droppable droppableId="droppable-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items?items.map((item, index) => (
              <ChatListItem item={item} index={index} key={item.Id.toString()} />
            )):'聊天列表未生成'}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default DraggableList;
