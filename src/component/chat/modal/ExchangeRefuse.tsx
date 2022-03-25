import React, { useState } from 'react';
import { Button, message, Space } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
interface ExchangeProps {
  qqNumber: number,
  skillName: string
}


export default ({ qqNumber, skillName }: ExchangeProps) => {
  const { RootStore }: Record<string, Root> = useStores();
  const [modalVisit, setModalVisit] = useState(false);
  function handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    RootStore.ezSendText(qqNumber, [
      `您的「${skillName}」兑换被拒绝\n`,
      `理由: ${e.currentTarget.innerText}`
    ])
    RootStore.delSkillByName(qqNumber, skillName);
    setModalVisit(false)
  }
  return (
    <ModalForm
      title="拒绝"
      onVisibleChange={setModalVisit}
      visible={modalVisit}
      trigger={
        <Button danger type="primary">
          拒绝
        </Button>
      }
      modalProps={{
        //onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        RootStore.ezSendText(qqNumber, [
          `您的「${skillName}」兑换被拒绝\n`,
          `理由: ${values.reason}`
        ])
        RootStore.delSkillByName(qqNumber, skillName);
        setModalVisit(false)
        return true;
      }}
      width={800}
    >
      <Space size={[8, 16]} wrap>
        <Button onClick={handleClick}>
          过于超模
        </Button>
        <Button onClick={handleClick}>
          难以实现
        </Button>
        <Button onClick={handleClick}>
          过于弱了
        </Button>
        <Button onClick={handleClick}>
          描述不清晰
        </Button>
        <Button onClick={handleClick}>
          你付不起这个代价...这对你来说太贵了...
        </Button>
        <Button danger onClick={handleClick}>
          这个拒绝原因通常不会出现，除非st铁了心要按这个按钮，这意味着st对你的兑换感到了极大的...不满
        </Button>
        <ProFormTextArea
          width="md"
          name="reason"
          label="自定义理由"
          tooltip="请尽可能文明一点"
          placeholder="请输入名称"
        />
      </Space>
    </ModalForm>
  );
};