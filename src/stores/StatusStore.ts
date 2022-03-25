import {makeAutoObservable, } from "mobx";

interface StatusProps {
	str: number,//每点力量提供1点的血量，0.5米/秒的移动速度，0.1%的体型，2.5的物理攻击加值
    agi: number,//每点敏捷提供1米/秒的移动速度,2%的攻击速度(100%的攻速一轮俩动，不足100%的攻速会提供基于力量的基础物理攻击百分比提升)
    dex: number,//每点灵巧增加0.5米/秒的移动速度，3的远程物理攻击加值，1的近战物理攻击加值
    vit: number,//每点体质提供3点的血量，脱战后非重伤状态1点/轮的生命回复,减少1%因为受伤状态而遭受的属性惩罚
    int: number,//每点智力提供5点的蓝量，1%的魔法额外消耗,2%的法术伤害,1%的治疗加成；达到10点时，角色可以感知周遭环境的魔力；达到15点时，角色可以模糊感知周围存在的法术类buff或正在释放的法术类技能，而不会受到视野阻碍的限制
    wis: number,//每点智慧提供2.5点的蓝量，脱战后1点/轮的魔法回复,更棒的精神力引导与控制,2%的治疗加成
    k: number,//每点知识提供额外的线索与情报并且提供操作一些设备的能力！达到10点时角色拥有对自身的完整认识,清楚地认识到自己的生命值具体数值与自己对目标造成伤害的具体数值；达到20点时，角色理解了更多，可以消耗一个观察小动作分析buff或者技能的伤害/治疗数值与持续时间.
    cha: number,//每点魅力会提供额外的与NPC交流的好感，与0.05的召唤物上限和2%的召唤物伤害加成
}

export default class Status implements StatusProps {

    str: number;
    agi: number;
    dex: number;
    vit: number;
    int: number;
    wis: number;
    k: number;
    cha: number;

	constructor(status:StatusProps) {
		makeAutoObservable(this);
		this.str = status.str;
        this.agi = status.agi;
        this.cha = status.cha;
        this.dex = status.dex;
        this.int = status.int;
        this.vit = status.vit;
        this.wis = status.wis;
        this.k = status.k;
	}
    
    
    

	

	
}