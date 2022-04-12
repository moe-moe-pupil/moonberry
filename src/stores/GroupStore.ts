import { Item } from "@/component/chat/ChatListItem";
import { Graph } from "@antv/x6";
import { makeAutoObservable } from "mobx";
import { Key } from "react";
import { ControlPosition } from "react-draggable";
import { newpane } from ".";
import Buff from "./BuffStore";
import Chat, { miraiContent } from "./ChatStore";
import Pc from "./PcStore";
import Skill from "./SkillStore";

export interface IArea {
    id: string,
    name: string,
    x: number,//左上角x
    y: number,//左上角y
    width: number,
    height: number,
    member: number[],
    combat: boolean,
}

export interface IWorld {
    name: string,
    PcNumbers: number[], //Pc的QQID
    map?: object,
    chatAreas: IArea[],
    Areas: IArea[],
    NpcNumbers: number[]
}

export interface statusModal {
    Id: number,
    visible: boolean,
    bounds: ControlPosition;
    size: {
        width: number,
        height: number
    }
}

export interface skillEditModal {
    Id: string,
    visible: boolean,
    bounds: ControlPosition;
    size: {
        width: number,
        height: number
    }
}

export interface IWorldModal {
    world: IWorld,
    Id: string,
    visible: boolean,
    bounds: ControlPosition;
    size: {
        width: number,
        height: number
    }
}

export interface panes {
    title: string,
    sendTo: sendTo,
    key: number,
    closable: boolean,
}

export interface Team {
    name: string,
    Id: number,
    buff: Buff[],
    pcs: Pc[],
    visible: boolean,
    bounds: ControlPosition,
    size: {
        width: number,
        height: number
    },
    allowPcNicknameRepeat: boolean,
    nemo: boolean,
    chat: Chat[]
}

export interface TeamPcIdx {
    teamIdx: number,
    pcIdx: number
}

export interface ChatAreaIdx {
    worldIdx: number,
    chatAreaIdx: number,
}

export interface sendTo {
    targets: string[]
}

export interface ChatAreaPcIdx {
    worldIdx: number,
    chatAreaIdx: number,
    pcIdx: number,
}

export interface TimeOutNegative {
    Id: number,
    remain: number, //剩余时间(ms)
    reply: boolean,
    idx: number,
}

export interface basicConfig {
    wisMPReg: number,
    wisMaxMP: number,
    intMaxMP: number,
    vitHPReg: number,
    vitMaxHP: number,
    lvMaxHP: number,
    strMaxHP: number,
    initStatusPoint: number,
    initExchangePoint: number,
    expGainPerLv: number,
    expGainPerLvPvP: number,
    basicSpeed: number,
    strDMGBenifit: number,
    intDMGBenifit: number,
    dexDMGBenifit: number,
    dexRangeDMGBenifit: number,
    wisHealBenifit: number,
    intHealBenifit: number,
    agiDMGBenifit: number,
    strSpeed: number,
    agiSpeed: number,
    dexSpeed: number,
}

export enum basicConfigEnum {
    wisMPReg = '智慧法力回复',
    wisMaxMP = '智慧法力上限',
    intMaxMP = '智力法力上限',
    vitHPReg = '体质生命回复',
    vitMaxHP = '体质生命上限',
    lvMaxHP = '等级生命上限',
    strMaxHP = '力量生命上限',
    initStatusPoint = '初始属性点',
    initExchangePoint = '初始兑换分数',
    expGainPerLv = '等级差经验因子',
    expGainPerLvPvP = 'PVP等级差经验因子',
    basicSpeed = '基础移速',
    strDMGBenifit = '力量伤害增益',
    intDMGBenifit = '智力伤害增益',
    dexDMGBenifit = '灵巧伤害增益',
    dexRangeDMGBenifit =  '灵巧远程伤害增益',
    wisHealBenifit = '智慧治疗增益',
    intHealBenifit = '智力治疗增益',
    agiDMGBenifit = '敏捷伤害增益',
    strSpeed = '力量移速',
    agiSpeed = '敏捷移速',
    dexSpeed = '灵巧移速'
}

export const onlyReadBasicConfig = () => {
    const tmpObj: basicConfig = {
        wisMPReg: 1,
        wisMaxMP: 2.5,
        intMaxMP: 5,
        vitHPReg: 1,
        vitMaxHP: 3,
        lvMaxHP: 5,
        strMaxHP: 1,
        initStatusPoint: 5,
        initExchangePoint: 6,
        expGainPerLv: 3,
        expGainPerLvPvP: 0.15,
        basicSpeed: 3,
        strDMGBenifit: 0.025,
        intDMGBenifit: 0.02,
        dexDMGBenifit: 0.01,
        dexRangeDMGBenifit: 0.03,
        wisHealBenifit: 0.02,
        intHealBenifit: 0.01,
        agiDMGBenifit: 0.02,
        strSpeed: 0.5,
        agiSpeed: 1,
        dexSpeed: 0.5,
    }
    return Object.assign({}, tmpObj)
}

export interface GroupProps {
    name: string;
    description: string;
    stDesc: string;
    guide: string;
    basicConfig: basicConfig;
    runTimes: number;//开团次数
    pc: Pc[];
    Modal: statusModal[];
    chatMsg?: Chat[];
    picBase64: string | ArrayBuffer | null | undefined;
    currentChatList: Item[];
    currentChatTo: number;
    currentSendPanes: panes[];
    currentTeams: Team[];
    currentSkillEdit: skillEditModal[];
    currentWorlds: IWorldModal[];
    activeKey: number | undefined;
    negative: TimeOutNegative[];
}

/*等级：每提升1级 你就会得到2点属性点和额外的5点基础生命值
力量：每点力量提供1点的血量，0.5米/秒的移动速度，0.1%的体型，2.5的物理攻击加值
敏捷：每点敏捷提供1米/秒的移动速度,2%的攻击速度(100%的攻速一轮俩动，不足100%的攻速会提供基于力量的基础物理攻击百分比提升)
灵巧：每点灵巧增加0.5米/秒的移动速度，3的远程物理攻击加值，1的近战物理攻击加值
体质：每点体质提供3点的血量，脱战后非重伤状态1点/轮的生命回复,减少1%因为受伤状态而遭受的属性惩罚
智力：每点智力提供5点的蓝量，1%的魔法额外消耗,2%的法术伤害,1%的治疗加成；达到10点时，角色可以感知周遭环境的魔力；达到15点时，角色可以模糊感知周围存在的法术类buff或正在释放的法术类技能，而不会受到视野阻碍的限制
智慧：每点智慧提供2.5点的蓝量，脱战后1点/轮的魔法回复,更棒的精神力引导与控制,2%的治疗加成
知识：每点知识提供额外的线索与情报并且提供操作一些设备的能力！达到10点时角色拥有对自身的完整认识,清楚地认识到自己的生命值具体数值与自己对目标造成伤害的具体数值；达到20点时，角色理解了更多，可以消耗一个观察小动作分析buff或者技能的伤害/治疗数值与持续时间.
魅力：每点魅力会提供额外的与NPC交流的好感，与0.05的召唤物上限和2%的召唤物伤害加成*/

export default class Group implements GroupProps {
    name: string = '未命名团';
    description: string = '';
    stDesc: string = '';
    guide: string = '';
    pc: Pc[] = [];
    chatMsg: Chat[] = [];
    picBase64: string | ArrayBuffer | null | undefined = '';
    Modal: statusModal[] = [];
    currentChatList: Item[] = new Array({
        Id: 0,
        nickName: '所有消息',
        lastWords: '',
        notReadCount: 0
    });
    currentChatTo: number = 0;
    currentSendPanes: panes[] = [newpane];
    currentTeams: Team[] = [];
    currentSkillEdit: skillEditModal[] = [];
    currentWorlds: IWorldModal[] = [];
    activeKey: number | undefined = 1;
    initStatusPoint: number = 6;
    initExchangePoint: number = 6;
    constructor() {
        makeAutoObservable(this);
        // for (let i in group) {
        //     this[i] = group[i];
        // }
    }
    runTimes = 0;
    basicConfig: basicConfig = onlyReadBasicConfig()
    negative: TimeOutNegative[] = [];
    get AllChatMsg() {
        const Msg = new Array();
        var i: any;
        for (i in this.chatMsg) {
            Msg.push({ ...this.chatMsg });
        }
        return (Msg)
    }

}