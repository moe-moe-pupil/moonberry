import React, { useState } from 'react';
import { Button, message, Select, Space } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';
import Root, { ArgsTypes } from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import Skill from '@/stores/SkillStore';
import Pc from '@/stores/PcStore';
import Buff from '@/stores/BuffStore';
import { async } from '@antv/x6/lib/registry/marker/async';


const ExportModalBtn: React.FC = () => {
  const { RootStore }: Record<string, Root> = useStores();
  const [modalVisit, setModalVisit] = useState(false);
  const [tars, setTars] = useState<Pc[]>([]);
  function handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {

  }
  return (
    <ModalForm
      title={`导出设置`}
      onVisibleChange={setModalVisit}
      visible={modalVisit}
      trigger={
        <Button  onClick={void (0)}>
          导出
        </Button>
      }
      modalProps={{
        onCancel: () => {
          setTars([])
        }
      }}
      onFinish={async (values) => {
        //console.log(values)
        setModalVisit(false)
        values['pcIds'] = tars.map((tar)=>{return tar.Id})
        setTars([])
        RootStore.exportAllPcsByConfig(values['pcIds'])
        return true;
      }}
      width={800}
    >
      <ProForm.Group>
        <Select
          mode="multiple"
          placeholder="点击以设置导出Pl目标,不选默认全选"
          style={{ width: 327, overflow: 'auto' }}
          onChange={(values) => {
            const names = values?.valueOf()! as Array<string>
            const newTars: Pc[] = []
            names.map((name, idx) => {
              const newTar: Pc = RootStore.getPcByNickname(name) as Pc;
              newTars.push(newTar)
            });
            setTars(newTars);
          }}
          allowClear
          maxTagCount='responsive'
        >
          {RootStore.AllPcList.map(item => (
            <Select.Option key={item.Id} value={item.nickname} >
              {item.nickname +'——' + RootStore.dataObj[item.Id + '']}
            </Select.Option>
          ))}
        </Select>
      </ProForm.Group>
    </ModalForm>
  );
};

export default ExportModalBtn