import React, { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import { ProColumns, ActionType, EditableProTable } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';
import Root, { ArgsTypes, ISkillsPool, ISkillsPoolType, IUnitPool, ModalType } from '@/stores/RootStore';
import SkillsAddModal from './SkillsAddModal';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { skillEditModal } from '@/stores/GroupStore';
import ModalList from '@/component/chat/modal/ModalList';
import { async } from '@antv/x6/lib/registry/marker/async';
import SkillsEffectArgs from '@/component/table/SkillsEffectArgs';
import { toJS } from 'mobx';
import { getEnumKeysOrValue } from '@/utils/findObjectAttr';
import UnitAddModal from './UnitAddModal';

const Unit = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IUnitPool>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      copyable: true,
      ellipsis: true,
      tip: '单位名称',
      render: (_, record) => {
        return record.Pc.nickname
      },
      editable: false,
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
        <UnitAddModal btnName={'编辑'} uid={record.id} />,
        <Button onClick={(e) => { record.Pc.Id = RootStore.geneNPCId() }}>刷新Id</Button>
      ],
    },
  ];
  const { RootStore }: Record<string, Root> = useStores();
  function handleEdit(id: string) {
    const Modal: skillEditModal = {
      Id: id,
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
  }

  return (
    <>
      <ModalList />
      <ProTable<IUnitPool>
        columns={columns}
        actionRef={actionRef}
        dataSource={RootStore.unitPool}
        editable={{
          type: 'multiple',
          onDelete: async (k, r) => {
            RootStore.unitPoolDelById(r.id)
            actionRef.current?.reload()
          },
          onSave: async (k, r) => {
            const newPool: IUnitPool = {
              id: r.id,
              group: r.group,
              tags: r.tags,
              createdAt: r.createdAt,
              desc: r.desc,
              Pc: r.Pc
            }
            RootStore.setUnitPoolById(newPool)
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
        headerTitle="单位池编辑"
        toolBarRender={() => [
          <UnitAddModal btnName='新建单位池' />,
        ]} /></>
  );
};
export default (observer(Unit));