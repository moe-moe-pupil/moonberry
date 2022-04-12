import { statusModal } from '@/stores/GroupStore';
import Pc from '@/stores/PcStore';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { Button, Modal, Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useState } from 'react';
import Draggable, { ControlPosition } from 'react-draggable';
import styled from 'styled-components';
import { ResizableBox } from 'react-resizable';
import { Item } from '../ChatListItem';
import { messageType, miraiMessageChain } from '@/stores/ChatStore';
import PcSkill from './PcSkill';
import PcStauts from './PcStauts';
import { Typography, Space } from 'antd';

const { Text, Link } = Typography;
const { TabPane } = Tabs;

const ControlPointSE = styled.div`
  .control-point{
    position: absolute;
    box-sizing: border-box;
    display: inline-block;
    background: #fff;
    border: 1px solid #c0c5cf;
    box-shadow: 0 0 2px 0 rgba(86, 90, 98, .2);
    border-radius: 6px;
    padding: 6px;
    margin-top: -6px !important;
    margin-left: -6px !important;
    user-select: none;   // 注意禁止鼠标选中控制点元素，不然拖拽事件可能会因此被中断
    cursor: nwse-resize;
    left: 100%;
    top: 100%;
    margin-left: 1px;
    margin-top: 1px;
    pointer-events: auto!important;
  }
`

const PcModal = ({ Id: qqNumber, visible, bounds, size }: statusModal) => {
  const draggleRef = React.createRef<HTMLDivElement>();
  const [index, setIndex] = useState<number>(-1);
  const [disabled, setDisabled] = useState(true);
  const [_size, setSize] = useState(size);
  const { RootStore }: Record<string, Root> = useStores();
  const [_bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const chatListItem: Item = RootStore.getChatListItemByQQNumber(qqNumber);
  const handleClick = (e: any) => {
    const msgChain: miraiMessageChain[] = [{
      type: messageType.Plain,
      id: qqNumber,
      text: "自动消息：请完成兑换"
    }]
    RootStore.wsSendMsg("sendFriendMessage", qqNumber, msgChain);
  }
  const nowPc = RootStore.getPcByQQNumber(qqNumber, index) as Pc;
  const pcStatus: JSX.Element = nowPc ?
    <PcStauts qqNumber={qqNumber} idx={index} />
    : <Button onClick={handleClick}>目标未兑换，点击催他兑换</Button>

  const pcSkill: JSX.Element = nowPc ?
    <PcSkill Pc={nowPc} inited={true} />
    : <Button onClick={handleClick}>目标未兑换，点击催他兑换</Button>

  const pcExchange: JSX.Element = nowPc ?
    <PcSkill Pc={nowPc} inited={false} />
    : <Button onClick={handleClick}>目标未兑换，点击催他兑换</Button>

  const handleOk = (e: any) => {
    //console.log(e);
    RootStore.setModalVisible(qqNumber, false);
  };

  const handleCancel = (e: any) => {
    //console.log(e);
    RootStore.setModalVisible(qqNumber, false);
  };

  const onResize = (event: any, { size }: any) => {
    setSize({ width: size.width, height: size.height });
    RootStore.setModalSize(qqNumber, size)
  };

  const onStart = (event: any, uiData: any) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left! + uiData?.x,
      right: clientWidth - (targetRect?.right! - uiData?.x),
      top: -targetRect?.top! + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom! - uiData?.y),

    });



  };
  const onStop = (event: any, uiData: any) => {
    const newBounds: ControlPosition = {
      x: uiData?.x,
      y: uiData?.y
    }
    RootStore.setModalBounds(qqNumber, newBounds);
  }
  return (
    <>
      <Modal
        mask={false}
        maskClosable={false}
        getContainer={false}
        bodyStyle={{ height: _size.height - 108 }}
        footer={[
          <>{`玩家剩余属性点:${nowPc ? nowPc.statusPoint : 0}`}
            <Button key="back" type="primary" onClick={handleOk}>
              确认
            </Button>,
          </>
        ]}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => { }}
            onBlur={() => { }}
          // end
          >
            {nowPc ? <>{nowPc.name}<Text mark>{` 第${nowPc.turn}/${RootStore.getPcsByQQNumber(qqNumber).length - 1}回合`}</Text><Text mark>{` 平均第${RootStore.averPcTurn}回合`}</Text></> : "警告：未找到目标QQ号"}
            <Button htmlType="button" type='default' onClick={(e) => {
              const pcs = RootStore.getPcsByQQNumber(qqNumber)
              if (pcs.length > Math.abs(index)) {
                setIndex(index - 1)
              }
            }} key="accept">
              上一回合
            </Button>
            <Button htmlType="button" type='default' onClick={(e) => { RootStore.pcNextTurn(qqNumber, index) }} key="accept">
              替换
            </Button>
            <Button htmlType="button" danger type='default' onClick={(e) => { RootStore.delPcTurn(qqNumber, index) }} key="del">
              删除
            </Button>
            <Button htmlType="button" type='default' onClick={(e) => {
              const pcs = RootStore.getPcsByQQNumber(qqNumber)
              if (index < -1) {
                setIndex(index + 1)
              } else {
                RootStore.pcNextTurn(qqNumber)
              }
            }} key="accept">
              下一回合
            </Button>
          </div>
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={modal => (
          <Draggable
            bounds={_bounds}
            disabled={disabled}
            position={bounds}
            onStart={(event: any, uiData: any) => onStart(event, uiData)}
            onStop={(event: any, uiData: any) => onStop(event, uiData)}
          >
            <ResizableBox
              width={_size.width}
              height={_size.height}
              onResize={onResize}
              resizeHandles={['se']}
              handle={<ControlPointSE><div className="control-point" /></ControlPointSE>}
              minConstraints={[208, 153]}
            >
              <div style={{ height: _size.height }} ref={draggleRef}>{modal}</div>
            </ResizableBox>
          </Draggable>
        )}
      >
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="属性" key="1">
            {pcStatus}
          </TabPane>
          <TabPane tab="技能" key="2">
            {pcSkill}
          </TabPane>
          <TabPane tab="兑换" key="3">
            {pcExchange}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
}
export default (observer(PcModal));