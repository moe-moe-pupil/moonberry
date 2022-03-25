import React from 'react';
import { Button, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { OptionsType } from 'rc-select/lib/interface';


export default () => {
  const {RootStore}:Record<string, Root> = useStores();
  const groupsOption:any = []
  RootStore.groups.map((group, idx)=>{
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
    }>
      title="新建技能效果"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建技能效果
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        RootStore.skillsPoolAdd(values.name, values.group, values.tags)
        //console.log(values);
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="技能效果名称"
          tooltip="并不是技能名称"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="xs"
          options={groupsOption}
          name="group"
          label="对应团"
        />
      </ProForm.Group>
      <ProFormText
          width="md"
          name="tags"
          label="技能效果标签"
          tooltip="仅仅只是显示，并无实际作用，空格分隔tag"
          placeholder="请输入标签"
        />
    </ModalForm>
  );
};