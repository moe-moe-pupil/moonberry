import {
  Input,
  Button,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
  Cascader,
  Tooltip,
  Space,
  Form
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import Root, { ArgsTypes, IArgs } from '@/stores/RootStore';
import { inject, observer } from 'mobx-react';
import { useStores } from '@/utils/useStores';
import { values } from 'mobx';

const { Option } = Select;


interface ISkillsEffectArgs {
  id: string,
  args: IArgs,
  idx: number,
}

const SkillsEffectArgs: React.FC<{ idx: number, value?: IArgs[]; onChange?: (value: IArgs[]) => void; }> = ({ idx, value, onChange }) => {
  const { RootStore }: Record<string, Root> = useStores();
  const newValues = value?.slice() || []
  const options: any = []
  const handleChange = (cv: any, v: any, idx: number) => {
    const newIArgs: IArgs = {
      name: v.name,
      type: v.type,
      value: v.value
    }
    newValues[idx] = newIArgs
    onChange?.(newValues)
  }
  var extraContent = <></>
  for (var i in ArgsTypes) {
    var kv: any = i
    if (isNaN(kv)) {
      var argsAnyType: any = ArgsTypes[i];
      var argsEnum: ArgsTypes = argsAnyType;
      options.push(<Option value={argsEnum}>{argsEnum}</Option>)
    }
  }
  return (
    <Space>
      {(RootStore.skillsPool[idx].args || []).map((args, idx) => {
        switch (args.type) {
          case ArgsTypes.number:
            extraContent = <InputNumber defaultValue={args.value} value={args.value} />
            break;
          case ArgsTypes.string:
            extraContent = <Input defaultValue={args.value} value={args.value} />
            break;
          case ArgsTypes.BUFF:
            extraContent = <>
              <Select style={{ width: 120 }} onChange={
                (v) => {
                  if(v) {
                    const newIArgs: IArgs = {
                      name: args.name,
                      type: args.type,
                      value: v.toString()
                    }
                    newValues[idx] = newIArgs
                    onChange?.(newValues)
                  }
                }}
              >
                {RootStore.skillsPool.map((skillPool) => {
                  return (
                    <Option value={skillPool.id} >{skillPool.name}</Option>
                  )
                })}
              </Select>
            </>
        }
        return (
          <Form onValuesChange={(cv, v) => { handleChange(cv, v, idx) }}>
            <Input.Group compact>
              <Form.Item name='name' label='名称' initialValue={args.name}>
                <Input style={{ width: '50' }} defaultValue={args.name} value={args.name} />
              </Form.Item>
              <Form.Item name='type' label='种类' initialValue={args.type}>
                <Select defaultValue={args.type} value={args.type}>
                  {options}
                </Select>
              </Form.Item>
              <Form.Item name='value' label="值" initialValue={args.value}>
                {extraContent}
              </Form.Item>
            </Input.Group>
          </Form>
        )
      })}

    </Space >
  )
}

export default (observer(SkillsEffectArgs));
