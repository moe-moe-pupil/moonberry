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
import Root, { ArgsTypes, IRandomItem } from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import Skill from '@/stores/SkillStore';
import Pc from '@/stores/PcStore';
import Buff from '@/stores/BuffStore';
import { async } from '@antv/x6/lib/registry/marker/async';
export interface CheckedRandomItem {
  to: number,
  msg: string,
}

const RandomModalBtn: React.FC<{IRandomItems:IRandomItem[]}> = ({IRandomItems}) => {
  const { RootStore }: Record<string, Root> = useStores();
  const [nowRandom, setNowRandom] = useState<CheckedRandomItem[]>(RootStore.geneRandomResult([], IRandomItems))
  const [modalVisit, setModalVisit] = useState(false);
  const [tars, setTars] = useState<Pc[]>([]);
  function handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {

  }
  return (
    <ModalForm
      title={`发送设置`}
      onVisibleChange={setModalVisit}
      visible={modalVisit}
      trigger={
        <Button type='link' onClick={void (0)}>
          发送
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
        values['pcIds'] = tars.map((tar) => { return tar.Id })
        setTars([])
        RootStore.sendCheckedRndResults(nowRandom)
        return true;
      }}
      width={800}
    >
      <ProForm.Group>
        <Select
          mode="multiple"
          placeholder="点击以设置发送Pl目标,不选默认全选"
          style={{ width: 327, overflow: 'auto' }}
          onChange={(values) => {
            const names = values?.valueOf()! as Array<string>
            const newTars: Pc[] = []
            names.map((name, idx) => {
              const newTar: Pc = RootStore.getPcByNickname(name) as Pc;
              newTars.push(newTar)
            });
            setTars(newTars);
            setNowRandom(RootStore.geneRandomResult([], IRandomItems))
          }}
          allowClear
          maxTagCount='responsive'
        >
          {RootStore.AllPcList.map(item => (
            <Select.Option key={item.Id} value={item.nickname} >
              {item.nickname + '——' + item.Id}
            </Select.Option>
          ))}
        </Select>
      </ProForm.Group>
      {JSON.stringify(nowRandom)}
    </ModalForm>
  );
};

export default RandomModalBtn