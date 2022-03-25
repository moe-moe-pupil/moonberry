import { chatType, miraiContent } from "@/stores/ChatStore";
import Pc from "@/stores/PcStore";
import Root from "@/stores/RootStore";

export enum statusEnum {
  "str",//每点力量提供1点的血量，0.5米/秒的移动速度，0.1%的体型，2.5的物理攻击加值
  "agi",//每点敏捷提供1米/秒的移动速度,2%的攻击速度(100%的攻速一轮俩动，不足100%的攻速会提供基于力量的基础物理攻击百分比提升)
  "dex",//每点灵巧增加0.5米/秒的移动速度，3的远程物理攻击加值，1的近战物理攻击加值
  "vit",//每点体质提供3点的血量，脱战后非重伤状态1点/轮的生命回复,减少1%因为受伤状态而遭受的属性惩罚
  "int",//每点智力提供5点的蓝量，1%的魔法额外消耗,2%的法术伤害,1%的治疗加成；达到10点时，角色可以感知周遭环境的魔力；达到15点时，角色可以模糊感知周围存在的法术类buff或正在释放的法术类技能，而不会受到视野阻碍的限制
  "wis",//每点智慧提供2.5点的蓝量，脱战后1点/轮的魔法回复,更棒的精神力引导与控制,2%的治疗加成
  "k",//每点知识提供额外的线索与情报并且提供操作一些设备的能力！达到10点时角色拥有对自身的完整认识,清楚地认识到自己的生命值具体数值与自己对目标造成伤害的具体数值；达到20点时，角色理解了更多，可以消耗一个观察小动作分析buff或者技能的伤害/治疗数值与持续时间.
  "cha",//每点魅力会提供额外的与NPC交流的好感，与0.05的召唤物上限和2%的召唤物伤害加成
}

export enum statusType {
  "normal",
  "str",//每点力量提供1点的血量，0.5米/秒的移动速度，0.1%的体型，2.5的物理攻击加值
  "agi",//每点敏捷提供1米/秒的移动速度,2%的攻击速度(100%的攻速一轮俩动，不足100%的攻速会提供基于力量的基础物理攻击百分比提升)
  "dex",//每点灵巧增加0.5米/秒的移动速度，3的远程物理攻击加值，1的近战物理攻击加值
  "vit",//每点体质提供3点的血量，脱战后非重伤状态1点/轮的生命回复,减少1%因为受伤状态而遭受的属性惩罚
  "int",//每点智力提供5点的蓝量，1%的魔法额外消耗,2%的法术伤害,1%的治疗加成；达到10点时，角色可以感知周遭环境的魔力；达到15点时，角色可以模糊感知周围存在的法术类buff或正在释放的法术类技能，而不会受到视野阻碍的限制
  "wis",//每点智慧提供2.5点的蓝量，脱战后1点/轮的魔法回复,更棒的精神力引导与控制,2%的治疗加成
  "k",//每点知识提供额外的线索与情报并且提供操作一些设备的能力！达到10点时角色拥有对自身的完整认识,清楚地认识到自己的生命值具体数值与自己对目标造成伤害的具体数值；达到20点时，角色理解了更多，可以消耗一个观察小动作分析buff或者技能的伤害/治疗数值与持续时间.
  "cha",//每点魅力会提供额外的与NPC交流的好感，与0.05的召唤物上限和2%的召唤物伤害加成
  "confirmStatus",//属性确认中...
  "skill",//技能兑换
  "confirmSkill",//技能确认中...
  "img",//图片
  "nickname",//昵称
}

export enum Zh_statusType {
  "正常",
  "力量",//每点力量提供1点的血量，0.5米/秒的移动速度，0.1%的体型，2.5的物理攻击加值
  "敏捷",//每点敏捷提供1米/秒的移动速度,2%的攻击速度(100%的攻速一轮俩动，不足100%的攻速会提供基于力量的基础物理攻击百分比提升)
  "灵巧",//每点灵巧增加0.5米/秒的移动速度，3的远程物理攻击加值，1的近战物理攻击加值
  "体质",//每点体质提供3点的血量，脱战后非重伤状态1点/轮的生命回复,减少1%因为受伤状态而遭受的属性惩罚
  "智力",//每点智力提供5点的蓝量，1%的魔法额外消耗,2%的法术伤害,1%的治疗加成；达到10点时，角色可以感知周遭环境的魔力；达到15点时，角色可以模糊感知周围存在的法术类buff或正在释放的法术类技能，而不会受到视野阻碍的限制
  "智慧",//每点智慧提供2.5点的蓝量，脱战后1点/轮的魔法回复,更棒的精神力引导与控制,2%的治疗加成
  "知识",//每点知识提供额外的线索与情报并且提供操作一些设备的能力！达到10点时角色拥有对自身的完整认识,清楚地认识到自己的生命值具体数值与自己对目标造成伤害的具体数值；达到20点时，角色理解了更多，可以消耗一个观察小动作分析buff或者技能的伤害/治疗数值与持续时间.
  "魅力",//每点魅力会提供额外的与NPC交流的好感，与0.05的召唤物上限和2%的召唤物伤害加成
  "属性确认",
  "技能",
  "技能确认中",
  "图片",
  "昵称",
}

export enum exchangeType {
  normal = 0, //未处于兑换之中
  str = 1, //处于属性兑换之中
  agi = 2,
  dex = 3,
  vit = 4,
  int = 5,
  wis = 6,
  k = 7,
  cha = 8,
  confirmStatus = 9,
  skill = 10, //处于技能兑换之中
  confirmSkill = 11,
  img = 12,
  nickname = 13,
}

export function exchangeHandle(RootStore: Root, newChatMsg: miraiContent) {
  const qqNumber = newChatMsg.sender?.id!;
  if (RootStore.findPcByQQNumber(qqNumber) == -1) {
    const newPc: Pc = new Pc()
    newPc.Id = newChatMsg.sender?.id!,
      newPc.name = newChatMsg.sender?.nickname!
    newPc.statusPoint = RootStore.groups[RootStore.currentGroup].initStatusPoint
    newPc.exchangePoint = RootStore.groups[RootStore.currentGroup].initExchangePoint
    RootStore.setPcByQQNumber(qqNumber, newPc);
    RootStore.ezSendText(qqNumber,
      ["你还没有角色卡呢，接下来会开始建卡，请在30分钟内完成哦,未完成的话会清除已录入数据哦\n你拥有"
        + newPc.statusPoint
        + "属性点，请将它分配到 力量/敏捷/灵巧/体质/智力/精神/知识/魅力 上\n"
        , "请直接输入数字来增加该属性，输错了别紧张，尚未确认属性兑换时，只需要连输两个点 .. 就可以退回上一个属性"
        , "如果你不知道如何兑换更适合你的期望，请去看一看Wiki( http://moemoepupil.com )"
      ]);
    RootStore.nextExchange(qqNumber);
  } else {

  }
}

export function setPcExchangeType(RootStore: Root, qqNumber: number, type: exchangeType) {
  const idx = RootStore.findPcByQQNumber(qqNumber);
  if (idx != -1) {
    RootStore.groups[RootStore.currentGroup].pc[idx].exchange = type;
  }
}

export function pcInStatusExchange(RootStore: Root, qqNumber: number): number {
  const nowPc = RootStore.getPcByQQNumber(qqNumber);
  if (nowPc && nowPc.exchange > exchangeType.normal
    && nowPc.exchange < exchangeType.confirmStatus) {
    return nowPc.exchange;
  }
  return -1;
}

export function pcInSkillExchange(RootStore: Root, qqNumber: number): number {
  const nowPc = RootStore.getPcByQQNumber(qqNumber);
  if (nowPc && nowPc.exchange == exchangeType.skill) {
    return nowPc.exchange;
  }
  return -1;
}

export function pcInPicExchange(RootStore: Root, qqNumber: number): number {
  const nowPc = RootStore.getPcByQQNumber(qqNumber);
  if (nowPc && nowPc.exchange == exchangeType.img) {
    return nowPc.exchange;
  }
  return -1;
}

export function pcInNickNameExchange(RootStore: Root, qqNumber: number): number {
  const nowPc = RootStore.getPcByQQNumber(qqNumber);
  if (nowPc && nowPc.exchange == exchangeType.nickname) {
    return nowPc.exchange;
  }
  return -1;
}

export function pcStatusAdd(RootStore: Root, qqNumber: number, addNum: number, tarStatus: number): number {
  const nowPc = RootStore.getPcByQQNumber(qqNumber) as Pc;
  if (nowPc && nowPc.inited) {
    if (nowPc.statusPoint >= addNum) {
      RootStore.addPcStatus(nowPc, addNum, tarStatus)
      RootStore.ezSendText(qqNumber, [`加点成功，「${Zh_statusType[tarStatus]}」 + ${addNum}，现在「${Zh_statusType[tarStatus]}」:${nowPc.status[Zh_statusType[tarStatus]]}`])
    } else {
      RootStore.ezSendText(qqNumber, [`加点失败，你没有那么多属性点，你试图兑换 ${addNum} 点「${Zh_statusType[tarStatus]}」,但你只有 ${nowPc.statusPoint} 点属性点`])
    }
  } else {
    RootStore.ezSendText(qqNumber, [`加点失败，你的角色尚未完成初始化`])
  }
  return -1;
}