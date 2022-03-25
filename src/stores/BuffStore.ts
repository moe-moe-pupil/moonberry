import { makeAutoObservable, } from "mobx";

export enum DMGTypeEnum {
    Magical,
    Physical,
    Cursed,
    Diseased,
    bleed,
    Range,
    poisoning,
    None,
}

export enum healTypeEnum {
    Instant,
    continue,
}

export interface DMG {
    value: number,
    type: DMGTypeEnum,
    fromID: number,
    targetsID: number[],
    modify: number,
}

export interface heal {
    value: number,
    type: healTypeEnum,
    fromID: number,
    targetsID: number[],
}

export enum TargetEnum {
    '自己' = -1,
    '技能目标' = -2,
}
export const basicEnum = [
    "hp",
    "mp",
    "maxHP",
    "maxMP",
    "hpReg",
    "mpReg",
    "str",
    "agi",
    "dex",
    "vit",
    "int",
    "wis",
    "k",
    "cha",
    'DMGModify',
    'healModify'
]
export enum EffectEnum {
    hp = "hp",
    mp = "mp",
    maxHP = "maxHP",
    maxMP = "maxHP",
    hpReg = "hpReg",
    mpReg = "mpReg",
    str = "str",
    agi = "agi",
    dex = "dex",
    vit = "vit",
    int = "int",
    wis = "wis",
    healModify = 'healModify',
    DMGModify = 'DMGModify',
    k = "k",
    cha = "cha",
    伤害 = '伤害',
    治疗 = '治疗',
    给予BUFF = '给予BUFF'
}

interface BuffProps {
    name: string,
    prior: number,
    life: number,
    effect: EffectEnum[],
    type: DMGTypeEnum,
    from: number,
    benifit: boolean,
    value: string[],
}

export default class Buff implements BuffProps {
    name!: string;
    prior!: number;
    life!: number;
    effect!: EffectEnum[];
    type!: DMGTypeEnum;
    from!: number;
    benifit!: boolean;
    value!: string[];
    constructor(buff: BuffProps) {
        makeAutoObservable(this);
        for (let i in buff) {
            this[i] = buff[i];
        }
    }

}