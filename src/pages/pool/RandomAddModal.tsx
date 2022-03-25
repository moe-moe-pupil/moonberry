import React, { useState } from 'react';
import { Button, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormGroup,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import Root, { IRandomItem } from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { OptionsType } from 'rc-select/lib/interface';
import type { ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';

export default () => {
  const { RootStore }: Record<string, Root> = useStores();
  const groupsOption: any = []
  const columns: ProFormColumnsType<IRandomItem>[] = [
    {
      title: '随机项',
      valueType: 'formList',
      dataIndex: 'IRandomItems',
      columns: [
        {
          valueType: 'group',
          columns: [
            {
              title: '随机名',
              dataIndex: 'key',
              formItemProps: {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                  },
                ],
              },
            },
            {
              title: '描述',
              dataIndex: 'RandomItemDesc',
              valueType:'textarea',
              formItemProps: {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                  },
                ],
              },
            },
            {
              title: '最少出现',
              dataIndex: 'min',
              valueType: 'digit',
              formItemProps: {
                /*
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                    min: 0,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('max') >= value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('最多出现次数必须大于最少出现次数'));
                    },
                  }),
                ],
                * */
              },
            },
            {
              title: '最多出现',
              dataIndex: 'max',
              valueType: 'digit',
            }
          ]
        }
      ]
    }
  ];
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
      IRandomItems: IRandomItem[]
    }>
      title="新建随机池"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建随机池
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        RootStore.randomPoolAdd(values.name, values.group, values.tags, values.desc, values.IRandomItems)
        //console.log(values);
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="随机池名称"
          tooltip="随机池的名称"
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
        label="随机池标签"
        tooltip="仅仅只是显示，并无实际作用，空格分隔tag"
        placeholder="请输入标签"
      />
      <ProFormText
        width="md"
        name="desc"
        label="随机池描述"
        tooltip="简单描述一下随机内容"
        placeholder="请输入随机池描述"
      />
      <ProFormGroup>
        <BetaSchemaForm<IRandomItem>
          layoutType="Embed"
          columns={columns}
        />
      </ProFormGroup>
    </ModalForm>
  );
};