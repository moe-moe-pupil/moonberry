import { exchangeType } from "@/api/handle/exchangeHandle";
import { makeAutoObservable, } from "mobx";
import Buff from "./BuffStore";
import Loc from "./LocStore";
import Skill from "./SkillStore";
import Status from "./StatusStore";

interface PcProps {
    inited: boolean,
    name: string,
    nickname: string,
    Id: number,
    img: string,
    turn: number,
    skillChain: Skill[],
    buff: Buff[],
    location: Loc;
    hp: number,
    maxHP: number,
    hpReg: number,
    mp: number,
    maxMP: number,
    mpReg: number,
    lv: number,
    exp: number,
    speed: number,
    expBouns: number,//额外经验值系数
    isSupport: boolean,//是辅助嘛
    tdpt: number,//一回合承受伤害
    thpt: number,//一回合承受治疗
    status: Status,
    extraStatus: Status,
    totalStatus: Status,
    statusPoint: number,
    DMGModify: number,
    healModify: number,
    exchange: exchangeType,
    exchangePoint: number,
}



export default class Pc implements PcProps {
    inited: boolean = false;
    name: string = '';
    nickname: string = '';
    Id: number = -1;
    img: string = '';
    turn: number = 0;
    skillChain: Skill[] = [];
    buff: Buff[] = [];
    location: Loc = { x: 0, y: 0, z: 0 };
    hp: number = 5;
    maxHP: number = 5;
    hpReg: number = 0;
    mp: number = 0;
    maxMP: number = 0;
    mpReg: number = 0;
    lv: number = 1;
    exp: number = 0;
    tdpt: number = 0;
    thpt: number = 0;
    status: Status = {
        str: 0,
        agi: 0,
        dex: 0,
        vit: 0,
        int: 0,
        wis: 0,
        k: 0,
        cha: 0
    };
    statusPoint: number = 0;
    exchange: exchangeType = 0;
    exchangePoint: number = 0;
    extraStatus: Status = {
        str: 0,
        agi: 0,
        dex: 0,
        vit: 0,
        int: 0,
        wis: 0,
        k: 0,
        cha: 0
    };
    totalStatus: Status = {
        str: 0,
        agi: 0,
        dex: 0,
        vit: 0,
        int: 0,
        wis: 0,
        k: 0,
        cha: 0
    }
    expBouns: number = 1;
    isSupport: boolean = false;
    speed: number = 3;
    DMGModify: number = 1;
    healModify: number = 1;

    constructor() {
        makeAutoObservable(this);
        // this.name = pc.name;
        // this.nickname = pc.nickname;
        // this.buff = pc.buff;
        // this.skillChain = pc.skillChain;
        // this.lv = pc.lv;
        // this.maxMP = pc.maxMP

    }
}


