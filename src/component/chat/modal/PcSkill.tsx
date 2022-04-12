import Pc from '@/stores/PcStore';
import Root, { ArgsTypes, ModalType } from '@/stores/RootStore';
import { message, Button } from 'antd';
import { SkillTargetEnum, SkillTypeEnum } from '@/stores/SkillStore';
import { useStores } from '@/utils/useStores';
import ProForm, { ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { inject, observer } from 'mobx-react';
import { OptionsType } from 'rc-select/lib/interface';
import React, { useState } from 'react'
import ExchangeRefuse from './ExchangeRefuse';
import { skillEditModal } from '@/stores/GroupStore';
import PcSkillForm from '../form/PcSkillForm';
const typeEnum: string[] = [];
for (var i in SkillTypeEnum) {
  typeEnum.push(SkillTypeEnum[i])
}

const targetEnum: string[] = [];
for (var i in SkillTargetEnum) {
  targetEnum.push(SkillTargetEnum[i])
}

interface IPcExchange {
  inited: boolean,
  Pc: Pc
}

const PcSkill = ({ inited, Pc }: IPcExchange) => {
  const { RootStore }: Record<string, Root> = useStores();
  const [targetEffect, setTargetEffect] = useState(Pc.skillChain.map((skill) => {
    return skill.poolId
  }));
  const skillsEffectOption: any = []
  RootStore.skillsPool.map((effect, idx) => {
    const newOption = {
      value: effect.id,
      label: effect.name + ":" + effect.tags
    }
    skillsEffectOption.push(newOption)
  })
  function handleAccept(idx: number) {
    RootStore.setSkillInited(idx, undefined, Pc)
  }
  function handleEdit(idx: number) {
    if (targetEffect.length != 0 && targetEffect[idx] != "") {
      const Modal: skillEditModal = {
        Id: targetEffect[idx],
        visible: true,
        bounds: {
          x: 0,
          y: 0
        },
        size: {
          width: 320,
          height: 300
        }
      }
      RootStore.modalAdd(Modal, ModalType.skill);
      console.log(Modal)
    } else {
      message.error('请先选择技能效果')
    }
  }
  function handleDel(skillName: string) {
    RootStore.delSkillByName(skillName, true, Pc?.Id, Pc);
  }

  return (
    <>
      {inited ? <Button onClick={(e) => { RootStore.skillAdd(Pc, undefined, inited) }}>新建技能</Button> : void (0)}
      {Pc.skillChain.map((item, idx) => {
        return (
          <ProForm
            onFinish={async (values) => {
              console.log(values);
            }}
            onValuesChange={
              (changeValues, values) => {
                console.log(changeValues)
                RootStore.setPcSkill(idx, changeValues, inited, Pc)
              }
            }
            submitter={{
              render: (props, doms) => {
                if (!inited) {
                  return [
                    <ProForm.Group>
                      <Button htmlType="button" onClick={(e) => handleAccept(idx)} type='primary' key="accept">
                        接受
                      </Button>
                      <ProFormDigit
                        width="xs"
                        addonBefore="消耗分数："
                        name="exchangePoint"
                        min={0}
                        initialValue={item.exchangePoint}
                      />
                      <ExchangeRefuse qqNumber={Pc.Id} skillName={item.name} />
                    </ProForm.Group>
                  ];
                } else {
                  return [
                    <Button htmlType="button" onClick={(e) => { handleEdit(idx) }} type='primary' key="edit">
                      编辑
                    </Button>,
                    <Button htmlType="button" danger onClick={(e) => { handleDel(item.name) }} key="del">
                      删除
                    </Button>,
                  ];
                }
              },
            }}
          >
            {Pc ? <PcSkillForm nowSkill={item} inited={inited} nowPc={Pc} idx={0} /> : void (0)}
          </ProForm>
        )
      })}
    </>
  )
}
export default (observer(PcSkill));
