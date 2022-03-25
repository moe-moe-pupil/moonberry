import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import FormatIndentDecreaseOutlinedIcon from '@mui/icons-material/FormatIndentDecreaseOutlined';
import { message, Select, Checkbox } from 'antd';
import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores';
import { inject, observer } from 'mobx-react';
import {
  ModalForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-form';
import { useState } from 'react';
import Pc from '@/stores/PcStore';
import { FileWordOutlined } from '@ant-design/icons';

const ChatSD = () => {
  const { RootStore }: Record<string, Root> = useStores();
  const [TeamVis, setTeamVis] = useState(false);
  const [WorldVis, setWorldVis] = useState(false);
  const [pcs, setPcs] = useState<Pc[]>([]);
  const [worldPcs, setWorldPcs] = useState<number[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [nemo, setNemo] = useState(false);
  function backTop() { document.querySelector("#root > div > div > section > div.ant-layout > main > div > div.ant-pro-grid-content > div > div > div:nth-child(1) > div > div > div > div > aside > div > section > div.ant-layout > main > div > div.ant-pro-grid-content > div > div > div > div > div > div")!.scrollTop = 0 };
  function showTeamModal() {
    setTeamVis(true);
  }
  function showWorldModal() {
    setWorldVis(true);
  }
  const actions = [
    { icon: <VerticalAlignTopIcon />, name: '回到顶部', handleClick: backTop },
    { icon: <FormatIndentDecreaseOutlinedIcon />, name: '新建频道', handleClick: showTeamModal },
    { icon: <FileWordOutlined />, name: '新建世界', handleClick: showWorldModal },
  ];
  return (
    <>
      <ModalForm
        title="新建区域(虚拟讨论组)"
        visible={TeamVis}
        modalProps={{
          onCancel: () => setTeamVis(false),
        }}
        onFinish={async (values) => {
          //console.log(JSON.stringify(values), pcs);
          RootStore.teamAdd(values.name, pcs, allowRepeat, nemo)
          message.success('创建成功');
          setTeamVis(false);
          setPcs([]);
          return true;
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="频道名称"
          tooltip="频道名称，像是A队，B队什么的"
          placeholder="请输入区域名称"
          rules={[{ required: true }]}
        />
        <Checkbox onChange={(e) => setAllowRepeat(e.target.checked)} name="allowRepeat">
          允许PC重复出现
        </Checkbox><br />
        <Checkbox onChange={(e) => setNemo(e.target.checked)} name="nemo">
          匿名频道
        </Checkbox><br />
        <Select
          mode="multiple"
          placeholder="点击以设置频道内PC"
          style={{ width: 327, overflow: 'auto' }}
          onChange={(values) => {
            const names = values?.valueOf()! as Array<string>
            const newPcs: Pc[] = []
            names.map((name, idx) => {
              const newPc: Pc = RootStore.getPcByNickname(name) as Pc;
              newPcs.push(newPc)
            });
            setPcs(newPcs);
          }}
          allowClear
          maxTagCount='responsive'
        >
          {allowRepeat ? RootStore.AllPcList.map(item => (
            <Select.Option key={item.Id} value={item.nickname}>
              {item.nickname}
            </Select.Option>
          )) : RootStore.AllNoTeamPcList.map(item => (
            <Select.Option key={item.Id} value={item.nickname}>
              {item.nickname}
            </Select.Option>))}
        </Select>
      </ModalForm>
      {/*/世界/*/}
      <ModalForm
        title="新建世界"
        visible={WorldVis}
        modalProps={{
          onCancel: () => setWorldVis(false),
        }}
        onFinish={async (values) => {
          //console.log(JSON.stringify(values), pcs);
          RootStore.worldAdd(values.name, worldPcs, allowRepeat)
          message.success('创建成功');
          setWorldVis(false);
          setWorldPcs([]);
          return true;
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="世界名称"
          tooltip="世界名称"
          placeholder="请输入世界名称"
          rules={[{ required: true }]}
        />
        <Checkbox onChange={(e) => setAllowRepeat(e.target.checked)} name="allowRepeat">
          允许PC重复出现
        </Checkbox><br />
        <Select
          mode="multiple"
          placeholder="点击以设置世界内PC"
          style={{ width: 327, overflow: 'auto' }}
          onChange={(values) => {
            const numbers = values?.valueOf()! as Array<number>
            const newWorldPcs: number[] = []
            setWorldPcs(numbers)
          }}
          allowClear
          maxTagCount='responsive'
        >
          {allowRepeat ? RootStore.AllPcList.map(item => (
            <Select.Option key={item.Id} value={item.Id}>
              {item.nickname}
            </Select.Option>
          )) : RootStore.AllNoWorldPcList.map(item => (
            <Select.Option key={item.Id} value={item.Id}>
              {item.nickname}
            </Select.Option>))}
        </Select>
      </ModalForm>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 124, right: 48 }}
        icon={<SpeedDialIcon />}
        direction='left'
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handleClick ? action.handleClick : void (0)} />
        ))}
      </SpeedDial>

    </>
  );
}
export default (observer(ChatSD))
