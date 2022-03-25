import { makeAutoObservable, } from "mobx";
import Buff from "./BuffStore";
import { IArgs } from "./RootStore";


export enum SkillTargetEnum {
	无目标 = "无目标",
	单目标 = "单目标",
	多目标 = "多目标",
	范围 = "范围",
}

export enum SkillTypeEnum {
	法术 = "法术",
	道具 = "道具",
	异能 = "异能",
	动作 = "动作",
	血统 = "血统",
	职业 = "职业",
	召唤物 = "召唤物",
	远程 = "远程",
}

interface SkillProps {
	name: string,
	type: SkillTypeEnum,
	target: number, //目标数量
	class: SkillTargetEnum,
	caster: number, //释放者qq
	cost:number, //释放能耗
	able: boolean, //可用？
	stInited: boolean; //st审核完毕？
	pcInited: boolean; //pl确认完毕？
	cooldown: number, //CD
	cooldownLeft: number, //剩余CD
	poolId: string,
	buffMachine: {}, //buff机
	range: number, // 施法距离
	description: string //描述
	args: IArgs[]; //技能参数
	exchangePoint: number; //消耗兑换点
}

export default class Skill implements SkillProps {
	name: string = '';
	type: SkillTypeEnum = SkillTypeEnum.法术;
	target: number = 0;
	class: SkillTargetEnum = SkillTargetEnum.单目标;
	caster: number = 0;
	able: boolean = true;
	cooldown: number = 0;
	cooldownLeft: number = 0;
	buffMachine: {} = {};
	description: string = '';
	stInited: boolean = false;
	pcInited: boolean = false;
	poolId: string = '';
	args: IArgs[] = [];
	range: number = 0;
	cost: number = 0;
	exchangePoint: number = 9999999;
	constructor() {
		makeAutoObservable(this);
	}
}