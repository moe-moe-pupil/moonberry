import {
  CaretRightOutlined,
  UserOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Progress, Popover, Dropdown, Button, Collapse } from 'antd';
const { Panel } = Collapse;
import styled from 'styled-components'
import { rectType } from './ChartRect';
import { Node, Shape } from '@antv/x6'
import { useEffect } from 'react';
import Pc from '@/stores/PcStore';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { usePortal } from '@antv/x6-react-shape';
import { uuid } from '@antv/x6/lib/util/string/uuid';
import { waitTime } from '@/utils/await';
import SkillTriggerModalBtn from '../chat/modal/SkillTriggerModalBtn';



export enum contentType {
  'exec',
  'prop',
}

export interface IChartRectContent {
  type: contentType,
  text: string,
}

export interface IRectRow {
  outPorts: string
  inPorts: string
}

export interface IChartRect {
  type: rectType,
  title: string,
  row: IRectRow[]
  node: Node<Node.Properties>
}

export const UnitRect = ({ type, title, row, node }: IChartRect) => {
  var outLined = <CaretRightOutlined />
  const getPc = node.getProp('pc')
  const QQNumber = node.getProp('QQNumber')

  //const root: Root = node.getProp('root')
  const { RootStore }: Record<string, Root> = useStores();
  const nowPc = RootStore.getPcByQQNumber(QQNumber) //getPc(QQNumber)
  console.log(QQNumber, nowPc)
  if (!nowPc) {
    console.log(QQNumber, nowPc, '生成失败')
    return (<></>)
  }
  const pcMainMenu = (
    <div>
      <Button type="link" onClick={() => RootStore.pcNextTurn(QQNumber)}>
        下一回合
      </Button><br />
      <Button type="link" onClick={void (0)}>
        造成伤害/治疗
      </Button><br />
      {RootStore.config.Ue4Enable ? <>
        <Button type="link" onClick={() => RootStore.ezTeleport(QQNumber)}>
          传送至目标位置
        </Button><br /> </> : void (0)}
    </div>
  )
  const dangerMenu = (
    <div>
      <Button type="link" danger onClick={() => RootStore.updatePcStatus(nowPc, true)}>
        回复状态
      </Button><br />
      <Button type="link" danger onClick={() => RootStore.killPc(nowPc)}>
        判定死亡
      </Button><br />
    </div>
  )
  const skillsMenu = (nowPc: Pc) => {
    return nowPc.skillChain.map((skill) => {
      return (
        <>
          <SkillTriggerModalBtn casterID={nowPc.Id} skill={skill} /><br />
        </>
      )
    })
  }
  const pcContent = (
    <>
      <Collapse defaultActiveKey={['main']} ghost>
        <Panel header="主操作" key="main">
          {pcMainMenu}
        </Panel>
        <Panel header="技能" key="skills">
          {skillsMenu(nowPc)}
        </Panel>
        <Panel header='危险操作' key="danger">
          {dangerMenu}
        </Panel>
      </Collapse>
    </>

  );
  switch (type) {
    case rectType.pc:
      outLined = <UserOutlined />
      break;
    default:
      outLined = <UserOutlined />
      break;
  }
  return (
    <Popover content={type == rectType.pc || type == rectType.npc ? pcContent : void (0)} title={nowPc.nickname} trigger="contextMenu" placement="right" zIndex={1000}>
      <div className='rectContainer'>
        <div className={`rectTop ${node.getProp(type)}`}>
        </div>
        <div className='rectTopContent'>
          {outLined}
          {title + ` 第${nowPc.turn}回合`}
          <p style={{marginTop:15, marginLeft:'50%'}}>
            {`(${nowPc.nickname})`}
          </p>
        </div>
        {row.map((content) => {
          const inPortsStrs = content.inPorts.split(":")
          const outPortsStrs = content.outPorts.split(":")
          return (
            <div className='rectBody'>
              <div className='rectLeft'>
                {inPortsStrs.length > 1 ? inPortsStrs[0] : void (0)}
              </div>
              <div className='rectRight'>
                {outPortsStrs.length > 1 ? outPortsStrs[0] : void (0)}
              </div>
            </div>
          )
        })}
        <div className='rectBody'>
          <div className='rectLeft'>
            <Progress percent={nowPc.hp / nowPc.maxHP * 100} size="small" status="exception" showInfo={false} />
          </div>
          <div className='rectRight'>
            {`${nowPc.hp} / ${nowPc.maxHP}`}
          </div>
        </div>
        <div className='rectBody'>
          <div className='rectLeft'>
            <Progress percent={nowPc.mp / nowPc.maxMP * 100} size="small" showInfo={false} />
          </div>
          <div className='rectRight'>
            {`${nowPc.mp} / ${nowPc.maxMP}`}
          </div>
        </div>
      </div>
    </Popover>
  )
}

export default observer(UnitRect); 
