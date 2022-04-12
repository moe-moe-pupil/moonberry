import { waitTime } from "@/utils/await";
import { getEnumKeysOrValue } from "@/utils/findObjectAttr";
import { Graph } from "@antv/x6";
import ChartRect, { IRectRow, rectType } from "./ChartRect";
import { CombatRect } from "./CombatRect";
import UnitRect from "./UnitRect";

export interface INode {
  name: string,
  type: rectType,
  title: string,
  row: IRectRow[],
  group: string,
}

export enum basicNodesBuffTypes {
  "设置生命" = "设置生命",
  "设置魔法" = "设置魔法",
  "设置最大生命值" = "设置最大生命值",
  "设置最大魔法值" = "设置最大魔法值",
  "设置生命回复" = "设置生命回复",
  "设置魔法回复" = "设置魔法回复",
  "设置力量" = "设置力量",
  "设置敏捷" = "设置敏捷",
  "设置灵巧" = "设置灵巧",
  "设置体质" = "设置体质",
  "设置智力" = "设置智力",
  "设置睿智" = "设置睿智",
  "设置知识" = "设置知识",
  "设置魅力" = "设置魅力",
  "设置伤害增减" = "设置伤害增减",
  "设置治疗增减" = "设置治疗增减"
}

export enum nodesBuffTypes {
  '伤害' = '伤害',
  '治疗' = '治疗'
}

const basicNodes = getEnumKeysOrValue(basicNodesBuffTypes, false, true).map((nodeName: any) => {
  return ({ name: nodeName, type: rectType.function, title: nodeName, row: [{ inPorts: ':execIn', outPorts: ':execOut' }, { inPorts: '目标:targetIn', outPorts: '结果:dmgResultOut' }, { inPorts: `${nodeName.replace('设置', '')}:stringIn`, outPorts: '' }], group: 'function' })
})

export const Nodes: INode[] = [
  { name: '技能释放', type: rectType.event, title: "技能释放", row: [{ inPorts: '', outPorts: ':execOut' }, { inPorts: '', outPorts: '技能目标:targetOut' }], group: 'event' },
  { name: '被动', type: rectType.event, title: "被动", row: [{ inPorts: '', outPorts: ':execOut' }, { inPorts: '', outPorts: '自己:targetOut' }], group: 'event' },
  { name: '伤害', type: rectType.function, title: "伤害", row: [{ inPorts: ':execIn', outPorts: ':execOut' }, { inPorts: '目标:targetIn', outPorts: '结果:dmgResultOut' }, { inPorts: '伤害:numberIn', outPorts: '' }], group: 'function' },
  //{ name: nodesBuffTypes.设置最大生命值, type: rectType.function, title: nodesBuffTypes.设置最大生命值, row: [{ inPorts: ':execIn', outPorts: ':execOut' }, { inPorts: '目标:targetIn', outPorts: '结果:dmgResultOut' }, { inPorts: '最大生命值:stringIn', outPorts: '' }], group: 'function' },
  ...basicNodes,
  { name: '治疗', type: rectType.function, title: "治疗", row: [{ inPorts: ':execIn', outPorts: ':execOut' }, { inPorts: '目标:targetIn', outPorts: '结果:dmgResultOut' }, { inPorts: '治疗:numberIn', outPorts: '' }], group: 'function' },
  { name: '打印至屏幕', type: rectType.function, title: "打印至屏幕", row: [{ inPorts: ':execIn', outPorts: ':execOut' }, { inPorts: '字符串:stringIn', outPorts: '' }], group: 'function' },
  { name: '数字变量', type: rectType.var, title: "数字变量", row: [{ inPorts: ':onlyLabel', outPorts: '数字:numberOut' }], group: 'var' },
  { name: '给予BUFF', type: rectType.function, title: "给予BUFF", row: [{ inPorts: ':execIn', outPorts: ':execOut' }, { inPorts: '目标:targetIn', outPorts: '结果:dmgResultOut' }, { inPorts: 'BUFF:buffIn', outPorts: '' }, { inPorts: '持续轮次:numberIn', outPorts: '' }], group: 'function' },
  { name: '字符串变量', type: rectType.var, title: "字符串变量", row: [{ inPorts: ':onlyLabel', outPorts: '字符串:stringOut' }], group: 'var' },
  { name: 'BUFF变量', type: rectType.var, title: "BUFF变量", row: [{ inPorts: ':onlyLabel', outPorts: 'BUFF:buffOut' }], group: 'var' },
]

export const WorldNodes: INode[] = [
  { name: '玩家', type: rectType.pc, title: "玩家", row: [{ inPorts: ':onlyLabel', outPorts: '' }], group: 'pc' },
  { name: 'NPC', type: rectType.npc, title: 'NPC', row: [{ inPorts: ':onlyLabel', outPorts: '' }], group: 'npc' },
  { name: '群组', type: rectType.token, title: "虚拟讨论组", row: [{ inPorts: ':onlyLabel', outPorts: '' }], group: 'combat' }
]



export async function InitNodes() {
  //console.log(basicNodes)
  Nodes.map((sNode) => {
    Graph.registerReactComponent(sNode.name, (node) => { return <ChartRect type={sNode.type} title={sNode.title} row={sNode.row} node={node} /> })
  })
  WorldNodes.map((wNode) => {
    switch (wNode.type) {
      case rectType.pc:
        Graph.registerReactComponent(wNode.name, (node) => { return <UnitRect type={wNode.type} title={wNode.title} row={wNode.row} node={node} /> })
        break;
      case rectType.token:
        Graph.registerReactComponent(wNode.name, (node) => { return <CombatRect type={wNode.type} title={wNode.title} row={wNode.row} node={node} /> })
        break;
      case rectType.npc:
        Graph.registerReactComponent(wNode.name, (node) => { return <UnitRect type={wNode.type} title={wNode.title} row={wNode.row} node={node} /> })
        break;
      default:
        Graph.registerReactComponent(wNode.name, (node) => { return <UnitRect type={wNode.type} title={wNode.title} row={wNode.row} node={node} /> })
        break;
    }
  })
}

export enum NodeGroups {
  "event" = "event",
  "function" = "function",
  "var" = "var"
}

export enum WorldNodeGroups {
  "pc" = "pc",
  "npc" = "npc"
}