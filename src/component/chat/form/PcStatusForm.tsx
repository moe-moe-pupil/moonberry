import Pc from '@/stores/PcStore';
import Root from '@/stores/RootStore';
import { message, Button } from 'antd';
import { SkillTargetEnum, SkillTypeEnum } from '@/stores/SkillStore';
import { useStores } from '@/utils/useStores';
import ProForm, { ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { inject, observer } from 'mobx-react';
import { OptionsType } from 'rc-select/lib/interface';
import React, { useState } from 'react'
import { Typography, Space } from 'antd';
import { geneMaxExp } from '@/utils/exp'
const { Text, Link } = Typography;

const PcStatusForm: React.FC<{ nowPc: Pc }> = ({ nowPc }) => {
  const { RootStore }: Record<string, Root> = useStores();
  return (
    <>
      <ProFormText
        name="nickname"
        label="名称"
        placeholder="请输入名称"
        initialValue={typeof nowPc.nickname != 'string' ? '' : nowPc.nickname}
        fieldProps={{ value: typeof nowPc.nickname != 'string' ? '' : nowPc.nickname }} />
      <ProForm.Group>
        <ProFormDigit
          width="xs"
          name="lv"
          label="等级:"
          min={1}
          fieldProps={{ value: nowPc.lv }} />
        <ProFormDigit
          addonAfter={` / ${geneMaxExp(nowPc.lv)}`}
          width="xs"
          name="exp"
          label="经验值:"
          min={0}
          fieldProps={{ value: nowPc.exp }} />
        <ProFormDigit
          width="xs"
          name="exchangePoint"
          label="兑换分数:"
          min={0}
          fieldProps={{ value: nowPc.exchangePoint }} />
      </ProForm.Group><ProForm.Group>
        <ProFormDigit
          addonAfter="/"
          width="xs"
          name="hp"
          label={<>生命: <Text keyboard type='danger'>{RootStore.formatHPStatus(nowPc.hp, nowPc.maxHP)}</Text></>}
          min={0}
          max={nowPc.maxHP}
          initialValue={nowPc.hp}
          fieldProps={{ value: nowPc.hp }} />
        <ProFormDigit
          width="xs"
          name="maxHP"
          label="最大生命:"
          min={0}
          initialValue={nowPc.maxHP}
          fieldProps={{ value: nowPc.maxHP }} />
        <ProFormText
          width="xs"
          name="hpReg"
          label="日常回复"
          initialValue={nowPc.hpReg}
          fieldProps={{ value: nowPc.hpReg }} />
      </ProForm.Group><ProForm.Group>
        <ProFormDigit
          addonAfter="/"
          width="xs"
          name="mp"
          label="魔法:"
          min={0}
          max={nowPc.maxMP}
          fieldProps={{ value: nowPc.mp }} />
        <ProFormDigit
          width="xs"
          name="maxMP"
          label="最大魔法:"
          min={0}
          initialValue={nowPc.maxMP}
          fieldProps={{ value: nowPc.maxMP }} />
        <ProFormText
          width="xs"
          name="mpReg"
          label="日常回复"
          initialValue={nowPc.mpReg}
          fieldProps={{ value: nowPc.mpReg }} />
      </ProForm.Group><ProForm.Group>
        <ProFormText
          width="xs"
          name="speed"
          label="移动速度"
          initialValue={nowPc.speed}
          fieldProps={{ value: nowPc.speed }} />
        <ProFormText
          width="xs"
          name="DMGModify"
          label="伤害增减"
          initialValue={nowPc.DMGModify}
          fieldProps={{ value: nowPc.DMGModify }} />
        <ProFormText
          width="xs"
          name="healModify"
          label="治疗增减"
          initialValue={nowPc.healModify}
          fieldProps={{ value: nowPc.healModify }} />
        <ProFormText
          width="xs"
          name="tDMGModify"
          label="承受伤害增减"
          initialValue={nowPc.tDMGModify}
          fieldProps={{ value: nowPc.tDMGModify }} />
        <ProFormText
          width="xs"
          name="tHealModify"
          label="承受治疗增减"
          initialValue={nowPc.tHealModify}
          fieldProps={{ value: nowPc.tHealModify }} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="xs"
          name="str"
          label="力量:"
          initialValue={nowPc.status.str}
          addonAfter={`+${nowPc.extraStatus.str}=${nowPc.extraStatus.str + nowPc.status.str}`}
          fieldProps={{ value: nowPc.status.str }} />
        <ProFormDigit
          width="xs"
          name="agi"
          label="敏捷:"
          initialValue={nowPc.status.agi}
          addonAfter={`+${nowPc.extraStatus.agi}=${nowPc.extraStatus.agi + nowPc.status.agi}`}
          fieldProps={{ value: nowPc.status.agi }} />
        <ProFormDigit
          width="xs"
          name="dex"
          label="灵巧:"
          initialValue={nowPc.status.dex}
          addonAfter={`+${nowPc.extraStatus.dex}=${nowPc.extraStatus.dex + nowPc.status.dex}`}
          fieldProps={{ value: nowPc.status.dex }} />
        <ProFormDigit
          width="xs"
          name="vit"
          label="体质:"
          initialValue={nowPc.status.vit}
          addonAfter={`+ ${nowPc.extraStatus.vit}=${nowPc.extraStatus.vit + nowPc.status.vit}`}
          fieldProps={{ value: nowPc.status.vit }} />
        <ProFormDigit
          width="xs"
          name="int"
          label="智力:"
          initialValue={nowPc.status.int}
          addonAfter={`+${nowPc.extraStatus.int}=${nowPc.extraStatus.int + nowPc.status.int}`}
          fieldProps={{ value: nowPc.status.int }} />
        <ProFormDigit
          width="xs"
          name="wis"
          label="智慧:"
          initialValue={nowPc.status.wis}
          addonAfter={`+${nowPc.extraStatus.wis}=${nowPc.extraStatus.wis + nowPc.status.wis}`}
          fieldProps={{ value: nowPc.status.wis }} />
        <ProFormDigit
          width="xs"
          name="k"
          label="知识:"
          initialValue={nowPc.status.k}
          addonAfter={`+${nowPc.extraStatus.k}=${nowPc.extraStatus.k + nowPc.status.k}`}
          fieldProps={{ value: nowPc.status.k }} />
        <ProFormDigit
          width="xs"
          name="cha"
          label="魅力:"
          initialValue={nowPc.status.cha}
          addonAfter={`+${nowPc.extraStatus.cha}=${nowPc.extraStatus.cha + nowPc.status.cha}`}
          fieldProps={{ value: nowPc.status.cha }} />
        <ProFormText
          width="xs"
          name="img"
          label="图片链接:"
          initialValue={nowPc.img}
          fieldProps={{ value: nowPc.img }} />
      </ProForm.Group>
    </>
  )
}

export default (observer(PcStatusForm));
