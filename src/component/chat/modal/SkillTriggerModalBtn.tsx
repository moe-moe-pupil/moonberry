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


const SkillTriggerModalBtn: React.FC<{ casterID: number, skill: Skill }> = ({ casterID, skill }) => {
  const { RootStore }: Record<string, Root> = useStores();
  const [modalVisit, setModalVisit] = useState(false);
  const [tars, setTars] = useState<Pc[]>([]);
  const nowPc = RootStore.getPcByQQNumber(casterID)
  function handleClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {

  }
  return (
    <ModalForm
      title={skill.name}
      onVisibleChange={setModalVisit}
      visible={modalVisit}
      trigger={
        <Button type="link" danger={skill.able && skill.cooldownLeft == 0 && nowPc && nowPc.mp >= skill.cost ? false : true} onClick={void (0)}>
          {`「${skill.name}」 冷却[${skill.cooldownLeft == 0 ? '就绪' : skill.cooldownLeft}] ${nowPc && nowPc.mp >= skill.cost ? `释放后剩余魔法${nowPc.mp - skill.cost}`:'魔法值不足'} `}
        </Button>
      }
      modalProps={{
        onCancel: () => {
          setTars([])
        }
      }}
      onFinish={async (values) => {
        if (tars.length == 0 && skill.target != 0) {
          message.error('此技能有目标要求,无法空放,请选择目标')
          return false
        } else {
          values['targetsID'] = tars.map((tar) => { return tar.Id })
          values['fromID'] = casterID
          console.log(values)
          RootStore.triggerSkill(skill, values)
          setModalVisit(false)
          setTars([])
          return true;
        }
      }}
      width={800}
    >
      <ProForm.Group>
        <Select
          mode="multiple"
          placeholder="点击以设置技能目标"
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
          {tars.length < skill.target ? RootStore.AllPcList.map(item => (
            <Select.Option key={item.Id} value={item.nickname}>
              {item.nickname}
            </Select.Option>
          )) : void (0)}
        </Select>
        <ProFormText
          width="xs"
          name="effect"
          disabled
          label=""
          initialValue={skill.buffMachine['技能释放'] ? skill.buffMachine['技能释放'].map((buff: Buff) => {
            return (buff.effect.join(', '))
          }).join(', ') : '无效果'}
        />
      </ProForm.Group>
      <ProForm.Group>
        {skill.args.map((arg) => {
          switch (arg.type) {
            case ArgsTypes.string:
              return (
                <ProFormText
                  width="xs"
                  name={arg.name}
                  label={arg.name}
                  initialValue={arg.value}
                />
              )
            case ArgsTypes.number:
              return (
                <ProFormDigit
                  width="xs"
                  name={arg.name}
                  label={arg.name}
                  initialValue={arg.value}
                />
              )
            default:
              return (
                <ProFormText
                  width="xs"
                  name={arg.name}
                  disabled
                  label={arg.name}
                  initialValue={arg.value}
                />
              )
          }
        })}
      </ProForm.Group>
    </ModalForm>
  );
};

export default SkillTriggerModalBtn