import React, { useState } from 'react';
import { Button, message, Tabs } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormGroup,
  ProFormRadio,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import Root, { IRandomItem } from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { OptionsType } from 'rc-select/lib/interface';
import type { ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import Pc from '@/stores/PcStore';
import PcStatusForm from '@/component/chat/form/PcStatusForm';
import PcSkillForm from '@/component/chat/form/PcSkillForm';
import PcSkill from '@/component/chat/modal/PcSkill';

const { TabPane } = Tabs;

const UnitAddModal: React.FC<{ btnName: string, uid?: string }> = ({ btnName, uid }) => {
  const { RootStore }: Record<string, Root> = useStores();
  const groupsOption: any = []
  const nowUnitPool = uid ? RootStore.getUnitById(uid) : undefined
  const nowPc: Pc = uid && nowUnitPool ? nowUnitPool.Pc : new Pc()
  if(uid && nowUnitPool) {
    nowPc.Id = RootStore.geneNPCId()
  }
  RootStore.groups.map((group, idx) => {
    const newOption = {
      value: idx,
      label: group.name
    }
    groupsOption.push(newOption)
  })
  return (
    <ModalForm<{
      name: string;
      group: number;
      tags: string;
      desc: string;
      pc: Pc;
    }>
      title={nowUnitPool ? nowUnitPool.Pc.nickname : "新建单位池"}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          {btnName}
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
      }}
      onValuesChange={(cv, v) => {
        for (var i in cv) {
          RootStore.setPcValues(nowPc, i, cv[i] == '' && typeof cv[i] != 'boolean' ? 0 : cv[i]);
          console.log(cv[i], typeof cv[i], nowPc)
        }
      }}
      onFinish={async (values) => {
        RootStore.unitPoolAdd(values.group, values.tags, values.desc, nowPc, uid)
        //console.log(values);
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          width="xs"
          options={groupsOption}
          name="group"
          label="对应团"
          initialValue={nowUnitPool ? nowUnitPool.group : 0}
        />
      </ProForm.Group>
      <ProFormText
        width="md"
        name="tags"
        label="单位标签"
        tooltip="仅仅只是显示，并无实际作用，空格分隔tag"
        placeholder="请输入标签"
        initialValue={nowUnitPool ? nowUnitPool.tags : ""}
      />
      <ProFormText
        width="md"
        name="desc"
        label="单位池描述"
        tooltip="简单描述一下单位"
        placeholder="请输入单位池描述"
        initialValue={nowUnitPool ? nowUnitPool.desc : ""}
      />
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="属性" key="1">
          <PcStatusForm nowPc={nowPc} />
          <ProFormCheckbox
            width="md"
            name="isElite"
            label="精英单位?"
            tooltip="精英单位有固定等级而不是动态等级,并且被视同为玩家"
            initialValue={nowPc.isElite}
            fieldProps={{ value: nowPc.isElite }}
          />
        </TabPane>
        <TabPane tab="技能" key="2">
          <PcSkill inited={true} Pc={nowPc}/>
        </TabPane>
      </Tabs>

    </ModalForm>
  );
};

export default UnitAddModal