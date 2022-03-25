import { Team, statusModal } from '@/stores/GroupStore';
import Pc from '@/stores/PcStore';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { Button, Modal, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Draggabled, { ControlPosition } from 'react-draggable';
import styled from 'styled-components';
import { ResizableBox } from 'react-resizable';
import { Item } from '../ChatListItem';
import { messageType, miraiMessageChain } from '@/stores/ChatStore';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import ListItem from '@material-ui/core/ListItem';
import { createPortal } from 'react-dom';
import { AreaHTMLAttributes } from '@umijs/renderer-react/node_modules/@types/react';

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
    margin-top: 30px !important;
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
const useDraggableInPortal = () => {
  const self: any = useRef({}).current;

  useEffect(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none';
    div.style.top = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.overflow = "hidden"
    self.elt = div;
    document.body.appendChild(div);
    return () => {
      document.body.removeChild(div);
    };
  }, [self]);

  return (render: any) => (provided: any, ...args: any) => {
    const element = render(provided, ...args);
    if (provided.draggableProps.style.position === 'fixed') {
      return createPortal(element, self.elt);
    }
    return element;
  };
};

const AreaModal = ({ Id: qqNumber, name, visible, bounds, size, buff, allowPcNicknameRepeat }: Team) => {
  const renderDraggable = useDraggableInPortal();
  const draggleRef = React.createRef<HTMLDivElement>();
  const [disabled, setDisabled] = useState(true);
  const [_size, setSize] = useState(size);
  const { RootStore }: Record<string, Root> = useStores();
  const [_bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  console.log(qqNumber)
  const handleOk = (e: any) => {
    console.log(e);
    RootStore.setModalVisible(qqNumber, false);
  };

  const handleCancel = (e: any) => {
    console.log(e);
    RootStore.setModalVisible(qqNumber, false);
  };

  const handleReset = (e: any) => {
    RootStore.setTeamPcs(qqNumber, []);
  };

  const handleChange = (selectedItems: string[]) => {
    const newPcs: Pc[] = []
    selectedItems.map((name, idx) => {
      const newPc = RootStore.getPcByNickname(name) as Pc
      newPcs.push(newPc);
    })
    RootStore.setTeamPcs(qqNumber, newPcs);
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
  //const filteredOptions = RootStore.AllPcNameList.filter(o => !selectedItems.includes(o));
  return (
    <>
      <Modal
        mask={false}
        maskClosable={false}
        getContainer={false}
        bodyStyle={{ height: _size.height - 108, overflow: 'auto' }}
        footer={[
          <>
            <Select
              mode="multiple"
              placeholder="点击以设置区域内PC"
              value={RootStore.getTeamByQQNumber(qqNumber)!.pcs.map((item, idx) => {
                return item.nickname;
              })}
              onChange={handleChange}
              style={{ width: '100%', overflow: 'auto' }}
              allowClear
              maxTagCount='responsive'
              defaultValue={RootStore.getTeamByQQNumber(qqNumber)!.pcs.map((item, idx) => {
                return item.nickname;
              })}
            >
              {allowPcNicknameRepeat ? RootStore.AllPcList.map(item => (
                <Select.Option key={item.Id} value={item.nickname}>
                  {item.nickname}
                </Select.Option>
              )) : RootStore.AllNoTeamPcList.map(item => (
                <Select.Option key={item.Id} value={item.nickname}>
                  {item.nickname}
                </Select.Option>
              ))}
            </Select>
            <br />
            <Button key="cancel" onClick={handleCancel}>
              关闭
            </Button>,
            <Button key="reset" type="primary" onClick={handleReset} danger>
              重置
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
            {name || "警告：未找到目标区域"}
          </div>
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={modal => (
          <Draggabled
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
          </Draggabled>
        )}
      >
        <Droppable direction="horizontal" droppableId={qqNumber.toString()}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ height: '100%' }}>
              {RootStore.getTeamByQQNumber(qqNumber)!.pcs.map((item, idx) => {
                return item.nickname;
              }).map((item, idx) => (
                <Draggable draggableId={qqNumber.toString() + item} index={qqNumber * 10000 + idx} key={qqNumber * 10000 + idx}>
                  {renderDraggable((provided: any, snapshot: any) => (
                    <ListItem
                      style={{ width: 50 }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item}
                    </ListItem>
                  )
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Modal>
    </>
  );
}
export default (observer(AreaModal));

