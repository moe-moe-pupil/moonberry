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
const typeEnum: string[] = [];
for (var i in SkillTypeEnum) {
  typeEnum.push(SkillTypeEnum[i])
}

const targetEnum: string[] = [];
for (var i in SkillTargetEnum) {
  targetEnum.push(SkillTargetEnum[i])
}
interface IPcExchange {
  qqNumber: number,
  inited: boolean
}

const PcSkill = ({ qqNumber, inited }: IPcExchange) => {
  const { RootStore }: Record<string, Root> = useStores();
  const [targetEffect, setTargetEffect] = useState(RootStore.getPcSkills(qqNumber, inited).map((skill) => {
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
    RootStore.setSkillInited(qqNumber, idx)
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
    RootStore.delSkillByName(qqNumber, skillName);
  }
  return (
    <>
      {inited?<Button onClick={(e)=>{RootStore.skillAdd(RootStore.getPcByQQNumber(qqNumber)!,undefined,inited)}}>新建技能</Button>:void(0)}
      {RootStore.getPcSkills(qqNumber, inited).map((item, idx) => {
        return (
          <ProForm
            onFinish={async (values) => {
              console.log(values);
            }}
            onValuesChange={
              (changeValues, values) => {
                console.log(changeValues)
                RootStore.setPcSkill(qqNumber, idx, changeValues, inited)
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
                      <ExchangeRefuse qqNumber={qqNumber} skillName={item.name} />
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
            <ProFormText
              name="name"
              label="名称"
              placeholder="请输入名称"
              initialValue={item.name}
              fieldProps={{ value: item.name }}
            />
            <ProForm.Group>
              <ProFormSelect
                allowClear={false}
                options={typeEnum}
                width="xs"
                name="type"
                label="类型"
                initialValue={item.type}
                fieldProps={{ value: item.type }}
              />
              <ProFormSelect
                allowClear={false}
                options={targetEnum}
                width="xs"
                name="class"
                label="打击类型"
                initialValue={item.class}
                fieldProps={{ value: item.class }}
              />
              <ProFormText
                width="xs"
                name="target"
                label="目标数量"
                initialValue={item.target}
                fieldProps={{ value: item.target }}
              />
              <ProFormText
                width="xs"
                name="cooldown"
                label="冷却"
                initialValue={item.cooldown}
                fieldProps={{ value: item.cooldown }}
              />
              <ProFormText
                width="xs"
                name="cooldownLeft"
                label="剩余冷却"
                initialValue={item.cooldownLeft}
                fieldProps={{ value: item.cooldownLeft }}
              />
              <ProFormText
                width="xs"
                name="range"
                label="射程"
                tooltip='1码射程 = 25像素(当前视图) = 100像素(UE4) '
                initialValue={item.range}
                fieldProps={{ value: item.range }}
              />
              <ProFormText
                width="xs"
                name="cost"
                label="能耗"
                initialValue={item.cost}
                fieldProps={{ value: item.cost }}
              />
              {inited ?
                <ProFormDigit
                  width="xs"
                  label="消耗分数："
                  name="exchangePoint"
                  min={0}
                  initialValue={item.exchangePoint}
                /> : void (0)}
            </ProForm.Group>
            <ProForm.Group>
              {/*
              <ProFormText
                width="xs"
                name="dmg"
                label="伤害"
                initialValue={item.dmg}
              />
              <ProFormText
                width="xs"
                name="heal"
                label="治疗"
                initialValue={item.heal}
              />
              */}
              <ProFormSelect
                width="xs"
                options={skillsEffectOption}
                name="poolId"
                label="技能效果"
                initialValue={item.poolId}
                fieldProps={{
                  value: item.poolId,
                  onClear: () => { RootStore.setPcSkill(qqNumber, idx, { poolId: '' }, inited) },
                  onChange: (value) => {
                    setTargetEffect(RootStore.getPcSkills(qqNumber, inited).map((skill) => {
                      return skill.poolId
                    }))
                  }
                }}
              />
              {item.args.map((arg) => {
                if(arg.type != ArgsTypes.BUFF) {
                  return (
                    <ProFormText
                      width="xs"
                      name={arg.name}
                      label={arg.name}
                      initialValue={arg.value}
                    />
                  )
                } else {
                  // const nowPool = RootStore.getEffectById(arg.value)
                  // if(nowPool){
                  //   return nowPool.args.map((arg)=>{
                  //   console.log(arg)
                  //     return (
                  //       <ProFormText
                  //         width="xs"
                  //         name={arg.name}
                  //         label={arg.name}
                  //         initialValue={arg.value}
                  //       />
                  //     )
                  //   })
                  // }
                }
                
              })}
            </ProForm.Group>
            <ProFormTextArea width="xl" label="描述" name="description" initialValue={item.description} />
          </ProForm>
        )
      })}
    </>
  )
}
export default (observer(PcSkill));
