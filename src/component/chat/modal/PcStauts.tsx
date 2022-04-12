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
import PcStatusForm from '../form/PcStatusForm';

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
                for (var i in changeValues) {
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
            <PcStatusForm nowPc={item} />
          </ProForm>
        )
      })}
    </>
  )
}
export default (observer(PcStatus));
