import { uuid } from "@/utils/uuid"
import { ISkillsPool, ISkillsPoolType } from "./RootStore"

export function InitTalentPool(): ISkillsPool[] {
  var TalentPools: ISkillsPool[] =
    [
      {
        id: uuid(),
        name: '役于我手',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，当你参与的战斗轮中有目标死亡时，你会获得他5%的生命上限，最多叠加到你属性提供生命值上限的20%，持续到本次剧情世界结束。',
      },
      {
        id: uuid(),
        name: '世界之血',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '只触发一次，当你到达「浩瀚灵气」所在位置时，你会激活本次剧情世界的世界血脉，最多三条有用的提示会向你揭示。',
      },
      {
        id: uuid(),
        name: '苏萨斯之爪',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你造成的物理伤害会在一回合之后再次触发一次等效于实际伤害35%效果的魔法伤害。',
      },
      {
        id: uuid(),
        name: '奥术护盾',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '当你进入战斗轮时，你会获得10%最大魔法值的临时护盾，持续直到战斗轮结束或被打破。',
      },
      {
        id: uuid(),
        name: '末日决战',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，你的战意BUFF会在第一回合就立刻生效，而不是第四回合开始。',
      },
      {
        id: uuid(),
        name: '无尽痛楚',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，每次成功地承受伤害（*不计算吸收的伤害），都会使你下一次命中的伤害额外造成[等级*1.5]的无类型伤害，最多叠加2次。',
      },
      {
        id: uuid(),
        name: '狂妄',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，你每受到一个新目标的伤害效果，都会增加自身10%的伤害效果，上限30%。',
      },
      {
        id: uuid(),
        name: '疲惫行者',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你对生命值低下造成的属性下降效果都保有20%减免，同时你最多受到重伤带来的属性惩罚，你将视濒死等同为重伤。',
      },
      {
        id: uuid(),
        name: '不死者之怒',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '只触发一次，当你受到致命伤害时，你会在当前回合获得100%的伤害减免，并且自身伤害效果暂时提高10%，无法豁免超过自身生命上限的伤害。',
      },
      {
        id: uuid(),
        name: '息心',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你脱离战斗轮时，你在战斗轮时受到的伤害会以50%的比例治疗你。',
      },
      {
        id: uuid(),
        name: '混沌无序',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你造成的伤害与治疗效果会随机-15%~+15%,每次伤害或是治疗效果独立随机。',
      },
      {
        id: uuid(),
        name: '菜鸡猛啄',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你的单次伤害效果都至少能对目标造成[等级*1]点无类型伤害，此伤害效果无视伤害减免与增益。',
      },
      {
        id: uuid(),
        name: '更迭交替',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，当你更换道具部件的时候你会获得20%的折扣价。',
      },
      {
        id: uuid(),
        name: '那美克星之慧',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你的知识获得突飞猛进的发展，你获得[等级*2]的知识。',
      },
      {
        id: uuid(),
        name: '物理专长',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你都是一名大物理学家，你拥有一个可放置的便携小炮塔，同时你的知识基础值0->2。',
      },
      {
        id: uuid(),
        name: '狂野召唤！',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，唯一一个名字里有！的天赋会带给你一个额外的稳定且强力的召唤物数量，50%成功！',
      },
      {
        id: uuid(),
        name: '月夜之力',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，当你在夜间时，你会拥有额外的[等级*1]的敏捷，50%的额外人物透明度(如有多个透明效果取最高值不叠加)。',
      },
      {
        id: uuid(),
        name: '液态躯体',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，你每回合治疗自己相当于上一回合5%的承受伤害值，同时你一回合承受的伤害会均分至当前回合和下一回合。',
      },
      {
        id: uuid(),
        name: '镜像外衣',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，如果受到致命伤害，你会获得一层镜像外衣，之后会消耗最多15魔法值，每消耗5点魔法值会额外叠加一层镜像外衣，每层镜像外衣能使你隐身一回合,上限4回合，同时脱离战斗轮，如果再次受到或造成伤害则会立刻进入战斗轮并脱离隐身，冷却需要6回合。',
      },
      {
        id: uuid(),
        name: '溃伤',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，当你对一个目标造成伤害时，会使得目标降低25%受到的治疗效果，持续1回合。',
      },
      {
        id: uuid(),
        name: '总冠军',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，每有一名pl被淘汰出局，你将会叠加一层冠军buff，每一层冠军buff会增加你2%的伤害加成和1%的伤害减免。',
      },
      {
        id: uuid(),
        name: '大魔法师',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你的每点智力额外提供1点蓝量和0.5%的魔法伤害加成。',
      },
      {
        id: uuid(),
        name: '斗志昂扬',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，你会在你的第一回合减免50%承受伤害，第二回合减免10%承受伤害。第三回合减免2%承受伤害。',
      },
      {
        id: uuid(),
        name: '越战越勇',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，每经过任意目标的一回合增加2%的伤害效果，上限20%。',
      },
      {
        id: uuid(),
        name: '瞄准镜Tex-30',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你都保有最低[等级*15]M的科技武器射程。',
      },
      {
        id: uuid(),
        name: '趋近',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，当你试图追赶一个目标时，会每回合获得[等级*2]M/s的速度，上限为[等级*20]M/s。',
      },
      {
        id: uuid(),
        name: '无限专注',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，你对同一个单位发起的独立单体攻击会造成越来越高的伤害，每次叠加10%，上限20%。',
      },
      {
        id: uuid(),
        name: '复仇心切',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '只触发一次，每一次跑团开始时，将选定上一次击杀你的角色为复仇对象，对他提高20%的伤害，如果第一次跑团则可以自由选定复仇对象。',
      },
      {
        id: uuid(),
        name: '精英猎人',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你对精英怪的伤害提高10%，减免10%精英怪造成的伤害，并且你从精英怪身上获得的经验收益提高10%。',
      },
      {
        id: uuid(),
        name: '三界行者',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你减免50%因为环境造成的负面效果和伤害。',
      },
      {
        id: uuid(),
        name: '敏锐',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入战斗轮时，会100%闪避第一次对你造成的范围和非指向性伤害。',
      },
      {
        id: uuid(),
        name: '羁绊',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '每一次跑团开始时，只有一次机会选择一人成为灵魂羁绊，你如果和你的羁绊一起行动，你和你的羁绊都会获得5%的伤害减免和5%的伤害加成。同时，如果你的羁绊对你发起攻击，你会受到1.5倍的伤害，并且你的减免伤害效果将不会减免来自你灵魂羁绊的伤害。',
      },
      {
        id: uuid(),
        name: '疾行如风',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '每一次跑团开始时，你会获得100%的额外移动速度加成，持续到你进入战斗轮或者10回合之后。',
      },
      {
        id: uuid(),
        name: '顶端回复',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，当你受到越是高等级的治疗效果，你就越是能从中获益，最多提升25%治疗效果。',
      },
      {
        id: uuid(),
        name: '骤然突袭',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入突袭轮时，如果你是突袭发起方，你第一次伤害将造成1.5倍的效果。对玩家目标下降为1.3倍效果',
      },
      {
        id: uuid(),
        name: '精美烧鹅',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每一次跑团开始时，你会获得3只可以自由分享的美味烧鹅，与其他食物不同，纵使是重伤甚至濒死状态它依旧能提供自然回复效果，使用烧鹅时无法进行其他动作，需要引导5回合，每回合回复20%的最大生命/魔法值，自然回复效果不受治疗减免影响。引导中断或结束烧鹅就会消失。',
      },
      {
        id: uuid(),
        name: '无尽治愈',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '当你的持续治疗性法术结束时，你有10%的几率对治疗目标释放一次无消耗的治愈，将在5回合内治疗目标[等级*5]的生命值，无尽治愈天赋本身能触发无尽治愈。',
      },
      {
        id: uuid(),
        name: '过度治疗',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '当你对目标造成过量治疗时，过量治疗量会转化为临时护盾持续1回合。临时护盾上限为目标30%的最大生命值',
      },
      {
        id: uuid(),
        name: '互帮互助',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，当你受到治疗时，你会回馈50%治疗量给治疗者，当你对他人释放治疗时，你的50%治疗量会治疗自己。',
      },
      {
        id: uuid(),
        name: '希望化身',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '当你进入战斗轮时，若你受到致命的伤害，你会化身为无敌的天使，持续2回合，在希望化身期间你能无影响地释放治疗法术，化身结束你将死亡。化身会打断你化身前释放的引导法术。',
      },
      {
        id: uuid(),
        name: '矢量压缩能量池',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你的每点知识会为你带来额外的2点魔法值上限和1%的治疗加成。',
      },
      {
        id: uuid(),
        name: '无声陪伴',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每一次跑团开始时，你会获得一个神秘的小精灵，当你遇到解决不了的问题时，她会为你提供最优解，然后消失。',
      },
      {
        id: uuid(),
        name: '千万回忆',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你的单一目标即刻治疗效果会反复回响在目标身上产生效果，一回合后治疗目标此次治疗15%的治疗量，两回合后治疗目标此次治疗5%的治疗量。',
      },
      {
        id: uuid(),
        name: '伤口包扎',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '当你进入战斗轮时，你的(单体/群体)治疗效果会使目标抵抗(20%/10%)因为血量过低而造成的属性下降效果，持续1回合。',
      },
      {
        id: uuid(),
        name: '生死时速',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时,你对濒死的目标提高50%的治疗效果。',
      },
      {
        id: uuid(),
        name: '狡黠之思',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你的每点智慧都会给予你额外的2点最大魔法值和1点/回合的魔法值回复。',
      },
      {
        id: uuid(),
        name: '忏悔',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每一次跑团开始时，你会获得25%的治疗效果加成，每次击杀/助攻一个角色(*任何pl和npc),都会使这个效果下降10%，下限0%。',
      },
      {
        id: uuid(),
        name: '雾鸣',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每一次进入战斗轮时，你的当前位置会被雾气笼罩，这会尽可能地削弱NPC对你的敌意，并且玩家目标对你的非指向性法术和非群体法术有50%几率闪避，持续1回合。',
      },
      {
        id: uuid(),
        name: '过度免疫',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你对大于你20%最大生命值的伤害有20%的减伤',
      },
      {
        id: uuid(),
        name: '壮士解腕',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，每当你受到足以致死的伤害，你会立刻减少自己的最大生命值来以0.5的比例地抵消伤害，如果不足以抵消则会死亡，如足以抵消则会扣除这部分的最大生命值。无论何时，每当你试图释放一个蓝量不足以释放的法术时，你会立刻减少自己的最大魔法值来以0.5的比例地抵消消耗，如果不足以抵消则会返回这部分最大魔法值，如足以抵消则会扣除这部分的最大魔法值并施法，扣除效果直到结团。',
      },
      {
        id: uuid(),
        name: '寰宇之视',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你都能获得最后一个受到你治疗效果的目标的大致位置。',
      },
      {
        id: uuid(),
        name: '一心',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每当你进入战斗轮时，你对同一目标的治疗效果会随着你对他的治疗次数提升5%，最多提升25%的效果，转移目标失去效果。',
      },
      {
        id: uuid(),
        name: '振奋',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每当你进入战斗轮时，你的单体治疗效果会使得目标获得10%的移速加成和10%的伤害加成，最多作用于一个目标，持续1回合。',
      },
      {
        id: uuid(),
        name: '永恒',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你减少的魔法值会以10%的比例转化为你的生命值，你减少的生命值会以10%的比例转化为你的魔法值。',
      },
      {
        id: uuid(),
        name: '跃动之火',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，每当你移动时，你会发出璀璨的亮光，并且提高自身10%的最大生命上限，停止移动后加成消失。',
      },
      {
        id: uuid(),
        name: '救世之力',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '当你死亡时，你最后的力量会爆发出来，你可以选择一个目标恢复他25%的最大生命值，并且提供一回合的20%伤害减免。',
      },
      {
        id: uuid(),
        name: '蝴蝶效应',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每一次跑团开始时，你将可以指定一个目标，使他获得5%的伤害加成和5%的伤害减免，持续一回合，然后在一回合后转移此效果给你，之后再转移给他，如此反复。',
      },
      {
        id: uuid(),
        name: '强化护盾',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你提供的护盾效果增强10%，并且目标持有护盾时获得5%的伤害减免。',
      },
      {
        id: uuid(),
        name: '奥术之眼',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '每一次跑团开始时，你将会获得一份完整的魔法值地图。',
      },
      {
        id: uuid(),
        name: '反斩杀回复',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你的单体治疗效果将使目标免收因为生命值低下而受到的额外伤害。',
      },
      {
        id: uuid(),
        name: '感官混乱',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你的减益类触发效果在效果正常结束时，有10%的几率再次维持一回合。',
      },
      {
        id: uuid(),
        name: '火源之力',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: '无论何时，你的受伤状态都会影响你的治疗效果，当你无伤/轻伤时治疗效果提高20%，当你中伤/重伤时提高10%，当你濒死时提高0%。',
      },
      {
        id: uuid(),
        name: '知命安身',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你脱离战斗轮时，移除所有你在战斗轮中受到的负面效果。',
      },
      {
        id: uuid(),
        name: '图穷匕现',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '当你进入突袭轮时，如果你是突袭轮的发起者，那你会在突袭轮中获得50%的额外移速，并且能额外进行一次行动，但你造成的伤害效果下降25%。',
      },
      {
        id: uuid(),
        name: '狂风恶浪',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你获得20%的额外移速，在玩家目标存活数小于等于3的时候，额外移速加成提升至35%。',
      },
      {
        id: uuid(),
        name: '人类基因工程',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你都拥有额外全加成的5%生命上限，并且减少15%疾病，中毒伤害。',
      },
      {
        id: uuid(),
        name: '数魔转换器',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你的科技武器造成的伤害享受魔法伤害可以享受的所有加成。',
      },
      {
        id: uuid(),
        name: '罪上加罪',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你每参与一次击杀，你都会获得2.5%的经验加成(上限10%)，和10%的已损生命、魔法回复效果。',
      },
      {
        id: uuid(),
        name: '以逸待劳',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你每度过一个自然回合，你都会在参与下一个战斗轮时，回复5%的最大生命值(最多回复50%)。',
      },
      {
        id: uuid(),
        name: '抗魔体质',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你减免10%的魔法伤害。',
      },
      {
        id: uuid(),
        name: '日薄崦嵫',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你都会减免距离你过远的伤害，距离10码开始减免[距离 * 1 点伤害]，至多减免20%的伤害，当你死亡后，时间会重置为晚上6点。',
      },
      {
        id: uuid(),
        name: '魔网延伸',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你获得5%的额外法术射程，和5%的额外召唤物离主距离。',
      },
      {
        id: uuid(),
        name: '重命名吊牌',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你的召唤物获得无限的离主距离，但是在离主距离超过原有距离时，你的召唤物会暂时从 世界中卸载，当离主距离到原有距离中时，召唤物会被重新装载回世界中，此外，你还可以每个世界都给召唤物重新起个名字。',
      },
      {
        id: uuid(),
        name: '禅宗古训',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.普通天赋,
        eventBuffs: [],
        graph: undefined,
        createdAt: '2022-01-18 9:49:59',
        desc: '无论何时，你的物理伤害会造成15%的吸血效果。',
      },
      /* 这个是开玩笑的，千万别真的放出来,没做实际效果。
      {
        id: uuid(),
        name: '上勾拳续命',
        group: 0,
        tags: '',
        buff: [],
        args: [],
        type: ISkillsPoolType.支援天赋,
        eventBuffs: [],
        graph:undefined,
        createdAt: '2022-01-14 22:13:59',
        desc: `只能触发一次，当你受到致死伤害时，会从你四周凭空出现一个有黑色卤蛋头，带着大拳套的男人，蓄力火箭重拳将你大幅击退至敌人的反方向，
        并且用强力的上勾拳将你击飞并回复你20%的最大生命值，如果这部分回复不足以抵消伤害，那你仍旧会死亡，但至少死得很酷。`,
      },
      */
    ]
  return TalentPools
}