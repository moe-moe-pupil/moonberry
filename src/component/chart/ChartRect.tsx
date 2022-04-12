import {
  CaretRightOutlined,
  FunctionOutlined,
} from '@ant-design/icons';
import { InputNumber } from 'antd';
import styled from 'styled-components'
import { IChartRect } from './UnitRect';

export enum rectType {
  event = 'event',
  function = 'function',
  var = 'var',
  pc = 'pc',
  token = 'token',
  npc = 'npc'
}

export enum contentType {
  'exec',
  'prop',
}

export interface IChartRectContent {
  type: contentType,
  text: string,
}

export interface IRectRow {
  outPorts: string
  inPorts: string
}


export const ChartRect = ({ type, title, row, node }: IChartRect) => {
  var outLined = <CaretRightOutlined />

  switch (type) {
    case rectType.event:
      outLined = <CaretRightOutlined />
      break;
    case rectType.function:
      outLined = <FunctionOutlined />

      break;
  }
  return (
        <div className='rectContainer'>
          <div className={`rectTop ${node.getProp('type')}`}>
          </div>
          <div className='rectTopContent'>
            {outLined}
            {title}
          </div>
          {row.map((content) => {
            const inPortsStrs = content.inPorts.split(":")
            const outPortsStrs = content.outPorts.split(":")
            return (
              <div className='rectBody'>
                <div className='rectLeft'>
                  {inPortsStrs.length > 1 ? inPortsStrs[0] : void (0)}
                </div>
                <div className='rectRight'>
                  {outPortsStrs.length > 1 ? outPortsStrs[0] : void (0)}
                </div>
              </div>
            )
          })}
        </div>
  )
}


export default ChartRect
