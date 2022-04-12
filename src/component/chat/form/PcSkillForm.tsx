import Pc from '@/stores/PcStore';
import Root, { ArgsTypes } from '@/stores/RootStore';
import { message, Button } from 'antd';
import Skill, { SkillTargetEnum, SkillTypeEnum } from '@/stores/SkillStore';
import { useStores } from '@/utils/useStores';
import ProForm, { ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { inject, observer } from 'mobx-react';
import { OptionsType } from 'rc-select/lib/interface';
import React, { useState } from 'react'
import { Typography, Space } from 'antd';
import { geneMaxExp } from '@/utils/exp'
const { Text, Link } = Typography;
const typeEnum: string[] = [];
for (var i in SkillTypeEnum) {
  typeEnum.push(SkillTypeEnum[i])
}

const targetEnum: string[] = [];
for (var i in SkillTargetEnum) {
  targetEnum.push(SkillTargetEnum[i])
}


const PcStatusForm: React.FC<{ nowSkill: Skill, inited: boolean, nowPc: Pc, idx: number }> = ({ nowSkill, inited, nowPc, idx }) => {
  const { RootStore }: Record<string, Root> = useStores();
  const skillsEffectOption: any = []
  const [targetEffect, setTargetEffect] = useState(nowPc.skillChain.map((skill) => {
    return skill.poolId
  }));
  RootStore.skillsPool.map((effect, idx) => {
    const newOption = {
      value: effect.id,
      label: effect.name + ":" + effect.tags
    }
    skillsEffectOption.push(newOption)
  })
  return (
    <>
      <ProFormText
        name="name"
        label="名称"
        placeholder="请输入名称"
        initialValue={nowSkill.name}
        fieldProps={{ value: nowSkill.name }}
      />
      <ProForm.Group>
        <ProFormSelect
          allowClear={false}
          options={typeEnum}
          width="xs"
          name="type"
          label="类型"
          initialValue={nowSkill.type}
          fieldProps={{ value: nowSkill.type }}
        />
        <ProFormSelect
          allowClear={false}
          options={targetEnum}
          width="xs"
          name="class"
          label="打击类型"
          initialValue={nowSkill.class}
          fieldProps={{ value: nowSkill.class }}
        />
        <ProFormText
          width="xs"
          name="target"
          label="目标数量"
          initialValue={nowSkill.target}
          fieldProps={{ value: nowSkill.target }}
        />
        <ProFormText
          width="xs"
          name="cooldown"
          label="冷却"
          initialValue={nowSkill.cooldown}
          fieldProps={{ value: nowSkill.cooldown }}
        />
        <ProFormText
          width="xs"
          name="cooldownLeft"
          label="剩余冷却"
          initialValue={nowSkill.cooldownLeft}
          fieldProps={{ value: nowSkill.cooldownLeft }}
        />
        <ProFormText
          width="xs"
          name="range"
          label="射程"
          tooltip='1码射程 = 25像素(当前视图) = 100像素(UE4) '
          initialValue={nowSkill.range}
          fieldProps={{ value: nowSkill.range }}
        />
        <ProFormText
          width="xs"
          name="cost"
          label="能耗"
          initialValue={nowSkill.cost}
          fieldProps={{ value: nowSkill.cost }}
        />
        {inited ?
          <ProFormDigit
            width="xs"
            label="消耗分数："
            name="exchangePoint"
            min={0}
            initialValue={nowSkill.exchangePoint}
          /> : void (0)}
      </ProForm.Group>
      <ProForm.Group>
        {/*
              <ProFormText
                width="xs"
                name="dmg"
                label="伤害"
                initialValue={nowSkill.dmg}
              />
              <ProFormText
                width="xs"
                name="heal"
                label="治疗"
                initialValue={nowSkill.heal}
              />
              */}
        <ProFormSelect
          width="xs"
          options={skillsEffectOption}
          name="poolId"
          label="技能效果"
          initialValue={nowSkill.poolId}
          fieldProps={{
            value: nowSkill.poolId,
            onClear: () => { RootStore.setPcSkill(idx, { poolId: '' }, inited, nowPc, nowPc.Id) },
            onChange: (value) => {
              setTargetEffect(nowPc.skillChain.map((skill) => {
                return skill.poolId
              }))
            }
          }}
        />
        {nowSkill.args.map((arg) => {
          if (arg.type != ArgsTypes.BUFF) {
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
      <ProFormTextArea width="xl" label="描述" name="description" initialValue={nowSkill.description} />
    </>
  )
}

export default (observer(PcStatusForm));
