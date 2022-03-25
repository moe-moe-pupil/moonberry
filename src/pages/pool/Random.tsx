import React, { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';
import Root, { ArgsTypes, IRandomPool, ISkillsPool, ISkillsPoolType, ModalType } from '@/stores/RootStore';
import SkillsAddModal from './SkillsAddModal';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { skillEditModal } from '@/stores/GroupStore';
import ModalList from '@/component/chat/modal/ModalList';
import { async } from '@antv/x6/lib/registry/marker/async';
import SkillsEffectArgs from '@/component/table/SkillsEffectArgs';
import { toJS } from 'mobx';
import { getEnumKeysOrValue } from '@/utils/findObjectAttr';
import RandomAddModal from './RandomAddModal';
import RandomModalBtn from './randomModalBtn';

const RandomPool = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IRandomPool>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: '随机逻辑的名称',
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
      title: 'ID',
      dataIndex: 'id',
      copyable: true,
      filters: true,
      onFilter: true,
      editable: false,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.tags ? record.tags.split(' ').map((tag) => (
            <Tag color='blue' key={record.id}>
              {tag}
            </Tag>
          )) : void (0)}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'desc',
      copyable: true,
      ellipsis: true,
      tip: '大致效果描述',
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <RandomModalBtn IRandomItems={record.IRandomItem}/>
      ],
    },
  ];
  const { RootStore }: Record<string, Root> = useStores();

  return (
    <><ProTable<IRandomPool>
      columns={columns}
      actionRef={actionRef}
      dataSource={RootStore.randomPool}
      editable={{
        type: 'multiple',
        onDelete: async (k, r) => {
          RootStore.skillsPoolDelById(r.id)
          actionRef.current?.reload()
        },
        onSave: async (k, r) => {
          const newPool: IRandomPool = {
            id: r.id,
            name: r.name,
            group: r.group,
            tags: r.tags,
            createdAt: r.createdAt,
            desc: r.desc,
            IRandomItem: r.IRandomItem
          }
          RootStore.setRandomsPoolById(newPool)
          console.log(k, r)
        }
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
      }}
      dateFormatter="string"
      headerTitle="随机池编辑"
      toolBarRender={() => [
        <RandomAddModal/>
      ]} /></>
  );
};
export default (observer(RandomPool));