import Pc from '@/stores/PcStore';
import Root from '@/stores/RootStore';
import { message, Button } from 'antd';
import { SkillTargetEnum, SkillTypeEnum } from '@/stores/SkillStore';
import { useStores } from '@/utils/useStores';
import ProForm, { ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { inject, observer } from 'mobx-react';
import { OptionsType } from 'rc-select/lib/interface';
import React, { useState } from 'react'
import ExchangeRefuse from './ExchangeRefuse';
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
interface IPcExchange {
  qqNumber: number,
  idx: number;
}

const PcStatus = ({ qqNumber, idx }: IPcExchange) => {
  const { RootStore }: Record<string, Root> = useStores();
  function handleAccept(idx: number) {
    RootStore.setSkillInited(qqNumber, idx)
  }
  return (
    <>
      {[RootStore.getPcByQQNumber(qqNumber, idx) as Pc].map((item) => {
        return (
          <ProForm
            onFinish={async (values) => {
              console.log(values);
            }}
            onValuesChange={
              (changeValues, values) => {
                for (i in changeValues) {
                  //console.log(changeValues)
                  RootStore.setPcValues(item, i, changeValues[i]);
                }
              }
            }
            submitter={{
              render: (props, doms) => {
                return [
                  <Button htmlType="button" danger onClick={(e) => { }} type='primary' key="accept">
                    删除
                  </Button>,
                ];
              },
            }}
          >
            <ProFormText
              name="nickname"
              label="名称"
              placeholder="请输入名称"
              initialValue={item.nickname}
              fieldProps={{ value: item.nickname }}
            />
            <ProForm.Group>
              <ProFormDigit
                width="xs"
                name="lv"
                label="等级:"
                min={1}
                fieldProps={{ value: item.lv }}
              />
              <ProFormDigit
                addonAfter={` / ${geneMaxExp(item.lv)}`}
                width="xs"
                name="exp"
                label="经验值:"
                min={0}
                fieldProps={{ value: item.exp }}
              />
              <ProFormDigit
                width="xs"
                name="exchangePoint"
                label="兑换分数:"
                min={0}
                fieldProps={{ value: item.exchangePoint }}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDigit
                addonAfter="/"
                width="xs"
                name="hp"
                label={<>生命: <Text keyboard type='danger'>{RootStore.formatHPStatus(item.hp, item.maxHP)}</Text></>}
                min={0}
                max={item.maxHP}
                initialValue={item.hp}
                fieldProps={{ value: item.hp }}
              />
              <ProFormDigit
                width="xs"
                name="maxHP"
                label="最大生命:"
                min={0}
                initialValue={item.maxHP}
                fieldProps={{ value: item.maxHP }}
              />
              <ProFormText
                width="xs"
                name="hpReg"
                label="日常回复"
                initialValue={item.hpReg}
                fieldProps={{ value: item.hpReg }}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDigit
                addonAfter="/"
                width="xs"
                name="mp"
                label="魔法:"
                min={0}
                max={item.maxMP}
                fieldProps={{ value: item.mp }}
              />
              <ProFormDigit
                width="xs"
                name="maxMP"
                label="最大魔法:"
                min={0}
                initialValue={item.maxMP}
                fieldProps={{ value: item.maxMP }}
              />
              <ProFormText
                width="xs"
                name="mpReg"
                label="日常回复"
                initialValue={item.mpReg}
                fieldProps={{ value: item.mpReg }}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                width="xs"
                name="speed"
                label="移动速度"
                initialValue={item.speed}
                fieldProps={{ value: item.speed }}
              />
              <ProFormText
                width="xs"
                name="DMGModify"
                label="伤害增减"
                initialValue={item.DMGModify}
                fieldProps={{ value: item.DMGModify }}
              />
              <ProFormText
                width="xs"
                name="healModify"
                label="治疗增减"
                initialValue={item.healModify}
                fieldProps={{ value: item.healModify }}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDigit
                width="xs"
                name="str"
                label="力量:"
                initialValue={item.status.str}
                addonAfter={`+${item.extraStatus.str}=${item.extraStatus.str + item.status.str}`}
                fieldProps={{ value: item.status.str }}
              />
              <ProFormDigit
                width="xs"
                name="agi"
                label="敏捷:"
                initialValue={item.status.agi}
                addonAfter={`+${item.extraStatus.agi}=${item.extraStatus.agi + item.status.agi}`}
                fieldProps={{ value: item.status.agi }}
              />
              <ProFormDigit
                width="xs"
                name="dex"
                label="灵巧:"
                initialValue={item.status.dex}
                addonAfter={`+${item.extraStatus.dex}=${item.extraStatus.dex + item.status.dex}`}
                fieldProps={{ value: item.status.dex }}
              />
              <ProFormDigit
                width="xs"
                name="vit"
                label="体质:"
                initialValue={item.status.vit}
                addonAfter={`+ ${item.extraStatus.vit}=${item.extraStatus.vit + item.status.vit}`}
                fieldProps={{ value: item.status.vit }}
              />
              <ProFormDigit
                width="xs"
                name="int"
                label="智力:"
                initialValue={item.status.int}
                addonAfter={`+${item.extraStatus.int}=${item.extraStatus.int + item.status.int}`}
                fieldProps={{ value: item.status.int }}
              />
              <ProFormDigit
                width="xs"
                name="wis"
                label="智慧:"
                initialValue={item.status.wis}
                addonAfter={`+${item.extraStatus.wis}=${item.extraStatus.wis + item.status.wis}`}
                fieldProps={{ value: item.status.wis }}
              />
              <ProFormDigit
                width="xs"
                name="k"
                label="知识:"
                initialValue={item.status.k}
                addonAfter={`+${item.extraStatus.k}=${item.extraStatus.k + item.status.k}`}
                fieldProps={{ value: item.status.k }}
              />
              <ProFormDigit
                width="xs"
                name="cha"
                label="魅力:"
                initialValue={item.status.cha}
                addonAfter={`+${item.extraStatus.cha}=${item.extraStatus.cha + item.status.cha}`}
                fieldProps={{ value: item.status.cha }}
              />
              <ProFormText
                width="xs"
                name="img"
                label="图片链接:"
                initialValue={item.img}
                fieldProps={{ value: item.img }}
              />
            </ProForm.Group>
          </ProForm>
        )
      })}
    </>
  )
}
export default (observer(PcStatus));
