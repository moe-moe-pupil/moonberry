import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography, Slider, Badge, Avatar, Popover, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import Root, { ModalType } from '@/stores/RootStore';
import { statusModal } from '../../stores/GroupStore'
import Pc from '@/stores/PcStore';

const { Paragraph } = Typography;


export type Item = {
  Id: number;
  nickName: string;
  lastWords: string;
  notReadCount: number;
};


const useStyles = makeStyles({
  draggingListItem: {
    background: 'rgb(235,235,235)'
  }
});

export type DraggableListItemProps = {
  item: Item;
  index: number;
};


const ChatListItem = ({ item, index }: DraggableListItemProps) => {
  const { RootStore }: Record<string, Root> = useStores();
  const classes = useStyles();
  const [nowChoose] = useState(RootStore.CurrentChatTo);
  const [visible, setVisible] = useState();
  const [vis, setVis] = useState(false);
  const [itemRefresh] = useState(item.lastWords)
  const nowPc = RootStore.getPcByQQNumber(item.Id);
  function handleClick() {
    const Modal: statusModal = {
      Id: item.Id,
      visible: true,
      bounds: {
        x: 0,
        y: 0,
      },
      size: {
        width: 520,
        height: 520
      }
    }
    RootStore.modalAdd(Modal, ModalType.pc);
  }
  function handleClickDel() {
    setVis(true);
  }
  function handleDel() {
    RootStore.modalDel(item.Id);
    setVis(false);
  }
  const content = (
    <div>
      <Button type="link" onClick={handleClick}>
        属性框
      </Button><br />
      <Button type="link" danger onClick={(e) => {
        if (nowPc) {
          RootStore.ezCreatePc(nowPc)
        }
      }
      }>
        创建此Pc
      </Button>
      <Button type="text" danger onClick={handleClickDel}>
        删除
      </Button>
      <Modal
        title="你在进行一个危险的操作"
        visible={vis}
        onOk={handleDel}
        onCancel={() => { setVis(false) }}
        okText="确认"
        cancelText="取消"
      >
        <p>删除会同时清空目标的所有数据(聊天消息、角色数据...)</p>
      </Modal>
    </div>
  );
  const mainContent = (
    <div>
      {RootStore.currentWorld.map((map, idx) => {
        return (
          <div>
            <Button type="link" onClick={(e) => RootStore.setModalVisible(map.Id, true)}>
              {map.world.name}
            </Button>
            <Button type="text" danger onClick={(e) => RootStore.worldDel(map.Id)}>
              删除此世界
            </Button>
          </div>
        )
      })}
    </div>
  )
  return (
    <Draggable draggableId={item.Id.toString()} index={index}>
      {(provided, snapshot) => (
        <Popover content={item.Id == 0 ? mainContent : content} title="详情" trigger="contextMenu" placement="right" >
          <ListItem
            onClick={(e) => {
              RootStore.setCurrentChatTo(item.Id)
            }}

            onDoubleClick={(e) => {
              handleClick();
            }}


            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging || RootStore.isCurrentChatTo(item.Id) ? classes.draggingListItem : ''}
          >
            <ListItemAvatar>
              <span className="avatar-item">
                <Badge count={item.notReadCount}>
                  <Avatar size={40}>
                    {item.nickName.slice(0, 1)}
                  </Avatar>
                </Badge>
              </span>
            </ListItemAvatar>
            <ListItemText primary={item.nickName}
              secondary={
                <Paragraph
                  ellipsis={{
                    rows: 2,
                    expandable: false,
                  }}
                >
                  {item.lastWords}
                </Paragraph>}
            />
            <Badge.Ribbon text={nowPc ? nowPc.turn : ''} color={nowPc ? nowPc.turn < RootStore.averPcTurn ? 'volcano' : 'blue' : 'blue'} />
          </ListItem>
        </Popover>
      )}
    </Draggable>
  );
};

export default (observer(ChatListItem));


