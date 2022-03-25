import { skillEditModal, statusModal } from '@/stores/GroupStore';
import Pc from '@/stores/PcStore';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { Button, Modal, Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useRef } from 'react';
import { useState } from 'react';
import Draggable, { ControlPosition } from 'react-draggable';
import styled from 'styled-components';
import { ResizableBox } from 'react-resizable';
import { Item } from '../ChatListItem';
import { messageType, miraiMessageChain } from '@/stores/ChatStore';
import PcSkill from './PcSkill';
import PcStauts from './PcStauts';
import { SkillEditChart } from '@/component/chart/SkillEditChart';
import { BPProDiv } from '@/component/chat/modal/WorldModal'
const { TabPane } = Tabs;
// const ProDiv = styled.div`
//   .chartContainer {
//     width:100%!important;
//     height:100%!important;
//     display: flex;
//   }
//   .x6-graph-scroller {
//     width:100%!important;
//     height:100%!important;
//   }
//   .app-stencil{
//     width: 200px;
//     border: 1px solid #f0f0f0;
//     position: relative;
//   }
//   .x6-node.x6-node-immovable {

//   }
//   .x6-widget-stencil-group .x6-graph {

//   }
//   .minimap {
//     position: absolute;
//     float: right;
//     right: 100px;
//     top: 100px;
//     z-index: 1;
//     opacity: 0.9;
//   }
// `
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

const SkillEditModal = ({ Id, visible, bounds, size }: skillEditModal) => {
  const draggleRef = React.createRef<HTMLDivElement>();
  const [disabled, setDisabled] = useState(true);
  const [_size, setSize] = useState(size);
  const modalRef = useRef(null)
  const { RootStore }: Record<string, Root> = useStores();
  const [_bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const nowEffect = RootStore.getEffectById(Id)!

  const handleOk = (e: any) => {
    RootStore.setModalVisible(Id, false);
  };

  const handleCancel = (e: any) => {
    RootStore.setModalVisible(Id, false);
  };

  const onResize = (event: any, { size }: any) => {
    setSize({ width: size.width, height: size.height });
    RootStore.setModalSize(Id, size)
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
    RootStore.setModalBounds(Id, newBounds);
  }
  return (
    <>
      <Modal
        mask={false}
        maskClosable={false}
        getContainer={false}
        bodyStyle={{ height: _size.height - 108 }}
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
            {nowEffect.name}
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
        <BPProDiv style={{ width: '100%', height: '100%', display: 'flex' }}>
          <div className="app-stencil" id={Id + ".stencil"} />
          <div className="minimap" id={Id + ".minimap"} />
          <div id={Id} className='chartContainer'>
            <SkillEditChart id={Id} />
          </div>
        </BPProDiv>
      </Modal>
    </>
  );
}
export default (observer(SkillEditModal));