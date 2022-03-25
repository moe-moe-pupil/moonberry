import { IWorldModal, statusModal } from '@/stores/GroupStore';
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
import WorldChart from '@/component/chart/WorldChart';
import { waitTime } from '@/utils/await';

const { TabPane } = Tabs;
export const BPProDiv = styled.div`
  .rectContainer {
    width:140px;
    min-height:140px;
    background:white;
  }
  .rectTop {
    width:100%;
    height:30px;
    border-bottom: 1px solid black;
    filter: blur(1px);
  }
  .rectTopContent{
    width:100%;
    top: 0;
    text-indent: 7.5%;
    position:absolute;
  }
  .rectBody {
    width:100%;
    height:40px;
    display:flex;
  }
  .rectLeft {
    width:55%;
    margin-left:3%;
  }
  .rectRight {
    text-align:right;
    width:40%;
  }
  .chartContainer {
    width:100%!important;
    height:100%!important;
    display: flex;
  }
  .x6-graph-scroller {
    width:100%!important;
    height:100%!important;
  }
  .app-stencil{
    width: 200px;
    border: 1px solid #f0f0f0;
    position: relative;
  }
  .x6-node.x6-node-immovable {

  }
  .x6-widget-stencil-group .x6-graph {
   
  }
  .minimap {
    position: absolute;
    float: right;
    right: 100px;
    top: 100px;
    z-index: 1;
    opacity: 0.9;
  }
  .rectTop.pc{
    background: rgba(73,155,234,1);
    background: -moz-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -webkit-gradient(left top, right bottom, color-stop(0%, rgba(73,155,234,1)), color-stop(27%, rgba(214,234,255,1)), color-stop(46%, rgba(168,212,255,1)), color-stop(100%, rgba(32,124,229,1)));
    background: -webkit-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -o-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -ms-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: linear-gradient(135deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#499bea', endColorstr='#207ce5', GradientType=1 );
  }
  .rectTop.event {
    background: rgba(248,80,50,1);
    background: -moz-linear-gradient(-45deg, rgba(248,80,50,1) 0%, rgba(241,111,92,1) 27%, rgba(246,41,12,1) 51%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%);
    background: -webkit-gradient(left top, right bottom, color-stop(0%, rgba(248,80,50,1)), color-stop(27%, rgba(241,111,92,1)), color-stop(51%, rgba(246,41,12,1)), color-stop(71%, rgba(240,47,23,1)), color-stop(100%, rgba(231,56,39,1)));
    background: -webkit-linear-gradient(-45deg, rgba(248,80,50,1) 0%, rgba(241,111,92,1) 27%, rgba(246,41,12,1) 51%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%);
    background: -o-linear-gradient(-45deg, rgba(248,80,50,1) 0%, rgba(241,111,92,1) 27%, rgba(246,41,12,1) 51%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%);
    background: -ms-linear-gradient(-45deg, rgba(248,80,50,1) 0%, rgba(241,111,92,1) 27%, rgba(246,41,12,1) 51%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%);
    background: linear-gradient(135deg, rgba(248,80,50,1) 0%, rgba(241,111,92,1) 27%, rgba(246,41,12,1) 51%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f85032', endColorstr='#e73827', GradientType=1 );
  }
  .rectTop.function {
    background: rgba(73,155,234,1);
    background: -moz-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -webkit-gradient(left top, right bottom, color-stop(0%, rgba(73,155,234,1)), color-stop(27%, rgba(214,234,255,1)), color-stop(46%, rgba(168,212,255,1)), color-stop(100%, rgba(32,124,229,1)));
    background: -webkit-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -o-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -ms-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: linear-gradient(135deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#499bea', endColorstr='#207ce5', GradientType=1 );
  }
  .rectTop.var {
    background: rgba(73,155,15,1);
    background: -moz-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -webkit-gradient(left top, right bottom, color-stop(0%, rgba(73,155,234,1)), color-stop(27%, rgba(214,234,255,1)), color-stop(46%, rgba(168,212,255,1)), color-stop(100%, rgba(32,124,229,1)));
    background: -webkit-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -o-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: -ms-linear-gradient(-45deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    background: linear-gradient(135deg, rgba(73,155,234,1) 0%, rgba(214,234,255,1) 27%, rgba(168,212,255,1) 46%, rgba(32,124,229,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#499bea', endColorstr='#207ce5', GradientType=1 );
  }
  .rectContainer.combat {
    background:#ffbbbb;
  }
`

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

const WorldModal = ({ Id, visible, bounds, size, world }: IWorldModal) => {
  const draggleRef = React.createRef<HTMLDivElement>();
  const [disabled, setDisabled] = useState(true);
  const [_size, setSize] = useState(size);
  const modalRef = useRef(null)
  const { RootStore }: Record<string, Root> = useStores();
  const [_bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });

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
            {world.name}
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
            <WorldChart id={Id} />
          </div>
        </BPProDiv>
      </Modal>
    </>
  );
}
export default (observer(WorldModal));