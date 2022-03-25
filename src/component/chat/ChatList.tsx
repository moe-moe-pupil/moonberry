import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import { DropResult } from 'react-beautiful-dnd';
import ChatDraggableList from './ChatDraggableList';
import { Item } from './ChatListItem';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import Root from '@/stores/RootStore';
import ModalList from './modal/ModalList';
import { useEffect, useState } from 'react';

const ChatList:React.FC = () => {
  const {RootStore}:Record<string, Root> = useStores();
  const [clRefresh, setClRefresh] = useState(0)
  useEffect(() => {
    setClRefresh(clRefresh + 1)
  }, [RootStore.chatlistFresh])
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    RootStore.swapChatListItem(source.index, destination.index);
  };
  
  return (
        <>
          <ModalList />
          <ChatDraggableList items={RootStore.groups[RootStore.currentGroup].currentChatList} onDragEnd={onDragEnd} />
        </>
  );
};
export default (observer(ChatList));
