import React, { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';
import Root, { ArgsTypes, formatType, ISkillsPool, ISkillsPoolType, ModalType } from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import { skillEditModal } from '@/stores/GroupStore';
import ModalList from '@/component/chat/modal/ModalList';
import { async } from '@antv/x6/lib/registry/marker/async';
import SkillsEffectArgs from '@/component/table/SkillsEffectArgs';
import { toJS } from 'mobx';
import { getEnumKeysOrValue } from '@/utils/findObjectAttr';
import Pc from '@/stores/PcStore';
import { exchangeType, statusType, Zh_statusType } from '@/api/handle/exchangeHandle';
import { TargetEnum } from '@/stores/BuffStore';
const postPcsData = (Pcs: Pc[]) => {
  const newPcs: Pc[] = []
  Pcs.map((pc) => {
    const newPc = Object.assign(TargetEnum)
  })
  return
}
const PcOverview = () => {
  const actionRef = useRef<ActionType>();
  const { RootStore }: Record<string, Root> = useStores();
  const returnCols: ProColumns<Pc>[] = []
  for (var i = exchangeType.str; i <= exchangeType.cha; i++) {
    const nowType = statusType[i]
    const returnCol: ProColumns<Pc> =
    {
      title: Zh_statusType[i],
      dataIndex: nowType ,
      search: false,
      sorter:(a:Pc, b:Pc)=>{
        return a.totalStatus[nowType] - b.totalStatus[nowType]
      },
      render: (_, record, idx, undefined, {
        dataIndex, sorter, showSorterTooltip
      }) => {
        showSorterTooltip = true
        return (
          record.totalStatus[dataIndex as string]
        )
      },
    }
    returnCols.push(returnCol)
  }
  const columns: ProColumns<Pc>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '??????',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: 'pl??????',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
    },

    {
      title: '????????????',
      dataIndex: 'nickname',
      copyable: true,
      ellipsis: true,
      tip: 'pc??????????????????',
    },
    {
      title: 'Id',
      dataIndex: 'Id',
      copyable: true,
      filters: true,
      onFilter: true,
      editable: false,
    },
    ...returnCols,
    {
      title: '??????',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.Id);
          }}
        >
          ??????
        </a>,
      ],
    },
  ];
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
    <><ModalList /><ProTable<Pc>
      columns={columns}
      actionRef={actionRef}
      dataSource={RootStore.AllPcList}
      editable={{
        type: 'multiple',
        onDelete: async (k, r) => {
          actionRef.current?.reload()
        },
        onSave: async (k, r) => {
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
        // ??????????????? transform????????????????????????????????????????????????????????????
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
      headerTitle="????????????"
      toolBarRender={() => [
      ]} /></>
  );
};
export default (observer(PcOverview));