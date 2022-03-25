import * as React from 'react';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { TextField } from '@mui/material';
import InputSelect from './InputSelect';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import { Tabs } from 'antd';
import { useState } from 'react';
import { chatType, messageType, miraiContent, miraiMessageChain } from '@/stores/ChatStore';
import { ActionRequest, ChatController } from 'chat-ui-react';
import Root from '@/stores/RootStore';
import { uuid } from '@/utils/uuid';
import { insertStr } from '@/utils/string';
const { TabPane } = Tabs;

const ChatInput = ({ chatController, actionRequest, }: {
  chatController: ChatController;
  actionRequest: ActionRequest;
}) => {
  const chatCtl = chatController;
  const { RootStore }: Record<string, Root> = useStores();
  RootStore.ChatCtl = chatCtl;
  const [nowPanes] = useState(RootStore.currentSendPanes);
  const newSendPanel = (idx: number) => {
    return (
      <>
        <InputSelect idx={idx} />
        <TextField
          onKeyUp={(e) => { handleKeyDown(e, idx) }}
          id="outlined-multiline-static"
          label="请在这里输入消息~"
          multiline
          fullWidth
          rows={4}
        />
      </>
    )
  }
  function callback(key: string) {
    RootStore.setActiveKey(parseInt(key));
  }
  function handleEdit(targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') {
    switch (action) {
      case 'add':
        RootStore.addCurrentSendPanes("多选发送", { targets: [] }, RootStore.geneSendPanesKey());
        break;
      case 'remove':
        RootStore.removeCurrentSendPanes(targetKey);
        break;
    }
  }

  function handleKeyDown(e: any, key?: number): void {
    if (e.keyCode === 13) {
      if (!e.ctrlKey) {
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        if (key) {
          RootStore.getCurrentSendTo(key).targets.map((tar) => {
            const nowId = parseInt(tar)
            if (typeof tar != 'string') {
              if (nowId >= 10000) {
                RootStore.ezSendText(nowId, [e.target.value.slice(0, -1)], true)
              } else {
                if (nowId == 0) {
                  RootStore.AllPcList.map((pc, index) => {
                    RootStore.ezSendText(pc.Id, ['全体消息:' + e.target.value.slice(0, -1)], index == 0)
                  })
                } else {
                  if (nowId < 10000) {
                    const nowTeams = RootStore.getTeamPcIdsByTeamId(nowId)
                    nowTeams.ids.map((id) => {
                      RootStore.ezSendText(id, [`频道【${nowTeams.name}】「主神」:"${e.target.value.slice(0, -1)}"`], true)
                    })
                  }
                }

              }
            } else {
              // tar.split('.').map(Number).map((id)=>{
              //   RootStore.ezSendText(id, [e.target.value.slice(0, -1)])
              // })
              const nowArea = RootStore.getChatAreaById(tar)
              if (nowArea) {
                nowArea.member.map((nowID) => {
                  RootStore.ezSendText(nowID, [e.target.value.slice(0, -1)])
                })
              }
            }
          })
        } else {
          if (RootStore.CurrentChatTo >= 10000) {
            RootStore.ezSendText(RootStore.CurrentChatTo, [e.target.value])
            // const msgChain: miraiMessageChain[] = [{
            //   type: messageType.Plain,
            //   id: RootStore.CurrentChatTo,
            //   text: e.target.value.slice(0, -1)
            // }]
            // RootStore.wsSendMsg("sendFriendMessage", RootStore.CurrentChatTo, msgChain);
            // const newChatMsg: miraiContent = {
            //   type: chatType.FriendMessage,
            //   sender: {
            //     id: -RootStore.CurrentChatTo,
            //   },
            //   messageChain: [{
            //     id: 123,
            //     type: messageType.Plain,
            //     text: e.target.value.slice(0, -1)
            //   }]
            // }
            // RootStore.chatAdd(newChatMsg)
            // chatCtl.addMessage({
            //   type: 'text',
            //   content: e.target.value.slice(0, -1),
            //   self: true,
            // });
          } else {
            if (RootStore.CurrentChatTo == 0) {
              RootStore.AllPcList.map((pc, index) => {
                RootStore.ezSendText(pc.Id, ['全体消息:' + e.target.value], index == 0)
              })
            } else {
              if (RootStore.CurrentChatTo < 10000) {
                const nowTeams = RootStore.getTeamPcIdsByTeamId(RootStore.CurrentChatTo)
                nowTeams.ids.map((id) => {
                  RootStore.ezSendText(id, [`频道【${nowTeams.name}】「主神」:"${e.target.value.slice(0, -1)}"`], true)
                })
              }
            }
          }
          e.target.value = "";
        }
      } else {
        e.target.value = insertStr(e.target.value, e.target.selectionStart , '\n')
      }
    }
  }

  function handleMulKeyDown(e: any, key: number): void {
    if (e.keyCode === 13) {
      if (!e.ctrlKey) {
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        RootStore.getCurrentSendTo(key).targets.map((tar) => {
          const nowId = parseInt(tar)
          if (typeof tar != 'string') {
            if (nowId >= 10000) {
              RootStore.ezSendText(nowId, [e.target.value.slice(0, -1)], true)
            } else {
              if (nowId == 0) {
                RootStore.AllPcList.map((pc, index) => {
                  RootStore.ezSendText(pc.Id, ['全体消息:' + e.target.value.slice(0, -1)], index == 0)
                })
              } else {
                if (nowId < 10000) {
                  const nowTeams = RootStore.getTeamPcIdsByTeamId(nowId)
                  nowTeams.ids.map((id) => {
                    RootStore.ezSendText(id, [`频道【${nowTeams.name}】「主神」:"${e.target.value.slice(0, -1)}"`], true)
                  })
                }
              }

            }
          } else {
            // tar.split('.').map(Number).map((id)=>{
            //   RootStore.ezSendText(id, [e.target.value.slice(0, -1)])
            // })
            const nowArea = RootStore.getChatAreaById(tar)
            if (nowArea) {
              nowArea.member.map((nowID) => {
                RootStore.ezSendText(nowID, [e.target.value.slice(0, -1)])
              })
            }
          }
        })
        console.log(RootStore.getCurrentSendTo(key).targets)
        e.target.value = "";
      } else {
        e.target.value.splice(e.target.selectionStart + 1, '\n')
      }

    }
  }
  return (
    <>
      <Tabs
        type="editable-card"
        onChange={callback}
        defaultActiveKey={RootStore.activeKey + ''}
        onEdit={handleEdit}
      >
        <TabPane tab="默认发送" key={-1} closable={false}>
          <TextField
            onKeyDown={handleKeyDown}
            id="outlined-multiline-static"
            label="请在这里输入消息~"
            multiline
            fullWidth
            rows={4}
          />
        </TabPane>
        {RootStore.currentSendPanes.map((pane) => {
          if (pane != null) {
            return (
              <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                {newSendPanel(pane.key)}
              </TabPane>
            )
          }
        })}
      </Tabs>
    </>
  );
};
export default (observer(ChatInput));



