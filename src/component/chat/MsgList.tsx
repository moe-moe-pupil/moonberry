import React, { useState } from 'react'
import {ChatController, Message, MessageContent } from 'chat-ui-react'
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { makeStyles } from '@material-ui/styles';
import ChatLayout from './ChatLayout';
import ChatInput from './input/ChatInput';
import ChatSD from './ChatSD';
import styled from 'styled-components';
import Root from '@/stores/RootStore';
import useDebounce from 'react-debounced';
import { Virtuoso } from 'react-virtuoso';
import { MuiChat } from '@/mui/MuiChat';

const ProDiv = styled.div`
  .ant-modal-wrap{
    pointer-events: none;
  }
`


const useStyles = makeStyles({
  root: {
    height: '100%',
    backgroundColor: 'gray',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '814px',
    maxWidth: '100%',
    maxHeight: '800px',
    paddingTop: '8px',
    paddingRight: '8px',
    paddingLeft: '8px',
  },
  chat: {
    flex: '1 1 0%',
    minHeight: 0,
  },
});

const MsgList: React.FC = (props) => {
  const { RootStore }: Record<string, Root> = useStores();
  const [chatCtl] = React.useState(new ChatController());
  const classes = useStyles();
  const debounce = useDebounce(100);
  const [newMsg] = useState(RootStore.getAllMsgByQQNumber(0));
  const customInput = chatCtl.setActionRequest({
    type: 'custom',
    Component: ChatInput,
  });

  React.useMemo(async () => {
    //chatCtl.setMessages( RootStore.allMsgByQQNumber(RootStore.CurrentChatTo) );
    chatCtl.clearMessages();
  }, [RootStore.CurrentChatTo]);

  React.useMemo(async () => {
    if (chatCtl.getMessages().length == 0) {
      chatCtl.setMessages(RootStore.getAllMsgByQQNumber(RootStore.CurrentChatTo))
    } else {
      debounce(() => {
        const ctlLength = chatCtl.getMessages().length;
        const msgLength = RootStore.getAllMsgByQQNumber(RootStore.CurrentChatTo).length;
        const msg = RootStore.getAllMsgByQQNumber(RootStore.CurrentChatTo);
        for (var i = msgLength - ctlLength; i > 0; i--) {
          const item: Message<MessageContent> = msg[msgLength - i];
          chatCtl.addMessage({
            type: item.type,
            content: item.content,
            self: item.self,
            createdAt: item.createdAt,
            username: item.username,
            avatar: item.username,
          });
        }
      })
    }
  }, [RootStore.getAllMsgByQQNumber(RootStore.CurrentChatTo)]);
  // Only one component used for display
  return (
    <>
      <ProDiv>
        <ChatLayout>
          <ChatSD />
          <div className={classes.container}>
            < MuiChat chatController={chatCtl} />
          </div>
        </ChatLayout>
      </ProDiv>
    </>
  )

}

export default (observer(MsgList))