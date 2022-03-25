import React, { useState } from "react";
import { Item } from "@/component/chat/ChatListItem";
import ProForm, {
  StepsForm,
  ProFormText,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormCheckbox,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Popover, Button, message, Modal, Form, Upload, UploadProps } from 'antd';
import { useStores } from '@/utils/useStores';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { EditableProTable, ProColumns } from "@ant-design/pro-table";
import styled from "styled-components";
import { format } from "prettier";
import { RcFile as OriRcFile, UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import Group, { basicConfig, basicConfigEnum, GroupProps, onlyReadBasicConfig } from "@/stores/GroupStore";
import { MiraiWarn } from "@/stores/RootStore";
import { newpane } from "@/stores";
import { getEnumKeysOrValue, setValue } from "@/utils/findObjectAttr";

const group: Group = new Group()

function doImgUpload(options: any) {
  const { onSuccess, onError, file, onProgress } = options;
  const reader = new FileReader();
  reader.readAsDataURL(file); // 读取图片文件

  reader.onload = (file) => {
    const params = {
      myBase64: file.target?.result, // 把 本地图片的base64编码传给后台，调接口，生成图片的url
    };
    group.picBase64 = params.myBase64
  }
}

type DataSourceType = {
  id: React.Key;
  name?: string;
  decs?: string;
  qqNumber?: number;
  created_at?: string;
  children?: DataSourceType[];
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: 'pl昵称',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: 'qq号',
    dataIndex: 'qqNumber',
  },
  {
    title: '描述',
    dataIndex: 'decs',
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export default () => {
  const { RootStore } = useStores();
  const [visible, setVisible] = useState(false)
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>()
  const basicConfigObj = onlyReadBasicConfig()
  const basicConfigKeys = getEnumKeysOrValue(basicConfigEnum, true, true) as string[]
  const basicConfigValues = getEnumKeysOrValue(basicConfigEnum, false, true) as string[]
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        <PlusOutlined />
        新建团
      </Button>
      <Button
        style={{
          margin: 8,
        }}
        onClick={() => {

        }}>
        导入团
      </Button>
      <Button
        style={{
          margin: 8,
        }}
        onClick={() => {

        }}>
        导出团
      </Button>

      <Popover
        content={
          <Button
            style={{
              margin: 8,
            }}
            onClick={() => {
              RootStore.groupReset();
            }}>
            重置团
          </Button>}
        title="确认要重置吗？这极其危险而且不会自动备份"
        trigger="click"
      >
        <Button type="primary" danger>重置团</Button>
      </Popover>
      <StepsForm
        onFinish={async (values) => {
          console.log(values);
          await waitTime(10);
          for (var i in values) {
            setValue(group, i, values[i], '')
          }
          RootStore.groupAdd(group)
          message.success('提交成功');
          return true;
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title="创世的开始"
              width={1200}
              onCancel={() => setVisible(false)}
              visible={visible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >

        <StepsForm.StepForm
          name="base"
          title="描述你的团"
          onFinish={async () => {
            await waitTime(10);
            return true;
          }}
        >
          <ProCard
            title="团名和描述"
            bordered
            headerBordered
            collapsible
            style={{
              marginBottom: 16,
              minWidth: 800,
              maxWidth: '100%',
            }}
          >
            <ProFormText
              name="name"
              width="md"
              label="团名称"
              tooltip="既然给了名字，就请珍重哦"
              placeholder="给你的团起个名字吧"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="description"
              width="md"
              label="团描述"
              tooltip="这里可以随意一些，关于这个团的类型啊或是其他的什么..."
              placeholder="描述一下大致是怎样的团"
              rules={[{ required: true }]}
            />
          </ProCard>

          <ProCard
            title="团属性设置"
            bordered
            headerBordered
            collapsible
            style={{
              minWidth: 800,
              marginBottom: 16,
            }}
          >
            <ProForm.Group title="属性" size={8}>
              {basicConfigKeys.map((key, idx) => {
                return (
                  <ProFormDigit
                    name={key}
                    label={basicConfigValues[idx]}
                    initialValue={basicConfigObj[key]}
                    width="xs"
                    rules={[{ required: true }]}
                  />
                )
              })}
            </ProForm.Group>
          </ProCard>
          <Form.Item label="背景图">
            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle rules={[{ required: true }]}>
              <Upload.Dragger name="files" action="/upload.do" customRequest={doImgUpload}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击上传或拖拽图片以设置团背景图</p>
                <p className="ant-upload-hint">支持单个或批量上传.</p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="checkbox" title="pl导入">
          <ProCard
            style={{
              minWidth: 800,
              marginBottom: 16,
              maxWidth: '100%',
            }}
          >
            <ProForm.Item
              label="数组数据"
              name="dataSource"
              trigger="onValuesChange"
            >
              <EditableProTable<DataSourceType>
                rowKey="id"
                toolBarRender={false}
                columns={columns}
                recordCreatorProps={{
                  newRecordType: 'dataSource',
                  position: 'top',
                  record: () => ({
                    id: Date.now(),
                  }),
                }}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  actionRender: (row, _, dom) => {
                    return [dom.delete];
                  },
                }}
              />
            </ProForm.Item>
          </ProCard>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="st描述和开幕导入词"
          onFinish={async () => {
            await waitTime(10);
            setVisible(false)
            return true;
          }}
        >
          <ProCard
            style={{
              marginBottom: 16,
              minWidth: 800,
              maxWidth: '100%',
            }}
          >
            <ProFormText name="stDesc" tooltip="这个就不是关于团的了，你可以写写自己的风格" placeholder="描述一下你自己~" label="st描述" width="xl" />
            <ProFormTextArea name="miraiWarn" tooltip="此声明在每次开团时会自动发送给所有PL，并且不得以任何方式取消发送，如果发生BUG，请提交详情至Issue" disabled label="禁止商业使用声明"
              fieldProps={{ rows: 12 }}
              initialValue={MiraiWarn}
              width='xl' />
            <ProFormTextArea name="guide" tooltip="仅在第一次开团时会自动发送的引入词。通常是交代大背景，而不是用来做特定角色的剧情" placeholder="描述一下剧情世界的大背景"
              fieldProps={{ autoSize: true }} width='xl' />
          </ProCard>
        </StepsForm.StepForm>

      </StepsForm>

    </>
  );
};