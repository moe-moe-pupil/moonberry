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
import { useEffect, useState } from 'react';
import Pc from '@/stores/PcStore';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { usePortal } from '@antv/x6-react-shape';
import { uuid } from '@antv/x6/lib/util/string/uuid';
import { waitTime } from '@/utils/await';
import { IChartRect } from './UnitRect';
import { IArea } from '@/stores/GroupStore';


export const CombatRect = ({ type, title, row, node }: IChartRect) => {
  var outLined = <CaretRightOutlined />
  const gID = node.getProp('groupID')
  //const getChatArea = node.getProp('chatArea')
  //const nowChatArea = getChatArea(gID) as IArea
  const { RootStore }: Record<string, Root> = useStores();
  const nowChatArea = RootStore.getChatAreaById(gID)
  const [refresh, setRefresh] = useState(0)
  const nowMembers:Pc[] = []
  const [nowMemberIdx, setNowMemberIdx] = useState(0)
  nowChatArea?.combat ? nowChatArea.member.map((member) => {
    const nowPc = RootStore.getPcByQQNumber(member)
    if (nowPc) {
      nowMembers.push(nowPc)
    }
  }) : void (0)
  nowMembers.sort((a, b) => { return (b.status.agi + b.extraStatus.agi) - (a.status.agi + a.extraStatus.agi) })
  useEffect(() => {
    setRefresh(refresh + 1)
  }, [RootStore.chatAreaFresh])
  //const nowPc = RootStore.getPcByQQNumber(QQNumber)! //似乎因为一些挂载机制的问题，没法这么写
  const pcMainMenu = (
    <div>
      <Button type="link" onClick={void (0)}>
        造成伤害/治疗
      </Button><br />
    </div>
  )
  const dangerMenu = (
    <div>

      <Button type="link" danger onClick={void (0)}>
        判定死亡
      </Button><br />
    </div>
  )
  const skillsMenu = (nowPc: Pc) => {
    return nowPc.skillChain.map((skill) => {
      return (
        <>
          <Button type="link" danger={skill.able ? false : true} onClick={() => RootStore.updatePcStatus(nowPc, true)}>
            {`「${skill.name}」 冷却[${skill.cooldownLeft == 0 ? '就绪' : skill.cooldownLeft}]`}
          </Button><br />
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
  }
  return (
    <Popover content={type == rectType.pc ? pcContent : void (0)} title={'虚拟讨论组' + (nowChatArea?.combat ? '(战斗轮中)' : '')} trigger="contextMenu" placement="right" zIndex={1000}>
      <div className='rectContainer' style={{ width: '100%', height: '100%', background: nowChatArea?.combat ? '#ffbbbb' : '#fffbe6' || '#fffbe6' }}>
        <div className={`rectTop ${node.getProp(type)}`}>
        </div>
        <div className='rectTopContent'>
          {outLined}
          {title + (nowChatArea?.combat ? '(战斗轮中) ' : '')}
          {nowMembers.map((member, index) => { return <><Button type={index == nowMemberIdx ? 'primary' : 'ghost'} onClick={(e) => { setNowMemberIdx(index) }}>{member.nickname + `(${member.extraStatus.agi + member.status.agi})`}</Button> {index != nowMembers.length - 1 ? '->' : void (0)}</> })}
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

          </div>
          <div className='rectRight'>

          </div>
        </div>
        <div className='rectBody'>
          <div className='rectLeft'>

          </div>
          <div className='rectRight'>

          </div>
        </div>
      </div>
    </Popover>
  )
}

export default observer(CombatRect); 
