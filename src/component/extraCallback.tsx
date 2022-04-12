import { useStores } from "@/utils/useStores";
import { FC } from "@umijs/renderer-react/node_modules/@types/react";
import { Button, Modal } from "antd";
import { inject, observer } from "mobx-react";
import React, { useState } from "react";
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormCheckbox, ProFormDatePicker, ProFormDateTimePicker, ProFormSelect, ProFormText, ProFormTextArea, StepsForm } from "@ant-design/pro-form";
import GroupAddModel from "./group/groupAddModel";
import Root from "@/stores/RootStore";
import Pc from "@/stores/PcStore";
import Chat from "@/stores/ChatStore";
import { Item } from "./chat/ChatListItem";
import ExportModalBtn from "./export/ExportModalBtn";


const ExtraCallback: React.FC<{ localPath: string }> = (props: { localPath: string }) => {
  const { RootStore }: Record<string, Root> = useStores();
  switch (props.localPath) {
    case '/':
      return (
        <>
          <Button>
          </Button>
        </>
      )
    case '/commander/group/groupManage':
      return (<>
        <Upload beforeUpload={async (file) => {
          const isText = file.type === 'text/plain';
          if (!isText) {
            message.error(`${file.name}不是txt文件`);
          } else {
            const nowObj = JSON.parse(await file.text())
            if (RootStore.instanceOfRoot(nowObj)) {
              const nowRoot = nowObj as Root
              RootStore.importRoot(nowRoot)
            } else {
              message.error(`${file.name}并不是合法的导入文件，请检查。`);
            }
          }
          return isText || Upload.LIST_IGNORE;
        }}
          maxCount={1}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>导入所有</Button>
        </Upload>
        <Upload beforeUpload={async (file) => {
          const isText = file.type === 'text/plain';
          if (!isText) {
            message.error(`${file.name}不是txt文件`);
          } else {
            const nowObj = JSON.parse(await file.text())
            if (true) {
              RootStore.importAllByConfig(nowObj)
            } else {
              message.error(`${file.name}并不是合法的导入文件，请检查。`);
            }
          }
          return isText || Upload.LIST_IGNORE;
        }}
          maxCount={1}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>导入</Button>
        </Upload>
        <ExportModalBtn/>
        <Button danger onClick={(e) => { RootStore.deleteAllNpc() }} >删除当前团所有NPC</Button>
        <Button danger onClick={(e) => { RootStore.updateAllObj() }} >开发功能:更新</Button>
        <Button onClick={(e) => { RootStore.skillsPoolClear() }} >重置技能效果池</Button>
        <Button danger onClick={(e) => { RootStore.createAllPcInUE4() }} >创建所有pc</Button>
        <GroupAddModel />
      </>)
    case '/commander/pool':
      return (<>

      </>)
    default:
      return (<></>)
  }
};
export default observer(ExtraCallback)//inject('RootStore')(observer(ExtraCallback));
