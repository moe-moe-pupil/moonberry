import { basicNodesBuffTypes, nodesBuffTypes } from "@/component/chart/NodesInit";
import { findNextNodeAndEdge, IBluePrint } from "@/component/chart/SkillEditChart";
import Buff, { EffectEnum, TargetEnum, DMGTypeEnum, healTypeEnum } from "@/stores/BuffStore";
import { Graph, Node } from "@antv/x6";
import { getEnumKeysOrValue } from "./findObjectAttr";

export interface IEventBuffs {
  event: string,
  buffs: Buff[]
}

export enum types2Effects {
  "设置生命" = EffectEnum.hp,
  "设置魔法" = EffectEnum.mp,
  "设置最大生命值" = EffectEnum.maxHP,
  "设置最大魔法值" = EffectEnum.maxMP,
  "设置生命回复" = EffectEnum.hpReg,
  "设置魔法回复" = EffectEnum.mpReg,
  "设置力量" = EffectEnum.str,
  "设置敏捷" = EffectEnum.agi,
  "设置灵巧" = EffectEnum.dex,
  "设置体质" = EffectEnum.vit,
  "设置智力" = EffectEnum.int,
  "设置睿智" = EffectEnum.wis,
  "设置知识" = EffectEnum.k,
  "设置魅力" = EffectEnum.cha,
  "设置伤害增减" = EffectEnum.DMGModify,
  "设置治疗增减" = EffectEnum.healModify,
}

export function node2Buff(name: string, nodeName: string, args: string[]): Buff | undefined {
  if (getEnumKeysOrValue(types2Effects, true, true).indexOf(nodeName) != -1) {
    const buff: Buff = {
      name: name,
      prior: 0,
      life: 0,
      effect: [types2Effects[nodeName]],
      type: DMGTypeEnum.None,
      from: TargetEnum[args[0]],
      benifit: true,
      value: [args[1]]
    }
    //console.log(buff)
    return buff
  } else {
    switch (nodeName) {
      // case nodesBuffTypes.设置最大生命值:
      //   const buff: Buff = {
      //     name: name,
      //     prior: 0,
      //     life: 0,
      //     effect: [EffectEnum.maxHP],
      //     type: TypeEnum.None,
      //     from: TargetEnum[args[0]],
      //     benifit: true,
      //     value: [args[1]]
      //   }
      //   return buff
      case EffectEnum.伤害:
        var buff: Buff = {
          name: name,
          prior: 0,
          life: 0,
          effect: [EffectEnum.伤害],
          type: DMGTypeEnum.None,
          from: TargetEnum[args[0]],
          benifit: false,
          value: [args[1]]
        }
        return buff
      case EffectEnum.治疗:
        var buff: Buff = {
          name: name,
          prior: 0,
          life: 0,
          effect: [EffectEnum.治疗],
          type: DMGTypeEnum.Magical,
          from: TargetEnum[args[0]],
          benifit: true,
          value: [args[1]]
        }
        return buff
      case EffectEnum.给予BUFF:
        var buff: Buff = {
          name: name,
          prior: 0,
          life: TargetEnum[args[3]],
          effect: [EffectEnum.给予BUFF],
          type: DMGTypeEnum.Magical,
          from: TargetEnum[args[0]],
          benifit: true,
          value: [args[1]]
        }
        return buff
      default:
        return undefined
    }
  }
}
export function buffBuilder(name: string, graph: Graph, beginNode: Node<Node.Properties>, bp: IBluePrint[]) {
  const buffs: Buff[] = []
  bp.map((bp) => {
    const args: string[] = [];
    //console.log(graph.getIncomingEdges(bp.node))
    graph.getIncomingEdges(bp.node)?.filter((edge) => { return edge.getProp('type') != 'exec' }).map((edge) => {
      //console.log(bp.node.getPorts().filter((port) => { return port.id?.indexOf('Out') == -1 && port.id?.indexOf('exec') == -1 }));
      const sourceNode = edge.getSourceNode()
      const targetID = edge.getTargetPortId()
      if (sourceNode && targetID) {
        args[parseInt(targetID.split(":")[2]) - 1] = (sourceNode.getProp('name') || edge.getSourcePortId()?.split(":")[0])
      }
    })

    const inPorts = bp.node.getPorts().filter((port) => { return port.id?.indexOf('In') != -1 && port.id?.indexOf('exec') == -1 })
    if (args?.length == inPorts.length) {
      const buff = node2Buff(name, bp.node.getProp('component'), args)
      if (buff) {
        buffs.push(buff)
      }
    }
  })
  const ebs: IEventBuffs = { event: beginNode.getProp('component'), buffs: buffs }
  console.log(ebs)
  return (ebs)
}

