import { makeAutoObservable, toJS } from "mobx";
import { Papa } from ".";
import Group, { Team, TeamPcIdx, GroupProps, panes, skillEditModal, IWorldModal, IWorld, IArea, ChatAreaPcIdx, sendTo, ChatAreaIdx, TimeOutNegative } from "./GroupStore";
import Chat, { chatType, messageType, miraiContent, miraiMessageChain } from "./ChatStore";
import {
  makePersistable,
  getPersistedStore,

} from "mobx-persist-store";
import { Space, Button, notification } from 'antd';
import { ChatController, Message, MessageContent } from "chat-ui-react";
import { Item } from "@/component/chat/ChatListItem";
import { statusModal } from './GroupStore'
import { ControlPosition } from "react-draggable";
import Status from "./StatusStore";
import Pc from "./PcStore";
import { message } from 'antd';
import { teamChatReg, preHandle, worldChatReg } from "@/api/handle/msgHandle";
import { exchangeType, pcInStatusExchange, statusEnum, statusType, Zh_statusType } from "@/api/handle/exchangeHandle";
import { exportDefaultSpecifier } from "@babel/types";
import { waitTime } from "@/utils/await";
import Skill, { SkillTargetEnum, SkillTypeEnum } from "./SkillStore";
import { WebSocketServer } from 'ws';
import { getEnumKeysOrValue, getValue, setValue, setValues } from "@/utils/findObjectAttr";
import Buff, { basicEnum, DMG, DMGTypeEnum, EffectEnum, heal, healTypeEnum, TargetEnum } from "./BuffStore";
import { BreakfastDiningOutlined, TurnedInSharp } from "@mui/icons-material";
import { BFPTR, formatFloat, hasDot, randomRangeInt } from "@/utils/number";
import { InitNodes } from "@/component/chart/NodesInit";
import '@antv/x6-react-shape'
import { uuid } from "@/utils/uuid";
import { formatTime } from "@/utils/time";
import { findNextNodeAndEdge, IBluePrint } from "@/component/chart/SkillEditChart";
import { buffBuilder, IEventBuffs } from "@/utils/buffMachine";
import { InitTalentPool } from "./TalentsStore";
import { saveAs } from 'file-saver';
import { ModalManager } from "@material-ui/core";
import ReconnectingWebSocket from "reconnectingwebsocket";
import { CheckedRandomItem } from "@/pages/pool/randomModalBtn";
import { geneMaxExp } from "@/utils/exp";
export const MiraiWarn = `'月莓' 模组引用到了开源项目'mirai-api-http',任何团队和个人不得进行商业化使用，包括但不限于开收费团等商业活动。
'月莓'采用AGPLv3协议开源，不鼓励一切商业化使用，请pl注意，每一次st使用'月莓'模组开团时你都一定会收到此消息，如果你在跑其他使用'月莓'模组的团时没有收到此消息或st对参团进行收费，请拒绝参团，这是为了整个社区的良性发展！
以下是开源项目的github链接：
  'mirai':https://github.com/mamoe/mirai
  'mirai-api-http':https://github.com/project-mirai/mirai-api-http
  '月莓':https://github.com/moe-moe-pupil/moonberry
感谢所有mirai开发者的无私付出以及所有其他库的贡献者，没有他们就不会有这个模组。\n`

export enum ModalType {
  pc = 'currentPcModal',
  area = 'currentTeamModal',
  skill = 'currentSkillEditModal',
  world = 'currentWorld',
}
export interface nowChecked {
  equal: boolean;
  negative: boolean;
  mid: number;
}

export interface RootProps {
  groups: Group[] | undefined;
  currentGroup: number;
  config: {
    canChatListAdd: boolean;
  }
  chatCtl: ChatController | undefined;
  skillsPool: ISkillsPool[];
  pcFresh: number
}

export enum formatType {
  字符串 = 'string',
  数字 = 'number',
}

export enum HPStatus {
  无伤 = '无伤',
  轻伤 = '轻伤',
  中伤 = '中伤',
  重伤 = '重伤',
  濒死 = '濒死'
}

export enum rootConfig {
  canChatListAdd = 'canChatListAdd',
  Ue4Enable = 'Ue4Enable',
  orderByTurn = 'orderByTurn',
  negative = 'negative'
}

export enum ArgsTypes {
  'number' = '数字',
  'string' = '字符串',
  'BUFF' = 'BUFF'
}

export const ArgsTypesStrs = [
  ArgsTypes.number,
  ArgsTypes.string,
  ArgsTypes.BUFF,
]

export interface IArgs {
  name: string,
  type: ArgsTypes,
  value: string,
}

export enum ISkillsPoolType {
  '支援天赋',
  '普通天赋',
  '普通',
  'BUFF效果'
}

export interface ISkillsPool {
  id: string,
  name: string,
  group: number,//>10000时对应QQ号，其他情况为 团的数组下标
  tags: string,
  buff: Buff[],
  args: IArgs[],
  type: ISkillsPoolType
  graph: object | undefined,
  eventBuffs: IEventBuffs[],
  createdAt: string,
  desc: string,
}


export interface IRandomPool {
  id: string,
  name: string,
  group: number,//>10000时对应QQ号，其他情况为 团的数组下标
  tags: string,
  createdAt: string,
  desc: string,
  IRandomItem: IRandomItem[],
}

export interface IRandomItem {
  key: string,
  RandomItemDesc: string,
  min: number,
  max: number,
}

const stateArr = [
  '正在链接中',
  '已经链接并且可以通讯',
  '连接正在关闭',
  '连接已关闭或者没有链接成功',
];

export interface IRootConfig {
  canChatListAdd: boolean,
  Ue4Enable: boolean,
  orderByTurn: boolean,
  negative: boolean,
}

export default class Root implements RootProps {
  //自动保存内容
  refuseListQQNumber: number[] = []
  discriminator: string = 'Root';
  groups: Group[] = [];
  currentGroup: number = 0;
  config: IRootConfig = { canChatListAdd: true, Ue4Enable: false, orderByTurn: false, negative: true };
  skillsPool: ISkillsPool[] = [];
  randomPool: IRandomPool[] = [];
  dataObj = {}
  //不保存内容
  ws: ReconnectingWebSocket = new ReconnectingWebSocket('ws://localhost:8080/message?verifyKey=1234567890');
  wsJS2UE4: ReconnectingWebSocket = new ReconnectingWebSocket('ws://localhost:7778/');
  chatCtl: ChatController | undefined = undefined;
  pcFresh: number = 0;
  chatlistFresh: number = 0;
  chatAreaFresh: number = 0;
  Ue4Connected: boolean = false;
  miraiConnected: boolean = false;
  openNotification = (nickName: string, Id: number, text: string) => {
    const key = Id.toString();
    const btn = (
      <>
        <Space>
          <Button size="small" onClick={() => {
            notification.close(key)
            this.ezSendText(Id, ['你被ST拒绝了，下次再来试试吧。'])
          }}>
            拒绝
          </Button>
          <Button type="primary" size="small" onClick={() => {
            notification.close(key)
            const nowGroup = this.groups[this.currentGroup]
            this.chatListAdd(nickName, Id, this.getLastMsgByQQnumber(Id))
            this.ezSendText(Id, ['恭喜，你已经入团了。\n',
              '请先兑换吧，使用【 。兑换 】即可，值得一提的是，命令全都是对使用者友好的，也就是你无需区分中英文句号。.\n',
              '指令全部使用【】包裹，请不要把【】输入进去\n',
              '示例：\n',
              '。兑换',
              MiraiWarn,
              `团描述：${nowGroup.guide}`,
            ])
          }}>
            同意
          </Button>
        </Space>
      </>
    );
    notification.open({
      message: '有人向你发送了消息，允许他/她/它入团吗？',
      description: nickName + ' ( ' + Id.toString() + ' ) 向你发送了消息『'
        + text
        + '』，如果你愿意的话，他/她/它将加入团',
      btn,
      key: key,
      onClose: close,
      duration: 0,
    });
  };
  /**
   * Root类为根类，操作一切可管理内容
   * @constructor 
   */
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "RootStore",
      properties: ["groups", "currentGroup", "config", "skillsPool", "dataObj", "randomPool"],
      storage: window.localStorage
    });
    InitNodes();
    this.updateAllObj();
    this.ws.onconnecting = e => {
      message.info('正在尝试连接到mirai-api-http')
    }
    this.ws.onopen = e => {
      this.miraiConnected = true
      message.success('成功连接到mirai-api-http!')
    }

    this.ws.onclose = e => {
      this.miraiConnected = false
      message.error('连接断开了,请确认你打开了mirai-api-http')
    }

    this.ws.onerror = e => {
    }

    this.ws.onmessage = e => {
      preHandle(this, e);
    }

    this.wsJS2UE4.onconnecting = e => {
      if (this.config.Ue4Enable) {
        message.info('正在尝试连接到柳絮')
      }
    }
    this.wsJS2UE4.onopen = e => {
      this.Ue4Connected = true
      if (this.config.Ue4Enable) {
        message.success('成功连接到柳絮')
      }

    }

    this.wsJS2UE4.onclose = e => {
      this.Ue4Connected = false
      if (this.config.Ue4Enable) {
        message.error('和柳絮的连接失败了,请确保你开启了柳絮')
      }
    }

    this.wsJS2UE4.onerror = e => {
      this.Ue4Connected = false
      if (this.config.Ue4Enable) {
        message.error('和柳絮的连接失败了,请确保你开启了柳絮')
      }
    }

    this.ws.onerror = e => {
      this.miraiConnected = false
      message.error('和mirai-api-http的连接失败了,请确保你开启了mirai-api-http')
    }

    this.wsJS2UE4.onmessage = e => {
    }
  }

  set ChatCtl(ctl: ChatController) {
    this.chatCtl = ctl;
  }

  /**
   * 设置UE4可用
   * @param enable 可用?
   */
  setUe4Enable(enable: boolean) {
    this.config.Ue4Enable = enable
  }

  ezAddDataObjProp(key: string, value: any) {
    this.dataObj[key] = value
  }

  /**
   * 清空技能池
   */
  skillsPoolClear() {
    this.skillsPool = InitTalentPool()
    this.dataObj = {}
    this.groups[this.currentGroup].currentSkillEdit = []
  }

  /**
   * 更新Pc对象,因为涉及自动保存，所有旧Pc对象可能会缺失属性
   */
  updateAllPcObj() {
    const newAllPcList: Pc[] = []
    this.AllPcList.map((pc) => {
      const newPc = new Pc();
      const newSkills: Skill[] = []
      Object.assign(newPc, pc)
      newPc.skillChain.map((skill) => {
        const newSkill = new Skill()
        Object.assign(newSkill, skill)
        newSkills.push(newSkill)
      })
      newPc.skillChain = newSkills
      newAllPcList.push(newPc)
      //console.log(newPc, pc)
    })
    if (this.groups.length != 0) {
      this.groups[this.currentGroup].pc = newAllPcList
    }
  }

  /**
   * 更新所有的设置
   */
  updateAllRootConfigObj() {
    const newRootConfig: IRootConfig = {
      canChatListAdd: this.config.canChatListAdd || true,
      Ue4Enable: this.config.Ue4Enable || false,
      orderByTurn: this.config.orderByTurn || false,
      negative: this.config.negative || false,
    }
    this.config = newRootConfig
  }

  /**
   * 更新所有的团对象
   */
  updateAllGroupObj() {
    const newGroups: Group[] = []
    this.groups.map((group) => {
      const newGroup = new Group()
      Object.assign(newGroup, group)
      if (newGroup.negative.length == 0) {
        this.AllPcList.map((pc) => {
          const newTimeOut: TimeOutNegative = {
            Id: pc.Id,
            remain: 0,
            reply: false,
            idx: 0,
          }
          newGroup.negative.push(newTimeOut)
        })
      }
      newGroups.push(newGroup)
    })
    this.groups = newGroups
  }

  /**
   * 更新所有内容
   */
  updateAllObj() {
    this.updateAllPcObj()
    this.updateAllRootConfigObj()
    this.updateAllGroupObj()
  }

  /**
   * 更新技能效果，通常在技能池更新后触发
   * @param poolId 技能池ID
   * @param buffs 技能BUFF效果
   * @param targetEvent 蓝图事件
   */
  updateSkillsBuffs(poolId: string, buffs: Buff[], targetEvent: string) {
    this.AllPcList.map((pc, idx) => {
      const nowPc = pc;
      pc.skillChain.map((skill, idx) => {
        if (skill.poolId == poolId) {
          const newSkill = nowPc.skillChain.slice()
          newSkill[idx].buffMachine[targetEvent] = buffs
          nowPc.skillChain = newSkill
        }
      })
      this.updatePcStatus(pc)
    })
  }

  /**
   * 更新技能参数，通常在技能池更新后触发
   * @param poolId 技能池Id
   * @param poolArgs 技能池参数
   */
  updateSkillsArgs(poolId: string, poolArgs: IArgs[]) {
    this.AllPcList.map((pc, idx) => {
      const nowPc = pc;
      pc.skillChain.map((skill, idx) => {
        if (skill.poolId == poolId) {
          const newArgs: IArgs[] = []
          poolArgs.map((arg, idx) => {
            const newArg: IArgs = {
              name: arg.name,
              type: arg.type,
              value: skill.args[idx] ? skill.args[idx].value : arg.value
            }
            newArgs.push(newArg)
          })
          const newSkill = nowPc.skillChain.slice()
          newSkill[idx].args = newArgs
          newSkill[idx].poolId = poolId
          nowPc.skillChain = newSkill
        }
      })
      this.updatePcStatus(pc)
    })
  }

  /**
   * 删除技能池参数
   * @param Id 技能池Id
   * @param argsIdx 技能池参数数组下标
   */
  skillsPoolArgsDelById(Id: string, argsIdx: number) {
    const idx = this.findEffectById(Id)
    if (idx != -1) {
      const newSkillsPool = this.skillsPool.slice()
      newSkillsPool[idx].args.splice(argsIdx, 1)
      this.skillsPool = newSkillsPool
      this.updateSkillsArgs(Id, newSkillsPool[idx].args)
    }
  }

  /**
   * 设置技能池参数
   * @param Id 技能池Id
   * @param args 技能池参数数组
   */
  skillsPoolArgsSetById(Id: string, args: IArgs[]) {
    const idx = this.findEffectById(Id)
    if (idx != -1) {
      const newSkillsPool = this.skillsPool.slice()
      newSkillsPool[idx].args = args
      this.skillsPool = newSkillsPool
      this.updateSkillsArgs(Id, args)
    }
  }

  /**
   * 技能池参数增加
   * @param Id 技能池参数Id
   * @param newArgs 新技能池参数
   */
  skillsPoolArgsAddById(Id: string, newArgs: IArgs = {
    name: "自定义数字",
    type: ArgsTypes.number,
    value: "0"
  }) {
    const idx = this.findEffectById(Id)
    if (idx != -1) {
      const newSkillsPool = this.skillsPool.slice()
      if (newArgs.type != ArgsTypes.BUFF) {
        newSkillsPool[idx].args.push(newArgs)
      } else {
        const nowPool = this.getEffectById(newArgs.value)
        if (nowPool) {
          newSkillsPool[idx].args.push(...nowPool.args)
        }
      }
      this.skillsPool = newSkillsPool
      this.updateSkillsArgs(Id, newSkillsPool[idx].args)
    }
  }

  /**
   * 设置技能池
   * @param pool 技能池
   */
  setSkillsPoolById(pool: ISkillsPool) {
    const idx = this.findEffectById(pool.id)
    if (idx != -1) {
      const newSkillsPool = this.skillsPool.slice()
      newSkillsPool[idx] = pool
      const newArgs: IArgs[] = []
      newSkillsPool[idx].args.map((arg) => {
        newArgs.push(arg)
        if (arg.type == ArgsTypes.BUFF) {
          const nowPool = this.getEffectById(arg.value)
          if (nowPool) {
            newArgs.push(...nowPool.args)
          }
        }
      })
      newSkillsPool[idx].args = newArgs
      this.skillsPool = newSkillsPool
      this.updateSkillsArgs(pool.id, pool.args)
    }
  }

  /**
   * 添加技能
   * @param nowPc 目标Pc
   * @param skill 技能对象
   * @param inited 是否初始化
   */
  skillAdd(nowPc: Pc, skill?: Skill, inited: boolean = false) {
    if (skill) {
      nowPc.skillChain.push(skill)
    } else {
      const newSkill = new Skill()
      newSkill.stInited = inited
      nowPc.skillChain.push(newSkill)
    }
  }

  /**
  * 设置随机池
  * @param pool 随机池
  */
  setRandomsPoolById(pool: IRandomPool) {
    const idx = this.findRandomPoolById(pool.id)
    if (idx != -1) {
      const newRandomPool = this.randomPool.slice()
      newRandomPool[idx] = pool
      this.randomPool = newRandomPool
    }
  }


  /**
   * 技能池删除
   * @param Id 技能池Id
   */
  skillsPoolDelById(Id: string) {
    const idx = this.findEffectById(Id)
    if (idx != -1) {
      const newSkillsPool = this.skillsPool.slice()
      newSkillsPool.splice(idx, 1)
      this.skillsPool = newSkillsPool
      this.updateSkillsArgs(Id, [])
    }
  }

  /**
   * 新增技能池
   * @param name 技能池名字
   * @param group 对应团
   * @param tags 标签
   * @param type 类型
   */
  skillsPoolAdd(name: string, group: number, tags: string, type: ISkillsPoolType = ISkillsPoolType.普通) {
    const newSkill: ISkillsPool = {
      id: uuid(),
      name: name,
      group: group,
      tags: tags,
      buff: [],
      args: [],
      graph: undefined,
      createdAt: formatTime(new Date()),
      eventBuffs: [],
      type: type,
      desc: '',
    }
    const newSkillsPool = this.skillsPool.slice()
    newSkillsPool.push(newSkill)
    this.skillsPool = newSkillsPool
  }

  /**
   * 新增随机池
   * @param name 名称
   * @param group 对应团Id
   * @param tags 标签
   * @param desc 描述
   * @param IRandomItems 随机项
   */
  randomPoolAdd(name: string, group: number, tags: string, desc: string, IRandomItems: IRandomItem[]) {
    const newRandom: IRandomPool = {
      id: uuid(),
      name: name,
      group: group,
      tags: tags,
      createdAt: formatTime(new Date()),
      desc: desc,
      IRandomItem: IRandomItems
    }
    const newRandomPool = this.randomPool.slice()
    newRandomPool.push(newRandom)
    this.randomPool = newRandomPool
  }
  /**
   * 复原Pc状态到无损
   * @param nowPc 
   */
  resumePcStatus(nowPc: Pc) {
    nowPc.hp = nowPc.maxHP
    nowPc.mp = nowPc.maxMP
  }

  /**
   * 删除Pc某个轮次
   * @param id pc的Id值,通常是qq号
   * @param idx 轮次
   */
  delPcTurn(id: number, idx: number) {
    if (idx != 0 && this.getPcsByQQNumber(id).length > 1) {
      const nowPcIdx = this.findPcByQQNumber(id, idx)
      if (nowPcIdx != -1) {
        this.groups[this.currentGroup].pc.splice(nowPcIdx, 1)
      }
    }
  }

  /**
   * pc进入下一轮次
   * @param id pcId,qq登录为qq账号
   * @param idx idx对应着pc轮次
   * @param resume 是否复原pc状态?
   */
  pcNextTurn(id: number, idx: number = -1, resume: boolean = false) {
    const nowPc = this.getPcByQQNumber(id, idx)
    const lastPc = this.getPcByQQNumber(id)
    const nowNegative = this.getNegativeById(id)
    if (nowNegative) {
      nowNegative.reply = false
      nowNegative.remain = 0
      nowNegative.idx += 1
    }
    if (nowPc && nowPc.inited && lastPc) {
      const newPc = Object.assign({}, nowPc)
      const nowPcs = this.groups[this.currentGroup].pc
      nowPcs.push(newPc)
      this.updatePcStatus(nowPcs[nowPcs.length - 1], resume, true)
    }
    if (this.config.orderByTurn) {
      this.groups[this.currentGroup].currentChatList.sort((a, b) => {
        const nowAPc = this.getPcByQQNumber(a.Id)
        const nowBPc = this.getPcByQQNumber(b.Id)
        if (nowAPc && nowBPc) {
          return nowAPc.turn - nowBPc.turn
        } else {
          return a.Id - b.Id
        }
      })
      this.chatlistFresh += 1
    }
    if (this.config.negative) {
      const nowChecked = this.checkedIfHalfPcOverTurn()
      this.startNegativeTimeOut(nowChecked, this.AllPcList, 1000 * 60 * 2)
    }
  }

  startNegativeTimeOut(nowChecked: nowChecked, pcs: Pc[], remain: number) {
    if (nowChecked.negative) {
      pcs.map((pc) => {
        if (pc.hp > 0) {
          if (pc.turn < nowChecked.mid) {
            this.setNegativeTimeOutById(pc.Id, remain)
          } else {
            if (pc.turn == nowChecked.mid && nowChecked.equal) {
              this.setNegativeTimeOutById(pc.Id, remain)
            }
          }
        }

      })
    }
  }
  /**
   * 设置倒计时
   * @param Id 
   * @param remain 
   */
  setNegativeTimeOutById(Id: number, remain: number) {
    const nowNegative = this.getNegativeById(Id)
    if (nowNegative && (nowNegative.remain == 0 || remain == 0)) {
      nowNegative.remain = remain;
      if (remain != 0 && !nowNegative.reply) {
        this.timeOutTriggerNegative(nowNegative, Id, remain)
        this.ezSendText(Id, ['已经有一半的玩家进入下一回合, 消极倒计时2分钟, 2分钟内未有任何回复,将会直接跳过此回合,并叠加一层消极。'], false)
      }
    }
    if (nowNegative && nowNegative.remain != 0 && remain != 0) {
      this.timeOutTriggerNegative(nowNegative, Id, remain)
    }
  }

  /**
   * 倒计时触发消极
   * @param nowNegative 
   * @param Id 
   * @param remain 
   */
  timeOutTriggerNegative(nowNegative: TimeOutNegative, Id: number, remain: number) {
    nowNegative.idx += 1;
    const nowIdx = nowNegative.idx
    const lastCountTimer = setTimeout(() => {
      if (nowNegative.remain == 0 || nowIdx != nowNegative.idx) {
        clearTimeout(lastCountTimer)
      } else {
        this.ezSendText(Id, ['消极倒计时已经过去一半,请尽快回复。'], true, false)
      }
    }, remain / 2)
    const negativeTimer = setTimeout(() => {
      if (nowNegative.remain == 0 || nowIdx != nowNegative.idx) {
        clearTimeout(negativeTimer)
      } else {
        this.ezSendText(Id, ['因为未回复, 你的回合已被跳过, 并叠加了一层消极'], true, false)
        this.pcNextTurn(Id)
      }
    }, remain)
  }

  /**
   * 检测是否有半数玩家进入下一回合
   */
  checkedIfHalfPcOverTurn() {
    const nowTurns = this.allAlivePcTurn.concat()
    const midIdx = BFPTR(nowTurns, 0, nowTurns.length, Math.ceil(nowTurns.length / 2))
    const nowMid = nowTurns[midIdx]
    var addMid = false
    if (nowTurns[midIdx - 1] == undefined) {
      addMid = true
    } else {
      if (nowMid == nowTurns[midIdx - 1]) {
        addMid = true
      }
    }
    var negative = false
    var lCount = 0
    var rCount = 0

    for (var i = 0; i < nowTurns.length; i++) {
      if (nowTurns[i] > nowMid) {
        rCount++;
      } else {
        if (nowTurns[i] == nowMid) {
          if (addMid) {
            lCount++;
          } else {
            rCount++;
          }
        } else {
          lCount++;
        }
      }
    }
    if (rCount >= lCount) {
      negative = true;
    }

    const nowChecked: nowChecked = {
      equal: addMid,
      negative: negative,
      mid: nowMid
    }
    return nowChecked
  }

  /**
   * 杀死pc
   * @param nowPc 传入pc对象
   */
  killPc(nowPc: Pc) {
    nowPc.hp = -999999
    this.updatePcStatus(nowPc)
  }

  /**
   * 更新pc状态
   * 任一角色数据更新后触发，或者进入下一轮次
   * @param nowPc 传入pc对象
   * @param resume 是否复原pc状态?
   * @param nextTurn 是否进入下一轮次?
   */
  updatePcStatus(nowPc: Pc, resume = false, nextTurn = false, log = '') {
    //console.log(nowPc.nickname + "刷新了", nextTurn)
    console.log(log)
    const nowGroup = this.groups[this.currentGroup];
    nowPc.maxHP = nowPc.lv * nowGroup.basicConfig.lvMaxHP + (nowPc.status.str) * nowGroup.basicConfig.strMaxHP + (nowPc.status.vit) * nowGroup.basicConfig.vitMaxHP
    nowPc.maxMP = (nowPc.status.int) * nowGroup.basicConfig.intMaxMP + (+ nowPc.status.wis) * nowGroup.basicConfig.wisMaxMP
    nowPc.hpReg = (nowPc.status.vit) * nowGroup.basicConfig.vitHPReg
    nowPc.mpReg = (nowPc.status.wis) * nowGroup.basicConfig.wisMPReg
    nowPc.DMGModify = 1
    nowPc.healModify = 1
    setValues(nowPc.extraStatus, 0)
    const beforePcBuff = JSON.stringify(nowPc.buff)
    this.updatePcBuff(nowPc, nextTurn)
    nowPc.maxHP += nowPc.extraStatus.str * nowGroup.basicConfig.strMaxHP + nowPc.extraStatus.vit * nowGroup.basicConfig.vitMaxHP
    nowPc.maxMP += (nowPc.extraStatus.int) * nowGroup.basicConfig.intMaxMP + (nowPc.extraStatus.wis) * nowGroup.basicConfig.wisMaxMP
    nowPc.hpReg += (nowPc.extraStatus.vit) * nowGroup.basicConfig.vitHPReg
    nowPc.mpReg += (nowPc.extraStatus.wis) * nowGroup.basicConfig.wisMPReg
    for (var i in nowPc.totalStatus) {
      nowPc.totalStatus[i] = nowPc.status[i] + nowPc.extraStatus[i]
    }
    nowPc.speed = nowPc.totalStatus.str * nowGroup.basicConfig.strSpeed + nowPc.totalStatus.dex * nowGroup.basicConfig.dexSpeed + nowPc.totalStatus.agi * nowGroup.basicConfig.agiSpeed + nowGroup.basicConfig.basicSpeed
    if (nextTurn) {
      const nowHPStatus = this.formatHPStatus(nowPc.hp, nowPc.maxHP)
      const nowArea = this.getPcChatAreaById(nowPc.Id)
      if (nowHPStatus != HPStatus.重伤 && nowHPStatus != HPStatus.濒死 && (!nowArea || (nowArea && !nowArea.combat))) {
        nowPc.hp += nowPc.hpReg
      }
      nowPc.turn += 1
      nowPc.mp += nowPc.mpReg
      nowPc.skillChain.map((skill) => {
        if (skill.cooldownLeft > 0) {
          skill.cooldownLeft -= 1
        }
      })
    }
    if (nowPc.hp > nowPc.maxHP)
      nowPc.hp = nowPc.maxHP
    if (nowPc.mp > nowPc.maxMP)
      nowPc.mp = nowPc.maxMP
    if (resume) {
      this.resumePcStatus(nowPc)
    }
    this.pcFresh += 1
    if (beforePcBuff != JSON.stringify(nowPc.buff)) {
      this.updatePcStatus(nowPc, false, false, 'BUFF改变')
    }
    const newHP = formatFloat(nowPc.hp, 2)
    nowPc.hp = typeof newHP != 'boolean'? newHP : -1
  }

  /**
   * 获得所有技能被动效果参数
   * @param nowPc 传入pc对象
   * @returns {Args, Buffs} 输出参数数据及其Buff
   */
  getAllSKillsPassiveBuffArgs(nowPc: Pc) {
    return nowPc.skillChain.map((skill) => {
      const Buffs: Buff[] = []
      const Args: IArgs[] = skill.args
      if (skill.buffMachine['被动'] && Array.isArray(skill.buffMachine['被动'])) {
        skill.buffMachine['被动'].map((buff: Buff) => {
          Buffs.push(buff)
        })
      }
      return { args: Args, buffs: Buffs }
    })
  }

  /**
   * 将技能池参数替换为技能参数
   * @param s 参数名
   * @param args 参数数组
   * @returns {string} 技能参数值
   */
  replaceArgsToValue(s: string, args: IArgs[]): string {
    var value = ''
    args.map((arg) => {
      if (arg.name == s) {
        value = arg.value
      }
    })
    return value
  }

  /**
   * 基础buff效果处理
   * @param nowPc 传入pc对象
   * @param buff 传入buff对象
   * @param effect 效果
   * @param idx 对应value数组下标
   * @param args 传入参数对象数组  
   */
  basicBuffEffectHandle(nowPc: Pc, buff: Buff, effect: EffectEnum, idx: number, args?: IArgs[]) {
    console.log('基础BUFF处理', buff)
    const buffValue = args ? this.replaceArgsToValue(buff.value[idx], args) + '' : buff.value[idx] + ''
    const lastChar = buffValue.charAt(buffValue.length - 1)
    var staticStatus = ''
    var exactly = false
    var tarParKey = ''
    if (getEnumKeysOrValue(statusEnum).indexOf(effect) != -1) {
      tarParKey = 'extra'
      staticStatus = 'status'
      exactly = true
    }
    const nowValue = getValue(nowPc, effect, '', staticStatus, exactly)
    const extraValue = getValue(nowPc, effect, '', tarParKey)
    console.log('lastChar', buffValue, nowValue, effect, tarParKey, lastChar, parseFloat(buffValue.slice(0, buffValue.length - 1)))
    //console.log(JSON.stringify(nowPc))
    //console.log(`正在修改属性${tarParKey + effect}`)
    //console.log("修改前数值数值" + nowValue)
    if (nowValue != 'Error') {
      switch (buffValue.slice(0, 1)) {
        case "=":
          if (lastChar == "%") {
            setValue(nowPc, effect, parseInt(nowValue) * parseFloat(buffValue.slice(0, buffValue.length - 1)) / 100, '', tarParKey)
            //nowPc[effect] = nowPc[effect] * parseFloat(buffValue.slice(1, buffValue.length - 1))
          } else {
            setValue(nowPc, effect, parseFloat(buffValue.slice(1, buffValue.length)), '', tarParKey)
            //nowPc[effect] = parseFloat(buffValue.slice(1, buffValue.length))
          }
          break;
        default:
          if (lastChar == "%") {
            console.log('百分比修改', parseInt(nowValue) * parseFloat(buffValue.slice(0, buffValue.length - 1)))
            setValue(nowPc, effect, parseInt(nowValue) * (parseFloat(buffValue.slice(0, buffValue.length - 1)) / 100 + 1), '', tarParKey)
            //nowPc[effect] += nowPc[effect] * parseFloat(buffValue.slice(0, buffValue.length - 1))
          } else {
            setValue(nowPc, effect, parseInt(extraValue) + parseFloat(buffValue.slice(0, buffValue.length)), '', tarParKey)
            //nowPc[effect] += parseFloat(buffValue.slice(0, buffValue.length))
          }
          break;
      }
      //console.log("修改后数值数值" + getValue(nowPc, effect, '', tarParKey))
    }
  }

  /**
   * 额外buff效果处理
   * @param nowPc 传入pc对象
   * @param buff 传入buff对象
   * @param effect 效果
   * @param idx 对应value数组下标
   */
  extraBuffHanlde(nowPc: Pc, buff: Buff, effect: EffectEnum, idx: number) {
    switch (effect) {
      case EffectEnum.给予BUFF:
        const nowPool = this.getEffectById(buff.value[0])
        if (nowPool) {
          const tmpSkill = new Skill()
          tmpSkill.target = 99999
          tmpSkill.poolId = nowPool.id
          const tmpArgs = {}
          for (var i = 1; i < buff.value.length; i++) {
            tmpArgs[nowPool.args[i - 1].name] = buff.value[i]
          }
          tmpArgs['fromID'] = buff.from
          tmpArgs['targetsID'] = [nowPc.Id]
          tmpSkill.args = nowPool.args
          if (nowPool.eventBuffs && nowPool.eventBuffs.length != 0) {
            nowPool.eventBuffs.map((eb) => {
              if (eb) {
                tmpSkill.buffMachine[eb.event] = eb.buffs
              }
            })
          }
          this.triggerSkill(tmpSkill, tmpArgs)
        }
        break;
    }
  }

  /**
   * 预攻击buff处理
   * @param dmg 伤害对象
   * @returns 处理后伤害对象
   */
  preAttackDMGBuff(dmg: DMG) {
    const newDMG = Object.assign({}, dmg)
    this.DMGAttrBenifit(newDMG)
    this.DMGLowHPPunish(newDMG)
    this.DMGBuffModify(newDMG)
    return newDMG
  }

  /**
   * 伤害BUFF参数调整
   * @param dmg 伤害对象
   * @param dealDMGPc 伤害来源Pc
   * @returns {DMG} 处理后伤害对象
   */
  DMGBuffModify(dmg: DMG, dealDMGPc?: Pc): DMG {
    if (dealDMGPc) {
    } else {
      dealDMGPc = this.getPcByQQNumber(dmg.fromID)
    }
    if (dealDMGPc) {
      dmg.value *= dealDMGPc.DMGModify
    }
    return dmg;
  }


  /**
   * 治疗BUFF参数调整
   * @param heal 治疗对象
   * @param dealHealPc 治疗来源Pc
   * @returns {heal} 处理后治疗对象
   */
  healBuffModify(heal: heal, dealHealPc?: Pc): heal {
    if (dealHealPc) {
    } else {
      dealHealPc = this.getPcByQQNumber(heal.fromID)
    }
    if (dealHealPc) {
      heal.value *= dealHealPc.healModify
    }
    return heal;
  }

  /**
   * 伤害属性增益
   * @param dmg 伤害对象
   * @param dealDMGPc 伤害来源Pc对象
   * @returns {DMG} 处理后伤害对象
   */
  DMGAttrBenifit(dmg: DMG, dealDMGPc?: Pc): DMG {
    const nowGroup = this.groups[this.currentGroup]
    if (dealDMGPc) {

    } else {
      dealDMGPc = this.getPcByQQNumber(dmg.fromID)
    }
    if (dealDMGPc) {
      switch (dmg.type) {
        case DMGTypeEnum.Magical:
          dmg.value *= 1 + (dealDMGPc.totalStatus.int) * nowGroup.basicConfig.intDMGBenifit
          break;
        case DMGTypeEnum.Physical:
          dmg.value *= 1 + (dealDMGPc.totalStatus.str) * nowGroup.basicConfig.strDMGBenifit + ((dealDMGPc.totalStatus.agi) % 50) * nowGroup.basicConfig.agiDMGBenifit + (dealDMGPc.totalStatus.dex) * nowGroup.basicConfig.dexDMGBenifit
          break;
        case DMGTypeEnum.Range:
          dmg.value *= 1 + (dealDMGPc.totalStatus.dex) * nowGroup.basicConfig.dexRangeDMGBenifit
      }
    }
    return dmg;
  }

  /**
   * 伤害低生命值惩罚
   * @param dmg 伤害对象
   * @param dealDMGPc 伤害来源Pc对象
   * @returns {DMG} 处理后伤害对象
   */
  DMGLowHPPunish(dmg: DMG, dealDMGPc?: Pc): DMG {
    if (dealDMGPc) {
    } else {
      dealDMGPc = this.getPcByQQNumber(dmg.fromID)
    }
    if (dealDMGPc) {
      const nowDealtHP = dealDMGPc.maxHP - dealDMGPc.hp
      switch (this.formatHPStatus(dealDMGPc.hp, dealDMGPc.maxHP)) {
        case HPStatus.轻伤:
          dmg.value *= 1 - 0.1 * nowDealtHP / dealDMGPc.maxHP
          break;
        case HPStatus.中伤:
          dmg.value *= 1 - 0.5 * nowDealtHP / dealDMGPc.maxHP
          break;
        case HPStatus.重伤:
          dmg.value *= 1 - 1 * nowDealtHP / dealDMGPc.maxHP
          break;
        case HPStatus.濒死:
          dmg.value *= 1 - 1 * nowDealtHP / dealDMGPc.maxHP
          break;
      }
    }
    return dmg
  }

  /**
   * 预防御buff处理
   * @param nowPc pc对象
   * @param dmg 伤害对象
   * @returns 处理后伤害对象
   */
  preDefendDMGBuff(nowPc: Pc, dmg: DMG) {
    const newDMG = dmg
    return newDMG
  }

  /**
   * 造成伤害
   * @param dmg 伤害对象
   */
  dealDMG(dmg: DMG) {
    const newDMG = this.preAttackDMGBuff(dmg)
    newDMG.targetsID.map((tar) => {
      const nowPc = this.getPcByQQNumber(tar)
      if (nowPc) {
        this.takeDMG(nowPc, newDMG)
      }
    })
  }

  /**
   * 承受伤害
   * @param nowPc 承受伤害对象
   * @param dmg 伤害对象
   */
  takeDMG(nowPc: Pc, dmg: DMG) {
    const newDMG = this.preDefendDMGBuff(nowPc, dmg)
    if (dmg.value > 0) {
      nowPc.hp -= newDMG.value
    }
  }

  /**
   * 预治疗buff处理
   * @param heal 治疗对象
   * @returns 处理后治疗对象
   */
  preDealHealBuff(heal: heal) {
    const dealHealPc = this.getPcByQQNumber(heal.fromID)
    const newHeal = Object.assign({}, heal)
    if (dealHealPc) {
      this.healAttrBeniftbenifit(heal, dealHealPc)
      this.healBuffModify(heal, dealHealPc)
    }

    return newHeal
  }

  /**
   * 预接受治疗buff处理
   * @param nowPc pc对象
   * @param heal 治疗对象
   * @returns 处理后治疗对象
   */
  preTakeHealBuff(nowPc: Pc, heal: heal) {
    const newHeal = heal
    return newHeal
  }

  /**
   * 造成治疗
   * @param heal 治疗对象
   */
  dealHeal(heal: heal) {
    const newHeal = this.preDealHealBuff(heal)
    newHeal.targetsID.map((tar) => {
      const nowPc = this.getPcByQQNumber(tar)
      if (nowPc) {
        this.takeHeal(nowPc, newHeal)
      }
    })
  }

  healAttrBeniftbenifit(heal: heal, dealHealPc?: Pc) {
    const nowGroup = this.groups[this.currentGroup]
    if (dealHealPc) {

    } else {
      dealHealPc = this.getPcByQQNumber(heal.fromID)
    }
    if (dealHealPc) {
      switch (heal.type) {
        case healTypeEnum.Instant:
          heal.value *= 1 + dealHealPc.totalStatus.int * nowGroup.basicConfig.intHealBenifit + dealHealPc.totalStatus.wis * nowGroup.basicConfig.wisHealBenifit
          break;
        case healTypeEnum.continue:
          heal.value *= 1 + dealHealPc.totalStatus.int * nowGroup.basicConfig.intHealBenifit + dealHealPc.totalStatus.wis * nowGroup.basicConfig.wisHealBenifit
          break;
        default:
          heal.value *= 1 + dealHealPc.totalStatus.int * nowGroup.basicConfig.intHealBenifit + dealHealPc.totalStatus.wis * nowGroup.basicConfig.wisHealBenifit
          break;
      }
    }
    return heal;

  }

  /**
   * 给予BUFF
   * @param buff buff对象
   * @param targetsID 目标们的ID
   */
  giveBUFF(buff: Buff, targetsID: number[]) {
    targetsID.map((tar) => {
      const nowPc = this.getPcByQQNumber(tar)
      if (nowPc) {
        //console.log('尝试给予' + nowPc.nickname, buff)
        this.takeBUFF(nowPc, buff)
      }
    })
  }

  /**
   * 承受BUFF
   * @param nowPc 目标Pc
   * @param buff 目标BUFF
   */
  takeBUFF(nowPc: Pc, buff: Buff) {
    nowPc.buff.push(buff)
    buff.effect.map((effect, idx) => {
      if (basicEnum.indexOf(effect) != -1) {
        console.log(idx)
        this.basicBuffEffectHandle(nowPc, buff, effect, idx)
      } else {
      }
    })
    //this.updatePcStatus(nowPc) 不要写这种猪头代码, 谢谢
  }

  /**
   * 承受治疗
   * @param nowPc 承受治疗对象
   * @param heal 治疗对象
   */
  takeHeal(nowPc: Pc, heal: heal) {
    const newHeal = this.preTakeHealBuff(nowPc, heal)
    nowPc.hp += newHeal.value
    console.log(nowPc.turn)
    if (nowPc.hp > nowPc.maxHP) {
      this.overFlowHeal(nowPc, heal);
    }
  }

  /**
   * 治疗溢出
   * @param nowPc 承受治疗对象
   * @param heal 治疗对象
   */
  overFlowHeal(nowPc: Pc, heal: heal) {
    nowPc.hp = nowPc.maxHP
  }

  /**
   * 触发技能
   * @param skill 技能对象
   * @param args 技能参数
   */
  triggerSkill(skill: Skill, args: any) {
    const nowPc = this.getPcByQQNumber(args.fromID)
    if (nowPc) {
      nowPc.mp -= skill.cost
      skill.buffMachine['技能释放'] ? skill.buffMachine['技能释放'].map((buff: Buff) => {
        buff.effect.map((effect, eIndex) => {
          if (basicEnum.indexOf(effect) != -1) {
            const newBuff: Buff = {
              name: buff.name,
              prior: 0,
              life: 1,
              effect: [effect],
              type: DMGTypeEnum.Magical,
              from: args.fromID,
              benifit: false,
              value: [(getValue(args, buff.value[eIndex], ''))]
            }
            this.giveBUFF(newBuff, args.targetsID)
          } else {
            switch (effect) {
              case EffectEnum.伤害:
                var dmgType: DMGTypeEnum = DMGTypeEnum.Magical
                switch (skill.type) {
                  case SkillTypeEnum.动作:
                    dmgType = DMGTypeEnum.Physical
                  case SkillTypeEnum.远程:
                    dmgType = DMGTypeEnum.Range
                }
                const newDMG: DMG = {
                  value: parseInt(getValue(args, buff.value[eIndex], '')),
                  type: dmgType,
                  fromID: args.fromID,
                  targetsID: args.targetsID,
                  modify: 1
                }
                this.dealDMG(newDMG)
                break;
              case EffectEnum.治疗:
                const newHeal: heal = {
                  value: parseInt(getValue(args, buff.value[eIndex], '')),
                  type: healTypeEnum.Instant,
                  fromID: args.fromID,
                  targetsID: args.targetsID,
                }
                this.dealHeal(newHeal)
                break;
              case EffectEnum.给予BUFF:
                console.log(buff, args)
                const newArgs: string[] = []
                const nowPool = this.getEffectById(args[buff.value[0]])
                if (nowPool) {
                  nowPool.args.map((arg) => {
                    if (args[arg.name]) {
                      newArgs.push(args[arg.name])
                    }
                  })
                }
                const newBuff: Buff = {
                  name: buff.name,
                  prior: 0,
                  life: args['持续轮次'],
                  effect: [EffectEnum.给予BUFF],
                  type: DMGTypeEnum.Magical,
                  from: args.fromID,
                  benifit: false,
                  value: [args[buff.value[0]], ...newArgs]
                }
                //console.log(newBuff)
                this.giveBUFF(newBuff, args.targetsID)
                break;
              default:
                break;
            }
          }

        })
      }) : void (0)
    }
    skill.cooldownLeft = skill.cooldown
    //console.log(this.getPcByQQNumber(args.targetsID[0])?.buff)
  }

  /**
   * 更新pc的buff状态
   * @param nowPc pc对象
   * @param nextTurn 是否进入下一轮次?
   */

  updatePcBuff(nowPc: Pc, nextTurn = false) {
    const passiveBuffs = this.getAllSKillsPassiveBuffArgs(nowPc);
    console.log(toJS(nowPc.buff), nextTurn)
    nowPc.buff.map((buff, buffIdx) => {
      if (nextTurn) {
        buff.life -= 1
        console.log(buff.name, buff.effect, buff.life)
      }
      if (buff.life > 0) {
        buff.effect.map((effect, idx) => {
          if (basicEnum.indexOf(effect) != -1) {
            this.basicBuffEffectHandle(nowPc, buff, effect, idx)
          } else {
            if (nextTurn) {
              this.extraBuffHanlde(nowPc, buff, effect, idx)
            }
          }
        })
      } else {
        nowPc.buff.splice(buffIdx, 1)
      }
    });
    passiveBuffs.map((passiveBuff, index) => {
      console.log(index)
      passiveBuff.buffs.map((buff) => {
        if (nextTurn) {
          buff.life -= 1
          //console.log(buff.name, buff.effect, buff.life)
        }
        buff.effect.map((effect, idx) => {
          if (basicEnum.indexOf(effect) != -1) {
            console.log(idx)
            this.basicBuffEffectHandle(nowPc, buff, effect, idx, passiveBuff.args)
          } else {
            if (nextTurn) {
              this.extraBuffHanlde(nowPc, buff, effect, idx)
            }
          }
        })
      })
    })
  }

  /**
   * 重置pc属性值
   * @param nowPc pc对象 
   * @param returning 是否返还属性点
   */
  resetPcStatus(nowPc: Pc, returning: boolean = true) {
    for (var i = exchangeType.str; i <= exchangeType.cha; i++) {
      this.setPcStatus(nowPc, 0, i, returning);
    }
  }

  /**
   * 设置pc属性值
   * @param nowPc pc对象 
   * @param setPoint 设置值
   * @param tarStatus 目标属性
   * @param returning 如果减少了属性值，是否返还属性点?
   */
  setPcStatus(nowPc: Pc, setPoint: number, tarStatus: number = nowPc.exchange, returning: boolean = false) {
    if (returning && setPoint < nowPc.status[statusType[tarStatus]]) {
      nowPc.statusPoint += nowPc.status[statusType[tarStatus]] - setPoint;
    }
    nowPc.status[statusType[tarStatus]] = setPoint;
  }

  /**
   * 增加pc属性
   * @param nowPc pc对象
   * @param costPoint 消耗属性点
   * @param tarStatus 目标属性
   */
  addPcStatus(nowPc: Pc, costPoint: number, tarStatus: number = nowPc.exchange - 1) {
    nowPc.statusPoint -= costPoint;
    nowPc.status[statusType[tarStatus]] += costPoint;
  }

  /**
   * 设置pc对象属性
   * @param nowPc pc对象
   * @param tarStatus 目标对象属性
   * @param value 修改值
   */
  setPcValues(nowPc: Pc, tarStatus: string, value: any) {
    if (getEnumKeysOrValue(statusEnum).indexOf(tarStatus) != -1) {
      //console.log(getEnumKeysOrValue(statusEnum))
      setValue(nowPc, tarStatus, isNaN(value) ? value : parseFloat(value), '', 'status', true)
    } else {
      setValue(nowPc, tarStatus, isNaN(value) ? value : parseFloat(value), '')
    }
    this.updatePcStatus(nowPc);
  }

  /**
   * 设置Pc的图片,通常在ue4中显示
   * @param nowPc pc对象
   * @param url 图片url
   */
  setPcUrl(nowPc: Pc, url: string) {
    nowPc.img = url;
  }

  /**
   * 设置Pc的昵称
   * @param nowPc pc对象 
   * @param name 昵称
   * @returns {boolean} 修改成功?
   */
  setPcNickname(nowPc: Pc, name: string): boolean {
    if (this.findPcByNickname(name) == -1) {
      nowPc.nickname = name;
      return true;
    }
    return false;
  }

  /**
   * 发送消息到Ue4之中
   * @param msg 消息
   */
  Ue4SendMsg(msg: string) {
    if (this.config.Ue4Enable) {
      this.wsJS2UE4.send(msg);
    }
  }

  /**
   * 轻松发送消息至Ue4
   * @param key 关键词
   * @param value 值
   */
  Ue4EzSendMsg(key: string, value: string) {
    const newObj = {}
    newObj[key] = value
    this.wsJS2UE4.send(JSON.stringify(newObj))
  }

  /**
   * 轻松创建Pc(inUE4)
   * @param nowPc pc对象
   */
  ezCreatePc(nowPc: Pc) {
    //this.Ue4SendMsg(`{"object":{"pc":${JSON.stringify(nowPc)}}}`)
    const newObj = {}
    newObj['pc'] = nowPc
    this.Ue4EzSendMsg('object', JSON.stringify(newObj))
  }

  ezTeleport(id: number) {
    const newObj = {}
    newObj['TelPlayerLocation'] = id
    this.Ue4EzSendMsg('action', JSON.stringify(newObj))
    //this.Ue4SendMsg(`{"action":{"TelPlayerLocation":"${id}"}}`)
  }

  /**
   * 通过qq号寻找pc天赋
   * @param qqNumber qq号
   * @returns {number} 
   */
  findTalentByQQNumber(qqNumber: number): number {
    var index = -1
    this.skillsPool.map((pool, idx) => {
      if (pool.group == qqNumber) {
        pool.group = 0
        index = idx
      }
      if (this.dataObj[pool.id + this.dataObj[qqNumber + '']] == qqNumber) {
        index = 0
      }
    })
    return index
  }

  /**
   * 格式化字符串pc属性
   * @param nowPc pc对象
   * @returns pc属性字符串
   */
  formatPcStatus(nowPc: Pc, type: formatType = formatType.字符串) {
    switch (type) {
      case formatType.字符串:
        const returnMsgs: string[] = []
        for (var i = exchangeType.str; i <= exchangeType.cha; i++) {
          const returnMsg: string = Zh_statusType[i] + ":「" + nowPc.status[statusType[i]] + " + " + nowPc.extraStatus[statusType[i]] + ' = ' + (nowPc.status[statusType[i]] + nowPc.extraStatus[statusType[i]]) + "」\n";
          returnMsgs.push(returnMsg);
        }
        return returnMsgs
      case formatType.数字:
        const returnNumbers: number[] = []
        for (var i = exchangeType.str; i <= exchangeType.cha; i++) {
          const returnMsg: number = (nowPc.status[statusType[i]] + nowPc.extraStatus[statusType[i]]);
          returnNumbers.push(returnMsg)
        }
        return returnNumbers
    }

  }

  /**
   * 格式化字符串pc受伤状态
   * @param hp 生命数值
   * @param maxHP 最大生命数值
   * @returns {string} pc受伤状态
   */
  formatHPStatus(hp: number, maxHP: number): string {
    if (hp > maxHP * 0.8) {
      return HPStatus.无伤
    } else {
      if (hp > maxHP * 0.6) {
        return HPStatus.轻伤
      } else {
        if (hp > maxHP * 0.4) {
          return HPStatus.中伤
        } else {
          if (hp > maxHP * 0.05) {
            return HPStatus.重伤
          } else {
            return HPStatus.濒死
          }
        }
      }
    }
  }

  /**
   * 返回目标qq号所在频道都有哪些pl(昵称及其qq号)
   * @param qqNumber 目标qq号
   */
  rMsgChannelList(qqNumber: number) {
    const nowTeam = this.findPcTeam(qqNumber)
    var rMsg = ''
    if (nowTeam.length != 0) {
      const nowArea = this.groups[this.currentGroup].currentTeams[nowTeam[0].teamIdx]
      if (nowArea.nemo) {
        rMsg = '匿名频道不允许查询频道人员'
      } else {
        nowArea.pcs.map((pc) => {
          rMsg += `${pc.nickname}：${pc.Id}\n`
        })
      }
      this.ezSendText(qqNumber, [rMsg])
    }
  }

  /**
   * 格式化pc状态
   * @param qqNumber 目标qq号
   */
  formatMsgPcStatus(qqNumber: number) {
    const nowPc = this.getPcByQQNumber(qqNumber);
    var rMsg = ''
    if (nowPc && nowPc.inited) {
      if (nowPc.status.k + nowPc.extraStatus.k > 9) {
        rMsg += `生命：${nowPc.hp} / ${nowPc.maxHP} 【${this.formatHPStatus(nowPc.hp, nowPc.maxHP)}】\n`
      } else {
        rMsg += `生命：【${this.formatHPStatus(nowPc.hp, nowPc.maxHP)}】\n`
      }
      rMsg += `魔法：${nowPc.mp} / ${nowPc.maxMP}\n`
      rMsg += `等级：${nowPc.lv}【${nowPc.exp} / ${geneMaxExp(nowPc.lv)}】\n`
      const status = this.formatPcStatus(nowPc)
      status.map((status) => {
        rMsg += status
      })
    }
    this.ezSendText(qqNumber, [rMsg])
  }

  /**
     * 格式化pc已兑换物
     * @param qqNumber 目标qq号
     */
  formatMsgPcExchanged(qqNumber: number) {
    const nowPc = this.getPcByQQNumber(qqNumber);
    var rMsg = '=========已兑换==========\n'
    if (nowPc && nowPc.inited) {
      nowPc.skillChain.map((skill) => {
        rMsg +=
          `        ${skill.name}
        兑换分数：${skill.exchangePoint}
        类型：${skill.type}
        描述：${skill.description}\n`
      })
    }
    rMsg += '=========已兑换=========='
    this.ezSendText(qqNumber, [rMsg])
  }

  /**
     * 格式化pc冷却
     * @param qqNumber 目标qq号
     */
  formatMsgPcCooldown(qqNumber: number) {
    const nowPc = this.getPcByQQNumber(qqNumber);
    var rMsg = '=========冷却==========\n'
    if (nowPc && nowPc.inited) {
      nowPc.skillChain.map((skill) => {
        rMsg += `「${skill.name}」 冷却[${skill.cooldownLeft == 0 ? '就绪' : skill.cooldownLeft}]\n`
      })
    }
    rMsg += '=========冷却=========='
    this.ezSendText(qqNumber, [rMsg])
  }

  /**
   * 抽取天赋
   * @param qqNumber qq号
   * @param targetFindCount 现在找到了几个天赋
   * @param type 天赋类型
   * @returns {void}
   */
  drawTalents(qqNumber: number, targetFindCount = 3, type = ISkillsPoolType.普通天赋): void {
    const nowPc = this.getPcByQQNumber(qqNumber);
    if (nowPc && nowPc.inited) {
      if (this.findTalentByQQNumber(qqNumber) != -1) {
        this.ezSendText(qqNumber, ['你已经抽过了！'])
        return
      }
      nowPc.isSupport = type == ISkillsPoolType.支援天赋 ? true : false
      var count = 0;
      const poolLen = this.skillsPool.length - 1;
      var idxs: number[] = [];
      var nowIdx = randomRangeInt(0, poolLen)
      while (count < 10000 && idxs.length != targetFindCount) {
        var nowPool = this.skillsPool[nowIdx]
        if (nowPool.group == 0 && nowPool.type == type && idxs.indexOf(nowIdx) == -1) {
          if (!this.dataObj[nowPool.id + this.dataObj[qqNumber + '']]) {
            idxs.push(nowIdx)
            this.dataObj[nowPool.id + this.dataObj[qqNumber + '']] = qqNumber
          }
        }
        var nowIdx = randomRangeInt(0, poolLen)
        count += 1;
      }
      if (idxs.length == targetFindCount) {
        idxs.map((idx, index) => {
          var nowPool = this.skillsPool[idx]
          //nowPool.group = qqNumber
          this.ezSendText(qqNumber, [`「${index + 1}」:===================
          名称：${nowPool.name}
          描述：${nowPool.desc}
          `])
        })
      } else {
        this.ezSendText(qqNumber, ['很抱歉，似乎天赋池被抽空了，请联系ST。'])
      }

    }
  }

  /**
   * 退回到pc的上一次兑换
   * @param Id pc的Id，通常是qq号
   */
  async lastExchange(Id: number) {
    const idx = this.findPcByQQNumber(Id);
    const nowPc = this.groups[this.currentGroup].pc[idx];
    if (idx != -1 && !nowPc.inited) {
      if (pcInStatusExchange(this, Id) != -1) {
        if (this.groups[this.currentGroup].pc[idx].exchange > exchangeType.normal + 2) {
          nowPc.exchange -= 1;
          this.setPcStatus(nowPc, 0, nowPc.exchange - 1, true);

        } else {
          this.ezSendText(Id, ["你已经在初始兑换的第一步了"]);
        }
        this.ezSendText(Id,
          ["当前" + Zh_statusType[nowPc.exchange - 1] + ":「" + nowPc.status[statusType[nowPc.exchange - 1]] +
            "」 剩余属性点:「" + nowPc.statusPoint + "」"
          ])
      } else {
        switch (nowPc.exchange) {
          case exchangeType.confirmStatus:
            this.resetPcStatus(nowPc);
            nowPc.exchange = exchangeType.normal;
            await waitTime(50);
            this.nextExchange(Id);
            break;
          case exchangeType.skill:
            this.ezSendText(Id, ["属性已录入，不允许再次修改"])
            break;
          case exchangeType.img:
            this.ezSendText(Id, ["技能已录入，不允许再次修改"])
            break;
        }
      }

    }
  }

  /**
   * 在Ue4中创建所有Pc
   */
  createAllPcInUE4() {
    this.AllPcList.map((pc) => {
      this.ezCreatePc(pc)
    })
  }

  /**
   * Pc进入到下一轮次
   * @param Id Pc的Id值,通常是qq号
   */
  async nextExchange(Id: number) {
    const idx = this.findPcByQQNumber(Id);
    const nowPc = this.groups[this.currentGroup].pc[idx];
    if (idx != -1 && !nowPc.inited) {
      if (pcInStatusExchange(this, Id) != -1) {
        if (nowPc.statusPoint > 0) {
          this.ezSendText(Id,
            ["当前" + Zh_statusType[nowPc.exchange] + ":「" + nowPc.status[statusType[nowPc.exchange]] +
              "」 剩余属性点:「" + nowPc.statusPoint + "」"
            ]);
          nowPc.exchange += 1;
        } else {
          nowPc.exchange = exchangeType.confirmStatus;
          const returnMsgs: string[] = ["属性兑换全部完成，输入 【.】确认; 输入 【..】 退回上一步\n"];
          for (var i = exchangeType.str; i <= exchangeType.cha; i++) {
            var returnMsg: string = Zh_statusType[i] + ":「" + nowPc.status[statusType[i]] + "」\n";
            returnMsgs.push(returnMsg);
          }
          this.ezSendText(Id, returnMsgs)
        }

      } else {
        switch (nowPc.exchange) {
          case exchangeType.normal:
            nowPc.exchange += 1;
            this.nextExchange(Id);
            break;
          case exchangeType.skill:
            this.ezSendText(Id, ["现在是技能兑换，请按照以下格式兑换，输入 . 可以跳过",
              "你还剩余 " + nowPc.exchangePoint + " 分请进行分数兑换\n这部分是人工审核的，请严格参照强度和格式兑换" +
              "[记得换行哦]，如果超模请设计一个或更多的'优秀'的弱点\n示例如下:[括号中是可选项，别再把括号打进去了]\n",
              "名称:咸鱼冲击\n" +
              "打击类型:单目标[" + getEnumKeysOrValue(SkillTargetEnum, true, true).join('\\') + "]\n类型:法术[" + getEnumKeysOrValue(SkillTypeEnum, true, true).join('\\') + "]\n描述:[这个就可以自由一点啦，数值和效果也请塞这里哦]" +
              "\n当你完成本轮兑换时，请输入一个 . 下面是可复制模板\n\n",
            ])
            this.ezSendText(Id, ["名称:\n" +
              "打击类型:\n类型:\n描述:"
            ])
            break;
          case exchangeType.confirmStatus:
            this.ezSendText(Id, ["属性数据已录入"]);
            nowPc.exchange += 1;
            await waitTime(50);
            this.nextExchange(Id);
            break;
          case exchangeType.confirmSkill:
            this.ezSendText(Id, ["技能数据已录入,现在请发送一张人物立绘(*图片即可)"]);
            nowPc.exchange += 1;
            break;
          case exchangeType.img:
            this.ezSendText(Id, [
              "图片已录入\n",
              "最后，请告诉我你的角色名，兑换即将结束"])
            nowPc.exchange += 1;
            break;
          case exchangeType.nickname:
            this.ezSendText(Id, [
              `是吗？「${nowPc.nickname}」真是个好名字呢,我十分期待您以后的表现\n`,
              `——兑换结束——`
            ])
            nowPc.inited = true;
            nowPc.exchange = exchangeType.normal;
            this.updatePcStatus(nowPc, true)
            this.ezCreatePc(nowPc)
        }
      }
    }
  }

  /**
   * 设置兑换轮次
   * @param Id Pc的Id值
   * @param modV 
   */
  modExchange(Id: number, modV: number) {
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    nowPc.exchange = modV;
  }

  /**
   * 获取pc的技能对象数组
   * @param Id 目标pc的Id值,通常是qq号
   * @param inited 是否是兑换完成的技能
   * @returns {Skill[]} 技能对象数组
   */
  getPcSkills(Id: number, inited: boolean): Skill[] {
    const returnSkill: Skill[] = [];
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    for (var i in nowPc.skillChain) {
      if (nowPc.skillChain[i].stInited == inited) {
        returnSkill.push(nowPc.skillChain[i])
      }
    }
    return returnSkill
  }

  /**
   * 更新技能池效果和buff
   * @param poolId 目标技能池Id
   * @param ebs 效果和buff对象数组
   */
  updatePoolEbs(poolId: string, ebs: IEventBuffs[]) {
    const nowPool = this.getEffectById(poolId)
    if (nowPool) {
      nowPool.eventBuffs = ebs
    }
  }

  /**
   * 设置pc技能对象属性
   * @param Id 目标Pc的Id值,通常是qq号
   * @param idx 目标技能的数组下标
   * @param changeValues 更新值
   * @param inited 是否是一个兑换完成的技能
   */
  setPcSkill(Id: number, idx: number, changeValues: any, inited: boolean = false): void {
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    var index = 0;
    const targetKey = Object.keys(changeValues)[0]
    for (var i in nowPc.skillChain) {
      if (nowPc.skillChain[i].stInited == inited) {
        if (index == idx) {
          if (nowPc.skillChain[i][targetKey] != undefined || targetKey == 'poolId') {
            nowPc.skillChain[i][targetKey] = changeValues[targetKey]
          } else {
            nowPc.skillChain[i].args.map((arg) => {
              if (arg.name == targetKey) {
                arg.value = changeValues[targetKey]
              }
            })
          }

          if (targetKey == 'poolId' && nowPc.skillChain[i].poolId != '') {
            const nowPool = this.getEffectById(nowPc.skillChain[i].poolId) as ISkillsPool
            nowPc.skillChain[i].args = nowPool.args
            if (nowPool.eventBuffs && nowPool.eventBuffs.length != 0) {
              nowPool.eventBuffs.map((eb) => {
                if (eb) {
                  nowPc.skillChain[i].buffMachine[eb.event] = eb.buffs
                }
              })
            } else {
              nowPc.skillChain[i].buffMachine = {}
            }
          }
          index += 1;
        } else {
          index += 1;
        }
      }
    }
    this.updatePcStatus(nowPc)
  }

  /**
   * 设置技能完成兑换
   * @param Id 目标Pc的Id值,通常是QQ号
   * @param idx 目标技能的数组下标
   * @returns {void}
   */
  setSkillInited(Id: number, idx: number): void {
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    var index = 0;
    for (var i in nowPc.skillChain) {
      if (!nowPc.skillChain[i].stInited) {
        if (index == idx) {
          if (nowPc.exchangePoint >= nowPc.skillChain[i].exchangePoint) {
            nowPc.skillChain[i].stInited = true;
            nowPc.exchangePoint -= nowPc.skillChain[i].exchangePoint
            this.ezSendText(Id, [
              `名称：${nowPc.skillChain[i].name}\n`,
              `打击类型：${nowPc.skillChain[i].class}\n`,
              `类型：${nowPc.skillChain[i].type}\n`,
              `描述：${nowPc.skillChain[i].description}\n`,
              `消耗分数：${nowPc.skillChain[i].exchangePoint}\n`,
              `剩余分数：${nowPc.exchangePoint}\n`,
              `通过了审核，请注意，数据可能经过了st修改，以此信息为准`
            ])
            nowPc.skillChain = nowPc.skillChain.slice();
            return;
          } else {
            message.error(`「${nowPc.nickname}」的分数: ${nowPc.exchangePoint}不足以兑换。`)
          }

        } else {
          index += 1;
        }
      }
    }
  }

  /**
   * 是否所有的技能都通过了st的兑换?
   * @param Id 目标Pc的Id值,通常是qq号
   * @returns {boolean}
   */
  isAllSkillStInited(Id: number): boolean {
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    for (var i in nowPc.skillChain) {
      if (!nowPc.skillChain[i].stInited) {
        return false;
      }
    }
    return true;
  }

  /**
   * 暂时弃用。是否所有的技能都被pl确认过
   * @param Id 目标Pc的Id值,通常是qq号
   * @returns {boolean}
   */
  isAllSkillPcInited(Id: number): boolean {
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    for (var i in nowPc.skillChain) {
      if (!nowPc.skillChain[i].pcInited) {
        return false;
      }
    }
    return true;
  }

  /**
   * 通过名称删除技能
   * @param Id 目标Pc的Id值,通常是qq号
   * @param name 技能名称
   */
  delSkillByName(Id: number, name: string, returnPoint: boolean = true) {
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    var idx = this.findSkillByName(Id, name).idx
    if (returnPoint) {
      nowPc.exchangePoint += nowPc.skillChain[idx].exchangePoint
    }
    nowPc.skillChain.splice(idx, 1);

    this.updatePcStatus(nowPc)
  }

  /**
   * 通过名称寻找技能的数组下标
   * @param Id 目标Pc的Id值,通常是qq号
   * @param name 技能名称
   * @returns {number, number} 返回技能下标和找到相同名称的技能数量
   */
  findSkillByName(Id: number, name: string) {
    const nowPc = this.getPcByQQNumber(Id) as Pc;
    var idx = -1;
    var count = 0;
    for (var i in nowPc.skillChain) {
      if (nowPc.skillChain[i].name == name) {
        if (idx == -1) {
          idx = parseInt(i);
        }
        count++;
      }
    }
    return { idx, count };
  }

  /**
   * 获取pc最后一次发言内容
   * @param chat mirai聊天信息
   * @returns {lastWords: string, lastContent: any, lastType: messageType}
   */
  getLastWord(chat: miraiContent): { lastWords: string, lastContent: any, lastType: messageType } {
    var lastWords: string = "";
    var lastContent: any;
    const lastMsg = chat.messageChain[chat.messageChain.length - 1];
    //console.log(lastMsg)
    var lastType: messageType = lastMsg.type;
    if (chat.type == chatType.FriendMessage)
      switch (lastMsg.type) {
        case messageType.Plain:
          lastWords = lastMsg.text || "未知错误";
          lastContent = lastMsg.text || "未知错误";
          break;
        case messageType.Image:
          lastWords = " [图片] ";
          lastContent = lastMsg.url;
          break;
        case messageType.At:
          lastWords = " 有人@我 ";
          break;
        default:
          lastWords = " [暂未支持的消息类型] "
          break;
      }
    return { lastWords, lastContent, lastType };
  }

  /**
   * 新增一条聊天信息
   * @param chat mirai聊天内容
   */
  chatAdd(chat: miraiContent) {
    //console.log(chat)
    var delCount = 0;
    const areaChat: miraiContent = Object.assign({}, chat);
    const areaChatMsg: miraiMessageChain[] = [];
    const newMsgChain = chat.messageChain.slice()
    const nowNegative = this.getNegativeById(chat.sender!.id)
    if (nowNegative) {
      nowNegative.reply = true
      nowNegative.idx += 1
    }
    const areaIdxs = this.findPcTeam(chat.sender!.id)
    if (areaIdxs.length != 0) {
      const sourcePc = this.getPcByQQNumber(chat.sender!.id) as Pc
      const nowArea = this.groups[this.currentGroup].currentTeams[areaIdxs[0].teamIdx]
      //console.log(nowArea.Id)
      newMsgChain.map((msg, idx) => {
        if (msg.type == messageType.Plain && teamChatReg.test(msg.text as string) && sourcePc && sourcePc.hp > 0) {
          const pureObj = Object.assign({}, msg)
          areaChatMsg.push(pureObj);
          pureObj.text = pureObj.text!.substring(1, pureObj.text!.length - 1)
          const pureText = msg.text
          //console.log(pureObj)
          msg.text = `频道【${nowArea.name}】「${sourcePc.nickname}」:"${msg.text?.slice(1, msg.text.length - 1)}"`
          for (var j = 0; j < nowArea.pcs.length; j++) {
            const nowPc = nowArea.pcs[j]
            if (nowPc.Id != chat.sender!.id) {
              this.ezSendText(nowPc.Id, [
                `频道【${nowArea.name}】「${nowArea.nemo ? '???' : sourcePc.nickname}」:"${pureText?.slice(1, pureText.length - 1)}"`
              ], true, false)
            }
          }
          //chat.messageChain.splice(idx - delCount, 1)
          delCount = delCount + 1
        }
      })
      areaChat.messageChain = areaChatMsg;
      nowArea.chat.push(new Chat(areaChat))
    }
    const chatAreaIdxs = this.findPcChatArea(chat.sender!.id)
    if (chatAreaIdxs.length != 0) {
      const sourcePc = this.getPcByQQNumber(chat.sender!.id) as Pc
      const nowArea = this.currentWorld[chatAreaIdxs[0].worldIdx].world.chatAreas[chatAreaIdxs[0].chatAreaIdx]
      newMsgChain.map((msg, idx) => {
        if (msg.type == messageType.Plain && worldChatReg.test(msg.text as string) && sourcePc && sourcePc.hp > 0) {
          areaChatMsg.push(msg);
          for (var j = 0; j < nowArea.member.length; j++) {
            if (nowArea.member[j] != chat.sender!.id) {
              this.ezSendText(nowArea.member[j], [
                `「${sourcePc.nickname}」:"${msg.text?.slice(1, msg.text.length - 1)}"`
              ], true, false)
            }
          }
          //chat.messageChain.splice(idx - delCount, 1)
          delCount = delCount + 1
        }
      })
      areaChat.messageChain = newMsgChain;
    }
    if (chat.messageChain.length != 1 || true) { //为啥加这个if我真的记不清了，应该是无意义的(如果出啥问题请联系我)
      if (this.groups[this.currentGroup].chatMsg)
        this.groups[this.currentGroup].chatMsg?.push(new Chat(chat))
      else
        this.groups[this.currentGroup].chatMsg = [new Chat(chat)]
      const newMsgCount = chat.messageChain.length - 1;
      this.upDateLastWords(chat.sender?.id || 0, this.getLastWord(chat).lastWords, newMsgCount)
    }
  }

  /**
   * 获取目标qq号所有Chat聊天对象
   * @param Id qq号
   * @param withStMSg 是否携带st发送的信息
   * @returns {Chat[]} Chat聊天对象
   */
  getAllChatByQQNumber(Id: number, withStMSg: Boolean = true) {
    const rChats: Chat[] = []
    this.currentGroupChatMsgs.map((chat) => {
      if (chat.sender.id == Id || (withStMSg && Math.abs(chat.sender.id) == Id)) {
        rChats.push(chat)
      }
    })
    return rChats
  }

  /**
   * 获取目标qq号所有聊天信息
   * @param Id 目标Pc的Id值,通常是qq号
   * @returns {Message<MessageContent>[]} 信息内容数组
   */
  getAllMsgByQQNumber(Id: number) {
    var all: boolean = false
    var returnMsgs: Message<MessageContent>[] = [];
    const nowTeam = this.getTeamPcIdsByTeamId(Id).team
    if (Id > 10000 || Id == 0) {
      var AllMsg = toJS(this.groups[this.currentGroup].chatMsg)
    } else {
      if (nowTeam) {
        var AllMsg = this.getTeamPcIdsByTeamId(Id).team!.chat
        all = true
      } else {
        this.setCurrentChatTo(0)
        var AllMsg: Chat[] = []
      }
    }

    for (var i in AllMsg) {
      if (AllMsg[i].sender.remark == "") {
        AllMsg[i].sender.remark = AllMsg[i].sender.nickname
      }
      if (Math.abs(AllMsg[i].sender.id) == Id || Id == 0 || all) {
        for (var j in AllMsg[i].messageChain) {
          var returnMsg: Message<MessageContent> = {
            type: "",
            content: "",
            self: AllMsg[i].sender.id < 0 ? true : false,
          };
          switch (AllMsg[i].messageChain[j].type) {
            case messageType.Source: {
              var time = new Date(AllMsg[i].messageChain[j].time || 0)
              returnMsg.createdAt = time;
              break;
            }
            case messageType.Plain: {
              returnMsg.username = AllMsg[i].sender.id > 0 ? AllMsg[i].sender.remark + ' : ' + AllMsg[i].sender.id.toString() : undefined;
              returnMsg.type = 'text';
              returnMsg.content = AllMsg[i].messageChain[j].text!;
              returnMsg.avatar = returnMsg.username;
              returnMsgs.push(returnMsg);
              break;
            }
            case messageType.Image: {
              returnMsg.type = 'jsx';
              returnMsg.username = AllMsg[i].sender.remark + ' : ' + AllMsg[i].sender.id.toString();
              returnMsg.content = (
                <div>
                  <img
                    key={AllMsg[i].messageChain[j].imageId}
                    src={AllMsg[i].messageChain[j].url}
                    alt="File"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>)
              returnMsg.avatar = returnMsg.username;
              returnMsgs.push(returnMsg);
              break;
            }
          }
        }
      }

    }
    return (returnMsgs)
  }

  /**
   * 通过Id找到消极对象数组
   * @param Id 目标Id值
   * @returns {number} 找到的消极数组下标 
   */
  findNegativeById(Id: number): number {
    for (var i = 0; i < this.currentNegative.length; i++) {
      if (this.currentNegative[i].Id == Id) {
        return i
      }
    }
    return -1;
  }

  /**
   * 找到消极对象
   * @param Id 目标Id值
   * @returns {TimeOutNegative | undefined}
   */
  getNegativeById(Id: number): TimeOutNegative | undefined {
    const idx = this.findNegativeById(Id);
    if (idx != -1) {
      return this.currentNegative[idx];
    }
    return undefined;
  }


  /**
   * 通过Id找到技能池效果
   * @param Id 目标技能池的Id值
   * @returns {number} 找到的技能池数组下标 
   */
  findEffectById(Id: string): number {
    for (var i = 0; i < this.skillsPool.length; i++) {
      if (this.skillsPool[i].id == Id) {
        return i
      }
    }
    return -1;
  }

  /**
  * 通过Id找到随机池
  * @param Id 目标随机池的Id值
  * @returns {number} 找到的随机池数组下标 
  */
  findRandomPoolById(Id: string): number {
    for (var i = 0; i < this.randomPool.length; i++) {
      if (this.randomPool[i].id == Id) {
        return i
      }
    }
    return -1;
  }

  /**
   * 通过Id找到世界
   * @param Id 世界Id
   * @returns {number} 找到的世界数组下标
   */
  findWorldById(Id: string): number {
    for (var i = 0; i < this.currentWorld.length; i++) {
      if (this.currentWorld[i].Id == Id) {
        return i
      }
    }
    return -1;
  }

  /**
   * 通过Id找到效果
   * @param Id 技能池Id
   * @returns {ISkillsPool | undefined}
   */
  getEffectById(Id: string): ISkillsPool | undefined {
    const idx = this.findEffectById(Id);
    if (idx != -1) {
      return this.skillsPool[idx];
    }
    return undefined;
  }

  /**
   * 通过Id找到世界
   * @param Id 世界Id
   * @returns {IWorldModal | undefined}
   */
  getWorldById(Id: string): IWorldModal | undefined {
    const idx = this.findWorldById(Id);
    if (idx != -1) {
      return this.currentWorld[idx];
    }
    return undefined;
  }

  /**
   * 找到所有目标QQ号的Pc
   * @param Id 目标Pc的Id值,通常是qq号
   * @returns {Pc[]} Pc对象数组
   */
  getPcsByQQNumber(Id: number): Pc[] {
    var pcs: Pc[] = []
    this.groups[this.currentGroup].pc.map((pc) => {
      if (pc.inited && pc.Id == Id) {
        pcs.push(pc)
      }
    })
    return pcs
  }

  /**
   * 通过QQ号获取Pc
   * @param Id 目标Pc的Id值,通常是qq号
   * @param index 寻找轮次,负数为从最后一轮次向前,-1为最后一轮
   * @returns {Pc | undefined}
   */
  getPcByQQNumber(Id: number, index: number = -1): Pc | undefined {
    const idx = this.findPcByQQNumber(Id, index);
    if (idx != -1) {
      return this.groups[this.currentGroup].pc[idx];
    }
    return undefined;
  }

  /**
   * 通过昵称获取Pc
   * @param nickname 昵称
   * @returns {Pc | undefined}
   */
  getPcByNickname(nickname: string): Pc | undefined {
    const idx = this.findPcByNickname(nickname);
    if (idx != -1) {
      return this.groups[this.currentGroup].pc[idx];
    }
    return undefined;
  }

  /**
   * 通过QQ号寻找Pc数组下标
   * @param Id 目标Pc的Id值,通常是qq号
   * @param idx 目标Pc轮次 
   * @returns {number} 目标数组下标
   */
  findPcByQQNumber(Id: number, idx: number = -1): number {
    const idxs = []
    for (var i = 0; i < this.groups[this.currentGroup].pc.length; i++) {
      if (this.groups[this.currentGroup].pc[i].Id == Id) {
        idxs.push(i)
      }
    }
    if (idx > 0) {
      if (idx < idxs.length) {
        return idxs[idx]
      }
    } else {
      if (idxs.length + idx > -1) {
        return idxs[idxs.length + idx]
      }
    }
    //console.log("警告：未找到QQ号为" + Id + "的PC");
    return -1;
  }

  /**
   * 通过昵称寻找Pc
   * @param nickname 昵称
   * @param idx 目标Pc轮次
   * @returns {number} 目标数组下标
   */
  findPcByNickname(nickname: string, idx: number = -1): number {
    const idxs = []
    for (var i = 0; i < this.groups[this.currentGroup].pc.length; i++) {
      if (this.groups[this.currentGroup].pc[i].nickname == nickname) {
        idxs.push(i)
      }
    }
    if (idx > 0) {
      if (idx < idxs.length) {
        return idxs[idx]
      }
    } else {
      if (idxs.length + idx > -1) {
        return idxs[idxs.length + idx]
      }
    }
    //console.log("警告：未找到昵称为" + nickname + "的PC");
    return -1;
  }

  /**
   * 通过QQ号设置目标Pc
   * @param Id 目标Pc的Id值,通常是qq号
   * @param pc Pc修改对象
   */
  setPcByQQNumber(Id: number, pc: Pc): void {
    const idx = this.findPcByQQNumber(Id);
    if (idx != -1) {
      this.groups[this.currentGroup].pc[idx] = pc;
    } else {
      this.groups[this.currentGroup].pc.push(pc);
    }
  }

  /**
   * 通过QQ号获取聊天列表对象
   * @param Id 
   * @returns 
   */
  getChatListItemByQQNumber(Id: number): Item {
    for (var i = 0; i < this.groups[this.currentGroup].currentChatList.length; i++) {
      if (this.groups[this.currentGroup].currentChatList[i].Id == Id) {
        return this.groups[this.currentGroup].currentChatList[i];
      }
    }
    //console.log("警告：未找到QQ号为" + Id + "的PC");
    return { Id: -1, nickName: "错误", lastWords: '未找到目标QQ号', notReadCount: 0 };
  }

  /**
   * 保存目标技能池编辑图表
   * @param Id 技能池Id
   * @param graph 目标图表对象
   */
  graphSave(Id: string, graph: object) {
    const nowEffect = this.getEffectById(Id)
    if (nowEffect) {
      nowEffect.graph = graph
    }
  }

  /**
   * 保存目标世界图表
   * @param Id 世界Id
   * @param graph 目标图表对象
   */
  worldSave(Id: string, graph: object) {
    const nowWorld = this.getWorldById(Id)
    if (nowWorld) {
      nowWorld.world.map = graph
    }
  }

  /**
   * 新增模态框
   * @param modal 模态框
   * @param type 类型
   */
  modalAdd(modal: statusModal | Team | skillEditModal, type: string) {
    const findMsg = this.findModalById(modal.Id);
    if (findMsg.idx == -1 && modal.Id != 0) {
      const newModal = this[type];
      newModal.push(modal);
      this.groups[this.currentGroup][type] = newModal;
    } else {
      if (modal.Id != 0) {
        this.setModalVisible(modal.Id, true);
      }
    }
  }

  /**
   * 设置模态框是否可见
   * @param Id 模态框Id
   * @param vis 是否可见?
   */
  setModalVisible(Id: number | string, vis: boolean) {
    const findMsg = this.findModalById(Id);
    if (findMsg.idx != -1) {
      this[findMsg.from][findMsg.idx].visible = vis;
    }
  }

  /**
   * 设置模态框边框xy
   * @param Id 模态框Id
   * @param bounds 边框xy
   */
  setModalBounds(Id: number | string, bounds: ControlPosition) {
    const findMsg = this.findModalById(Id);
    if (findMsg.idx != -1) {
      this[findMsg.from][findMsg.idx].bounds = bounds;
      //console.log("目标Modal（setModalBounds）： " + Id + " 已被修改为： " + JSON.stringify(bounds))
    } else {
      //console.log("警告：目标Modal不存在（setModalBounds）： " + Id)
    }
  }

  /**
   * 设置模态框尺寸
   * @param Id 模态框Id
   * @param size 模态框尺寸
   */
  setModalSize(Id: number | string, size: {
    width: number,
    height: number
  }) {
    const findMsg = this.findModalById(Id);
    if (findMsg.idx != -1) {
      this[findMsg.from][findMsg.idx].size = size;
      //console.log("目标Modal（setModalBounds）： " + Id + " 已被修改为： " + JSON.stringify(size))
    } else {
      //console.log("警告：目标Modal不存在（setModalSize）： " + Id)
    }
  }

  /**
   * 通过Id找到模态框
   * @param Id 模态框Id
   * @returns {idx:number, from:string} 数组下标和类型
   */
  findModalById(Id: number | string): { idx: number, from: string } {
    // var rFrom = ''
    // if (/^\d+$/.test(Id as string)) {
    //   if (Id > 10000) {
    //     rFrom = 'currentPcModal'
    //   } else {
    //     rFrom = 'currentAreaModal'
    //   }
    // } else {
    //   rFrom = 'currentSkillEditModal'
    // }

    for (var i = 0; i < this.currentPcModal.length; i++) {
      if (this.currentPcModal[i].Id == Id) {
        return { idx: i, from: 'currentPcModal' };
      }
    }
    for (var i = 0; i < this.currentTeamModal.length; i++) {
      if (this.currentTeamModal[i].Id == Id) {
        return { idx: i, from: 'currentTeamModal' };
      }
    }
    for (var i = 0; i < this.currentSkillEditModal.length; i++) {
      if (this.currentSkillEditModal[i].Id == Id) {
        return { idx: i, from: 'currentSkillEditModal' };
      }
    }
    for (var i = 0; i < this.currentWorld.length; i++) {
      if (this.currentWorld[i].Id == Id) {
        return { idx: i, from: 'currentWorld' };
      }
    }
    return { idx: -1, from: '' };
  }

  get currentNegative() {
    return this.groups[this.currentGroup].negative
  }

  /**
   * 获取所有pc平均轮次
   */
  get averPcTurn() {
    var turn = 0
    this.AllPcList.map((pc) => {
      turn += pc.turn
    })
    turn = Math.ceil(turn / this.AllPcList.length)
    return turn
  }

  /**
   * 返回所有Pc的回合
   */
  get allPcTurn() {
    const turn: number[] = []
    this.AllPcList.map((pc) => {
      turn.push(pc.turn)
    })
    return turn
  }

  /**
   * 返回所有存活Pc的回合
   */
  get allAlivePcTurn() {
    const turn: number[] = []
    this.AllPcList.map((pc) => {
      if (pc.hp > 0) {
        turn.push(pc.turn)
      }
    })
    return turn
  }

  /**
   * 返回所有Pc的回合总数
   */
  get totalPcTurn() {
    var turn: number = 0
    this.AllPcList.map((pc) => {
      turn += pc.turn
    })
    return turn
  }

  /**
   * 获取是否允许新pl入团
   */
  get canChatListAdd() {
    return this.config.canChatListAdd;
  }

  /**
   * 获取当前默认聊天对象
   * @param idx 聊天窗口数组下标
   * @returns {sendTo} 目标对象们
   */
  getCurrentSendTo(idx: number): sendTo {
    return this.groups[this.currentGroup].currentSendPanes[idx].sendTo;
  }

  /**
   * 设置当前默认聊天对象
   * @param idx 聊天窗口数组下标
   * @param sendTo 修改对象们
   */
  setCurrentSendTo(idx: number, sendTo: sendTo) {
    this.groups[this.currentGroup].currentSendPanes[idx].sendTo = sendTo;
  }


  get currentSendPanes() {
    return this.groups[this.currentGroup].currentSendPanes;
  }

  get currentPcModal() {
    return this.groups[this.currentGroup].Modal;
  }

  get currentTeamModal() {
    return this.groups[this.currentGroup].currentTeams;
  }

  get currentWorld() {
    return this.groups[this.currentGroup].currentWorlds;
  }

  set currentWorld(world: IWorldModal[]) {
    this.groups[this.currentGroup].currentWorlds = world
  }

  get currentSkillEditModal() {
    return this.groups[this.currentGroup].currentSkillEdit;
  }

  get activeKey() {
    return this.groups[this.currentGroup].activeKey;
  }
  /**
   * 设置当前默认团
   * @param idx 修改当前团数组下标
   */
  setCurrentGroup(idx: number) {
    this.currentGroup = idx
    this.refuseListQQNumber = []
    console.log(this.groups[this.currentGroup])
    message.success(`成功将「${this.groups[this.currentGroup].name}」设为当前团`)
  }

  /**
   * 设置当前活跃的聊天窗口
   * @param key 
   */
  setActiveKey(key: number) {
    this.groups[this.currentGroup].activeKey = key;
  }

  /**
   * 获取所有Pc对象数组
   */
  get AllPcList() {
    const returnPcs: Pc[] = [];
    //console.log(this.groups)
    if (this.groups.length != 0) {
      this.groups[this.currentGroup].currentChatList.map((item, idx) => {
        if (item.Id > 10000) {
          const nowPc = this.getPcByQQNumber(item.Id);
          if (nowPc && nowPc.inited) {
            returnPcs.push(this.getPcByQQNumber(item.Id) as Pc);
          }

        }
      })
    }
    return returnPcs;
  }

  /**
   * 获取所有无频道Pc对象数组
   */
  get AllNoTeamPcList() {
    const returnPcs: Pc[] = [];
    this.groups[this.currentGroup].currentChatList.map((item, idx) => {
      if (item.Id > 10000 && this.findPcTeam(item.Id).length == 0) {
        const nowPc = this.getPcByQQNumber(item.Id);
        if (nowPc && nowPc.inited) {
          returnPcs.push(this.getPcByQQNumber(item.Id) as Pc);
        }

      }
    })
    return returnPcs;
  }

  /**
   * 获取所有无世界频道Pc对象数组
   */
  get AllNoWorldPcList() {
    const returnPcs: Pc[] = [];
    this.groups[this.currentGroup].currentChatList.map((item, idx) => {
      if (item.Id > 10000 && this.findPcWorld(item.Id).length == 0) {
        const nowPc = this.getPcByQQNumber(item.Id);
        if (nowPc && nowPc.inited) {
          returnPcs.push(this.getPcByQQNumber(item.Id) as Pc);
        }

      }
    })
    return returnPcs;
  }

  /**
   * 新增默认发送窗口
   * @param title 标题
   * @param sendTo 发送数组
   * @param key 键
   * @param closable 是否允许关闭?
   */
  addCurrentSendPanes(title: string, sendTo: sendTo, key: number, closable: boolean = true) {
    const newPane: panes = {
      title: title,
      sendTo: sendTo,
      key: key,
      closable: closable
    }
    this.groups[this.currentGroup].currentSendPanes[key] = newPane;

  }

  /**
   * Pc的Id数组转化为Pc昵称数组
   * @param ids Id数组
   * @param onlyFirstChar 只保留第一个字符?
   * @returns {string[]} Pc昵称数组
   */
  ids2ChatlistItemName(ids: string[], onlyFirstChar: boolean = false): string[] {
    const rNames: string[] = []
    this.CurrentChatList.map((item) => {
      ids.map((id) => {
        if (parseInt(id) == item.Id || (typeof id == 'string' && this.getChatAreaById(id) && this.getChatAreaById(id)?.member.includes(item.Id))) {
          if (!onlyFirstChar) {
            rNames.push(item.nickName)
          } else {
            rNames.push(item.nickName.charAt(0))
          }
        }
      })
    })
    return rNames
  }

  /**
   * 移除目标键发送窗口
   * @param targetKey 目标键 
   */
  removeCurrentSendPanes(targetKey: React.MouseEvent | React.KeyboardEvent | string) {
    const newP: panes[] = this.groups[this.currentGroup].currentSendPanes.slice();
    var lastIndex = -1;
    //var newActiveKey = this.groups[this.currentGroup].activeKey
    const tKey = parseInt(targetKey as string)
    newP.forEach((pane, i) => {
      if (pane != null) {
        if (pane.key == tKey) {
          lastIndex = i - 1;
          delete newP[i]
        }
      }
    });
    this.groups[this.currentGroup].currentSendPanes = newP
    // const newPanes = newP.filter(pane => pane.key != tKey);
    // if (newPanes.length && newActiveKey === tKey) {
    //   if (lastIndex >= 0) {
    //     newActiveKey = newPanes[lastIndex].key;
    //   } else {
    //     newActiveKey = newPanes[0].key;
    //   }
    // }
    // //this.groups[this.currentGroup].currentSendPanes = newPanes;
    //console.log(newPanes)
    // this.groups[this.currentGroup].activeKey = newActiveKey;
  }

  /**
   * 生成发送窗口key
   * @returns {number} key
   */
  geneSendPanesKey = () => {
    for (var i = 0; i < 99999; i++) {
      if (this.currentSendPanes[i] == undefined) {
        return i
      }
    }
    return -1;
  }

  /**
   * 生成随机池随机结果
   * @param ePcs 目标pcs
   * @param IRandomItems 随机项 
   * @returns {CheckedRandomItem[]} 随机项生成结果
   */
  geneRandomResult(ePcs: number[] = [], IRandomItems: IRandomItem[]) {
    var counts = 0;
    const nowRndResults: CheckedRandomItem[] = []
    if (ePcs.length == 0) {
      this.AllPcList.map((pc) => {
        ePcs.push(pc.Id)
      })
    }
    IRandomItems.map((item) => {
      counts += item.min
      if (counts > ePcs.length) {
        return
      }
      for (var i = 0; i < item.min; i++) {
        var rndIdx = randomRangeInt(0, ePcs.length - 1)
        while (nowRndResults.map((result) => { return result.to }).includes(ePcs[rndIdx])) {
          rndIdx = randomRangeInt(0, ePcs.length - 1)
        }
        const newResult: CheckedRandomItem = {
          to: ePcs[rndIdx],
          msg: item.RandomItemDesc
        }
        nowRndResults.push(newResult)
      }
    })
    return nowRndResults
  }

  switchConfig(configName: string, modify?: boolean) {
    const nowConfig = this.config[configName]
    if (nowConfig != undefined) {
      const newConfig = Object.assign({}, this.config)
      if (modify) {
        newConfig[configName] = modify
      } else {
        newConfig[configName] = !this.config[configName]
      }
      this.config = newConfig
    }

  }
  /**
   * 交换是否允许新人入团?
   */
  swapCanChatListAdd() {
    this.config.canChatListAdd = !this.config.canChatListAdd;
    //console.log(this.config.canChatListAdd);
  }

  /**
   * 通过回合数排序,默认倒序
   */
  swapOrderByTurn() {
    this.config.orderByTurn = !this.config.orderByTurn;
  }

  /**
   * 交换是否启用消极?
   */
  swapNegative() {
    this.config.negative = !this.config.orderByTurn;
  }


  /**
   * 新增团
   * @param group 团对象
   */
  groupAdd(group: Group) {
    const newGroups = this.groups.slice();
    newGroups.push(group);
    this.groups = newGroups;
  }

  /**
   * 删除模态框
   * @param Id 模态框Id
   */
  modalDel(Id: number) {
    const findMsg = this.findModalById(Id);
    if (findMsg.idx != -1 && Id != 0) {
      //console.log(this.groups[this.currentGroup], findMsg.from)
      //this.groups[this.currentGroup][findMsg.from].splice(findMsg.idx, 1)
      if (findMsg.from == 'currentPcModal') {
        const newChatList = this.groups[this.currentGroup].currentChatList.slice();
        const newPcModal = this.groups[this.currentGroup].Modal.slice();
        newPcModal.splice(this.qqNumberInModal(Id), 1);
        newChatList.splice(this.qqNumberInChatList(Id), 1);
        this.groups[this.currentGroup].currentChatList = newChatList;
        this.groups[this.currentGroup].Modal = newPcModal;
        const newPc = this.groups[this.currentGroup].pc.filter((pc) => { return pc.Id != Id })
        this.groups[this.currentGroup].pc = newPc
      }
      if (findMsg.from == 'currentTeamModal') {
        const newChatList = this.groups[this.currentGroup].currentChatList.slice();
        const newTeamModal = this.groups[this.currentGroup].currentTeams.slice();
        newChatList.splice(this.qqNumberInChatList(Id), 1);
        newTeamModal.splice(this.qqNumberInModal(Id), 1);
        this.groups[this.currentGroup].currentChatList = newChatList;
        this.groups[this.currentGroup].currentTeams = newTeamModal;
        this.groups[this.currentGroup].currentChatTo = 0;
      }
    } else {
    }
  }

  /**
   * 删除世界
   * @param Id 可选, 世界Id
   * @param idx 可选, 第几个世界
   * @returns {void}
   */
  worldDel(Id?: string, idx?: number): void {
    if (Id) {
      const index = this.findWorldById(Id)
      if (index != -1) {
        this.currentWorld.splice(index, 1)
        return
      }
    }
    if (idx) {
      this.currentWorld.splice(idx, 1)
    }
  }

  /**
   * 通过目标Pc的qq号获取频道
   * @param Id 目标Pc的Id值,通常是QQ号
   * @returns {Team | undefined}
   */
  getTeamByQQNumber(Id: number): Team | undefined {
    const idx = this.findTeamByQQNumber(Id);
    if (idx != -1) {
      return this.groups[this.currentGroup].currentTeams[idx];
    }
    return undefined;
  }

  /**
   * 获取所有频道的Pc的Id
   * @returns {number[]}
   */
  getAllTeamsPcsIdx() {
    const returnIdxs: number[] = []
    for (var i = 0; i < this.groups[this.currentGroup].currentTeams.length; i++) {
      const nowAreaPcs = this.groups[this.currentGroup].currentTeams[i].pcs
      for (var j = 0; j < nowAreaPcs.length; j++) {
        returnIdxs.push(j);
      }
    }
    return returnIdxs;
  }

  /**
   * 通过QQ号获取所在频道
   * @param Id QQ号
   * @returns {number} 所在频道数组下标,为-1时未找到
   */
  findTeamByQQNumber(Id: number): number {
    for (var i = 0; i < this.groups[this.currentGroup].currentTeams.length; i++) {
      if (this.groups[this.currentGroup].currentTeams[i].Id == Id) {
        return i
      }
    }
    return -1;
  }

  /**
   * 设置目标频道的Pc对象数组
   * @param Id 频道Id
   * @param pcs Pc对象数组
   */
  setTeamPcs(Id: number, pcs: Pc[]) {
    const nowArea = this.getTeamByQQNumber(Id)
    if (nowArea) {
      nowArea.pcs = pcs;
    }
  }

  /**
   * 新增频道
   * @param name 频道名
   * @param pcs 初始Pc对象数组
   * @param allowRepeat 允许Pc在此频道与其他频道一起出现?
   */
  teamAdd(name: string, pcs: Pc[] = [], allowRepeat: boolean = false, nemo: boolean = false): void {
    const newTeams = this.groups[this.currentGroup].currentTeams;
    var idx = -1;
    for (var i = 1; i < 10001; i++) {
      var inTeams = false;
      for (var j = 0; j < this.groups[this.currentGroup].currentTeams.length; j++) {
        if (this.groups[this.currentGroup].currentTeams[j].Id == i) {
          inTeams = true;
        }
      }
      if (!inTeams) {
        idx = i;
        break;
      }
    }
    if (idx != -1) {
      const newTeam: Team = {
        name: name,
        Id: idx,
        visible: true,
        bounds: { x: 100, y: 100 },
        size: { width: 300, height: 200 },
        nemo: nemo,
        pcs: pcs,
        buff: [],
        allowPcNicknameRepeat: allowRepeat,
        chat: []
      }
      newTeams.push(newTeam);
      this.groups[this.currentGroup].currentTeams = newTeams;
      this.chatListAdd(name, idx, "", 0);
    }
  }

  /**
   * 新增虚拟讨论组
   * @param Id 虚拟讨论组Id
   * @param newChatArea 新虚拟讨论组对象
   */
  chatAreaAdd(Id: string, newChatArea: IArea) {
    const nowWorld = this.getWorldById(Id)
    if (nowWorld) {
      nowWorld.world.chatAreas.push(newChatArea)
    }
  }

  /**
   * 通过数组下标获取虚拟讨论组
   * @param Id 世界Id
   * @param idx 数组下标
   * @returns {IArea | undefined}
   */
  getChatAreaByIdx(Id: string, idx: number): IArea | undefined {
    const nowWorld = this.getWorldById(Id)
    if (nowWorld) {
      return nowWorld.world.chatAreas[idx]
    }
  }

  /**
   * 设置虚拟讨论组
   * @param Id 世界Id
   * @param newChatArea 虚拟讨论组数组对象
   */
  setChatArea(Id: string, newChatArea: IArea[]) {
    const nowWorld = this.getWorldById(Id)
    if (nowWorld) {
      nowWorld.world.chatAreas = newChatArea
    }
  }

  /**
   * 设置虚拟讨论组是否进入战斗轮?
   * @param Id 虚拟讨论组Id
   * @param combat 是否进入战斗轮?
   */
  setChatAreaCombatById(Id: string, combat: boolean) {
    const nowChatArea = this.getChatAreaById(Id)
    if (nowChatArea) {
      nowChatArea.combat = combat
    }
    this.updateChatArea()
  }

  /**
   * 更新虚拟讨论组
   */
  updateChatArea() {
    this.chatAreaFresh += 1
  }

  /**
   * 新增世界
   * @param name 世界名称
   * @param pcs 世界初始化Pc对象数组
   * @param allowRepeat 允许此世界Pc出现在其他世界?
   */
  worldAdd(name: string, pcs: number[] = [], allowRepeat: boolean = false): void {
    const newWorlds = this.groups[this.currentGroup].currentWorlds;
    const newWorld: IWorldModal = {
      world: {
        name: name,
        PcNumbers: pcs,
        chatAreas: [],
        Areas: [],
      },
      Id: uuid(),
      visible: true,
      bounds: { x: 100, y: 100 },
      size: { width: 300, height: 200 },
    }
    newWorlds.push(newWorld);
    this.groups[this.currentGroup].currentWorlds = newWorlds;
  }

  /**
   * 寻找Pc所在频道
   * @param Id Pc的Id值,通常是qq号
   * @returns {TeamPcIdx[]} teamIdx:所在频道数组下标, PcIdx:所在频道的pc数组下标
   */
  findPcTeam(Id: number): TeamPcIdx[] {
    const returnIdx: TeamPcIdx[] = []
    for (var i = 0; i < this.groups[this.currentGroup].currentTeams.length; i++) {
      const pcs = this.groups[this.currentGroup].currentTeams[i].pcs
      for (var j = 0; j < pcs.length; j++) {
        if (pcs[j].Id == Id) {
          const idx: TeamPcIdx = {
            teamIdx: i,
            pcIdx: j
          }
          returnIdx.push(idx)
        }
      }
    }
    return returnIdx;
  }

  /**
   * 通过频道Id获取频道所有Pc的Id
   * @param Id 频道Id
   * @returns {number[], string, Team|undefined} Pc的Ids, 频道名称, 频道或undefined
   */
  getTeamPcIdsByTeamId(Id: number): { ids: number[], name: string, team: Team | undefined } {
    const rNumber: number[] = []
    var rName = ''
    for (var i = 0; i < this.groups[this.currentGroup].currentTeams.length; i++) {
      const nowTeam = this.groups[this.currentGroup].currentTeams[i]
      if (nowTeam.Id == Id) {
        rName = nowTeam.name
        const pcs = nowTeam.pcs
        pcs.map((pc) => {
          rNumber.push(pc.Id)
        })
        return { ids: rNumber, name: rName, team: nowTeam }
      }
    }
    return { ids: rNumber, name: rName, team: undefined }
  }

  /**
   * 后处理所有的聊天发送窗口
   */
  postProcessAllSendToCheck() {
    for (var i = 0; i < this.currentSendPanes.length - 1; i++) {
      this.postProcessSendToCheck(i)
    }
  }

  /**
   * 后处理聊天发送窗口发送对象是否可勾选
   * @param idx 
   */
  postProcessSendToCheck(idx: number) {
    const nowSendTo = this.getCurrentSendTo(idx)
    //console.log(this.currentWorld[0].world.chatAreas)
    const nowPcs = nowSendTo.targets.filter((tar) => { return parseInt(tar) > 10000 && parseInt(tar) + '' == tar })
    const nowTeams = nowSendTo.targets.filter((tar) => { return parseInt(tar) < 10000 && parseInt(tar) + '' == tar })
    const nowChatAreas = nowSendTo.targets.filter((tar) => { return (typeof tar == 'string') })
    const newTargets: string[] = []
    nowPcs.map((tar, index) => {
      if (!this.checkSendToIsRepeated(tar, idx)) {
        newTargets.push(tar)
      }
    })
    //@ts-ignore
    this.groups[this.currentGroup].currentSendPanes[idx].sendTo.targets = this.currentSendPanes[idx].sendTo.targets.map(Number).includes(0) ? [0] : newTargets.concat(nowTeams).concat(nowChatAreas)
    this.groups[this.currentGroup].currentSendPanes[idx].title = this.ids2ChatlistItemName(nowSendTo.targets, true).length == 0 ? "默认多选" : this.ids2ChatlistItemName(nowSendTo.targets, true).join(',')
    //console.log(this.groups[this.currentGroup].currentSendPanes[idx].sendTo.targets)
  }

  /**
   * 检查发送窗口是否重复
   * @param Id 频道Id
   * @param idx 发送窗口数组下标
   * @returns {boolean}
   */
  checkSendToIsRepeated(Id: string, idx: number): boolean {
    const nowTeams = this.getCurrentSendTo(idx).targets.filter((tar) => { return parseInt(tar) < 10000 && parseInt(tar) + '' == tar })
    const nowChatAreas = this.getCurrentSendTo(idx).targets.filter((tar) => { return (typeof tar == 'string') })
    var rBool = false;
    nowTeams.map((id) => {
      const nowId = parseInt(id)
      const nowPcIds = this.getTeamPcIdsByTeamId(nowId)
      //console.log(nowPcIds)
      if (!rBool) {
        rBool = nowPcIds.ids.map(String).includes(Id + '')
      }
      if (id == '0') {
        rBool = true
      }
    })
    nowChatAreas.map((id) => {
      // id.split('.').map((nowID) => {
      //   if (nowID == ID && !rBool) {
      //     rBool = true
      //   }
      // })
      const nowArea = this.getChatAreaById(id)
      if (nowArea) {
        nowArea.member.map((nowID) => {
          if (nowID == parseInt(Id) && !rBool) {
            rBool = true
          }
        })
      }
    })
    //console.log(ID, rBool)
    return rBool
  }

  /**
   * 通过Id获取虚拟讨论组
   * @param Id 虚拟讨论组Id
   * @returns {undefined | IArea}
   */
  getChatAreaById(Id: string) {
    const nowChatAreaIdx = this.findChatAreaById(Id)
    if (nowChatAreaIdx.length != 0) {
      return this.currentWorld[nowChatAreaIdx[0].worldIdx].world.chatAreas[nowChatAreaIdx[0].chatAreaIdx]
    }
    return undefined
  }

  /**
   * 通过Id找到虚拟讨论组
   * @param Id 虚拟讨论组Id
   * @returns {ChatAreaIdx[]}
   */
  findChatAreaById(Id: string): ChatAreaIdx[] {
    const returnIdx: ChatAreaIdx[] = []
    const nowWorlds = this.currentWorld
    nowWorlds.map((world, wIdx) => {
      world.world.chatAreas.map((chatArea, cIdx) => {
        if (chatArea.id == Id) {
          const newChatAreaIdx: ChatAreaIdx = {
            worldIdx: wIdx,
            chatAreaIdx: cIdx
          }
          returnIdx.push(newChatAreaIdx)
        }
      })
    })
    return returnIdx
  }

  /**
   * 
   * @param Id 
   * @returns 
   */
  findPcWorld(Id: number) {
    const returnIdx: TeamPcIdx[] = []
    for (var i = 0; i < this.groups[this.currentGroup].currentWorlds.length; i++) {
      const pcs = this.groups[this.currentGroup].currentWorlds[i].world.PcNumbers
      for (var j = 0; j < pcs.length; j++) {
        if (pcs[j] == Id) {
          const idx: TeamPcIdx = {
            teamIdx: i,
            pcIdx: j
          }
          returnIdx.push(idx)
        }
      }
    }
    return returnIdx;
  }

  /**
   * 在虚拟讨论组里查询Pc
   * @param Id Pc的Id值,通常是qq号
   * @returns {ChatAreaPcIdx[]}
   */
  findPcChatArea(Id: number): ChatAreaPcIdx[] {
    const returnIdx: ChatAreaPcIdx[] = []
    for (var i = 0; i < this.groups[this.currentGroup].currentWorlds.length; i++) {
      const nowChatArea = this.groups[this.currentGroup].currentWorlds[i].world.chatAreas
      for (var j = 0; j < nowChatArea.length; j++) {
        for (var k = 0; k < nowChatArea[j].member.length; k++) {
          if (nowChatArea[j].member[k] == Id) {
            const idx: ChatAreaPcIdx = {
              worldIdx: i,
              chatAreaIdx: j,
              pcIdx: k
            }
            returnIdx.push(idx)
          }
        }
      }
    }
    return returnIdx;
  }

  /**
   * 通过Pc的Id值获取虚拟讨论组
   * @param Id Pc的Id值
   * @returns {IArea | undefined}
   */
  getPcChatAreaById(Id: number): IArea | undefined {
    const chatAreaIdxs = this.findPcChatArea(Id)
    if (chatAreaIdxs.length != 0) {
      const nowArea = this.currentWorld[chatAreaIdxs[0].worldIdx].world.chatAreas[chatAreaIdxs[0].chatAreaIdx]
      return nowArea
    }
    return undefined
  }

  /**
   * 重置团
   */
  groupReset() {
    this.groups = [];
    this.currentGroup = 0
    this.refuseListQQNumber = []
    //this.groups = []
  }

  /**
   * 根据下标删除团
   * @param idx 目标团下标
   */
  groupDel(idx: number) {
    const newGroups = this.groups.slice()
    newGroups.splice(idx, 1)
    this.groups = newGroups
    if (idx == this.currentGroup) {
      this.setCurrentGroup(0)
    }
  }

  /**
   * 通过数组下标获取团
   * @param idx 数组下标
   * @returns 
   */
  getGroupMsgByIdx(idx: number) {
    return ({ ...this.groups[idx] })
  }

  get AllGroupsMsg() {
    const Msg = new Array();
    var i: any;
    for (i in this.groups) {
      Msg.push({ ...this.groups[i] });
    }
    return (Msg)
  }

  get currentGroupChatMsgs() {
    return this.groups[this.currentGroup].chatMsg
  }

  get currentGroupChatLists() {
    return this.groups[this.currentGroup].currentChatList
  }
  /**
   * 通过世界Id获取虚拟讨论组数组
   * @param Id 世界Id
   * @returns {IArea[] | undefined}
   */
  getChatAreasByWorldId(Id: string): IArea[] | undefined {
    const nowW = this.getWorldById(Id)
    if (nowW) {
      return nowW.world.chatAreas
    }
    return undefined
  }

  /**
   * 获取目标qq号最后一条消息
   * @param Id 目标qq号
   * @returns {string}
   */
  getLastMsgByQQnumber(Id: number): string {
    var AllMsg = toJS(this.groups[this.currentGroup].chatMsg)
    var returnMsg: string = "";
    //console.log(AllMsg)
    for (var i in AllMsg) {
      if (AllMsg[i].sender.id == Id) {
        const len = AllMsg[i].messageChain.length - 1;
        switch (AllMsg[i].messageChain[len].type) {
          case 'Source': {
            break;
          }
          case 'Plain': {
            returnMsg = AllMsg[i].messageChain[len].text || "未知错误";
            break;
          }
        }
      }
    }
    return (returnMsg)
  }

  /**
   * 获取本地自动存储localstorage内容
   * @returns {Promise<string>}
   */
  async getPersistedData(): Promise<string> {
    const data = await getPersistedStore(this)
    return JSON.stringify(data)
  }

  /**
   * 新增聊天列表
   * @param nickName 昵称
   * @param Id Id值
   * @param lastWords 最后发言内容
   * @param count 未读消息计数
   */
  chatListAdd(nickName: string, Id: number, lastWords: string, count: number = 1) {
    const newItem: Item = {
      Id: Id,
      nickName: nickName,
      lastWords: lastWords,
      notReadCount: count,
    }
    const newChatList = this.groups[this.currentGroup].currentChatList?.slice();
    newChatList.push(newItem)
    this.groups[this.currentGroup].currentChatList = newChatList;
  }

  /**
   * 通过Id寻找模态框
   * @param Id Id
   * @returns 
   */
  qqNumberInModal(Id: number): number {
    var index = -1;
    this.groups[this.currentGroup].Modal.forEach(function (item, idx) {

      if (Id == item.Id)
        index = idx;
    });
    return index;
  }

  /**
   * 通过Id寻找聊天列表
   * @param Id Id
   * @returns {number}
   */
  qqNumberInChatList(Id: number): number {
    var index = -1;
    this.groups[this.currentGroup].currentChatList.forEach(function (item, idx) {

      if (Id == item.Id)
        index = idx;
    });
    return index;
  }

  /**
   * 通过Id更新聊天对象控件最后发言内容
   * @param Id Id
   * @param lastWords 最后发言内容
   * @param newMsgCount 新消息计数
   */
  upDateLastWords(Id: number, lastWords: string, newMsgCount: number) {
    const findIdx = this.qqNumberInChatList(Id)
    if (findIdx != -1) {
      const newChatList = this.groups[this.currentGroup].currentChatList.slice()
      newChatList[findIdx].lastWords = lastWords;
      if (Id != this.CurrentChatTo)
        newChatList[findIdx].notReadCount += newMsgCount;
      this.groups[this.currentGroup].currentChatList = newChatList;
    } else {
      //console.log("警告：没有在列表里找到目标qq号" + Id)
    }
  }

  /**
   * 是否是默认发送窗口
   * @param Id Id
   * @returns {boolean}
   */
  isCurrentChatTo(Id: number): boolean {
    if (this.groups[this.currentGroup].currentChatTo == Id) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 设置默认发送窗口
   * @param Id 默认发送窗口Id
   */
  setCurrentChatTo(Id: number) {
    this.groups[this.currentGroup].currentChatTo = Id;
    this.groups[this.currentGroup].currentChatList.map((item, idx) => {
      if (item.Id == Id) {
        item.notReadCount = 0;
      }
    })
  }

  /**
   * 交换聊天对象控件
   * @param source 来源
   * @param to 目标
   */
  swapChatListItem(source: number, to: number) {
    if (source != 0 && to != 0) {
      const newChatList: Item[] = Array.from(this.groups[this.currentGroup].currentChatList);
      const [removed] = newChatList.splice(source, 1);
      newChatList.splice(to, 0, removed);
      this.groups[this.currentGroup].currentChatList = newChatList;
    }
  }

  get CurrentChatTo() {
    return this.groups[this.currentGroup].currentChatTo;
  }

  get CurrentChatList() {
    return this.groups[this.currentGroup].currentChatList
  }

  sendCheckedRndResults(results: CheckedRandomItem[]) {
    results.map((result) => {
      this.ezSendText(result.to, [result.msg])
    })
  }
  /**
   * 通过ws发送消息
   * @param command 关键字 
   * @param Id qq号
   * @param messageChain 消息链
   * @param showMsg 在月莓的聊天窗口是否显示?
   */
  async wsSendMsg(command: string, Id: number, messageChain: miraiMessageChain[], showMsg: boolean = true) {
    const Send = {
      syncId: 123,                  // 消息同步的字段
      command: command,             // 命令字
      subCommand: null,             // 子命令字, 可空
      content: {
        target: Id,
        messageChain: messageChain
      }                   // 命令的数据对象, 与通用接口定义相同
    }
    this.ws?.send(JSON.stringify(Send))
    if (showMsg) {
      const newChatMsg: miraiContent = {
        type: chatType.FriendMessage,
        sender: {
          id: -Id,
        },
        messageChain: messageChain
      }
      this.chatAdd(newChatMsg)
      message.success('消息成功发送');
    }

    // for(var i in messageChain) {
    //   switch(messageChain[i].type) {
    //     case messageType.Plain:
    //       this.chatCtl!.addMessage({
    //         type: 'text',
    //         content: messageChain[i].text!,
    //         self: true,
    //       }); 
    //       break;
    //   }  
    // }

  }

  /**
   * 轻松群发文本消息
   * @param qqNumbers qq号数组 
   * @param text 字符串数组,会遍历发送每条
   * @param showMsg 在月莓的聊天窗口是否显示?
   */
  ezSendBatchText(qqNumbers: number[], text: string[], showMsg: boolean = true) {
    const msgChain: miraiMessageChain[] = [];
    for (var i in qqNumbers) {
      for (var j in text) {
        const newMsg: miraiMessageChain = {
          type: messageType.Plain,
          id: qqNumbers[i],
          text: text[i]
        }
        msgChain.push(newMsg);
      }
      this.wsSendMsg("sendFriendMessage", qqNumbers[i], msgChain, showMsg);
    }
  }

  /**
   * 轻松发送文本消息
   * @param Id QQ号
   * @param text 字符串数组,会遍历发送每条
   * @param showMsg 在月莓的聊天窗口是否显示?
   */
  ezSendText(Id: number, text: string[], showMsg: boolean = true, setTarReplyFalse: boolean = true) {
    const msgChain: miraiMessageChain[] = [];
    for (var i in text) {
      const newMsg: miraiMessageChain = {
        type: messageType.Plain,
        id: Id,
        text: text[i]
      }
      msgChain.push(newMsg);
    }
    if (setTarReplyFalse) {
      const nowNegative = this.getNegativeById(Id)
      if (nowNegative) {
        nowNegative.reply = false
      }
      const nowPc = this.getPcByQQNumber(Id)
      if (nowPc) {
        const nowChecked = this.checkedIfHalfPcOverTurn()
        this.startNegativeTimeOut(nowChecked, [nowPc], 1000 * 60 * 2)
      }
    }

    this.wsSendMsg("sendFriendMessage", Id, msgChain, showMsg);
  }

  /**
   * 导出Root
   */
  exportRoot() {
    var blob = new Blob([JSON.stringify(this)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, new Date().toISOString() + '.txt')
  }

  /**
   * 根据设定导出Pc数据
   * @param ePcs PcIds
   * @param withStMSg 是否携带st发送的消息
   */
  exportAllPcsByConfig(ePcs: number[] = [], withStMSg: Boolean = true) {
    const newDataObj = {}
    if (ePcs.length == 0) {
      newDataObj['Pcs'] = this.AllPcList
      newDataObj['chatMsgs'] = this.currentGroupChatMsgs
      newDataObj['chatlists'] = this.currentGroupChatLists
    } else {
      const newExportPcs: Pc[] = []
      const newExportChatMsgs: Chat[] = []
      const newExportChatlists: Item[] = []
      this.AllPcList.map((pc) => {
        if (ePcs.includes(pc.Id)) {
          newExportPcs.push(pc)
          newExportChatMsgs.push(...this.getAllChatByQQNumber(pc.Id, withStMSg))
          newExportChatlists.push(this.getChatListItemByQQNumber(pc.Id))
        }
      });
      newDataObj['Pcs'] = newExportPcs
      newDataObj['chatMsgs'] = newExportChatMsgs
      newDataObj['chatlists'] = newExportChatlists
    }
    var blob = new Blob([JSON.stringify(newDataObj)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, '[导出]' + new Date().toISOString() + '.txt')
  }

  /**
   * 导出所有Pc
   */
  exportAllPcs(ePcs: number[] = []) {
    if (ePcs.length == 0) {
      var blob = new Blob([JSON.stringify(this.AllPcList)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, '[PC]' + new Date().toISOString() + '.txt')
    } else {
      const newExportPcs: Pc[] = []
      this.AllPcList.map((pc) => {
        if (ePcs.includes(pc.Id)) {
          newExportPcs.push(pc)
        }
      })
      var blob = new Blob([JSON.stringify(newExportPcs)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, '[PC]' + new Date().toISOString() + '.txt')
    }
  }

  /**
   * 导出当前团所有聊天信息
   */
  exportAllChatMsgs(ePcs: number[] = []) {
    if (ePcs.length == 0) {
      var blob = new Blob([JSON.stringify(this.currentGroupChatMsgs)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, '[ChatMsg]' + new Date().toISOString() + '.txt')
      var blob = new Blob([JSON.stringify(this.currentGroupChatLists)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, '[ChatLists]' + new Date().toISOString() + '.txt')
    } else {
      const newChats: Chat[] = []
      this.currentGroupChatMsgs.map((msg) => {
        if (ePcs.includes(msg.sender.id)) {
          newChats.push(msg)
        }
      })
      var blob = new Blob([JSON.stringify(newChats)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, '[ChatMsg]' + new Date().toISOString() + '.txt')
      const newItems: Item[] = []
      this.currentGroupChatLists.map((chatlist) => {
        if (ePcs.includes(chatlist.Id)) {
          newItems.push(chatlist)
        }
      })
      var blob = new Blob([JSON.stringify(newItems)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, '[ChatLists]' + new Date().toISOString() + '.txt')
    }
  }
  /**
   * 导入Root
   * @param newRoot 新Root
   */
  importRoot(newRoot: Root) {
    this.groups = newRoot.groups
    this.skillsPool = newRoot.skillsPool
  }

  /**
   * 
   * @param newDataObj 导入的数据对象
   */
  importAllByConfig(newDataObj: any) {
    if (newDataObj['Pcs']) {
      this.importAllPcs(newDataObj['Pcs'])
    }
    if (newDataObj['chatlists']) {
      this.importAllChatlists([{
        Id: 0,
        nickName: '所有消息',
        lastWords: '',
        notReadCount: 0
      }].concat(newDataObj['chatlists']))
    }
    if (newDataObj['chatMsgs']) {
      this.importAllChatMsgs(newDataObj['chatMsgs'])
    }
  }

  /**
   * 导入Pc对象数组到当前团
   * @param newPcs 
   */
  importAllPcs(newPcs: Pc[]) {
    this.groups[this.currentGroup].pc = newPcs
  }

  /**
   * 导入聊天信息到当前团
   * @param newChatMsg 
   */
  importAllChatMsgs(newChatMsg: Chat[]) {
    this.groups[this.currentGroup].chatMsg = newChatMsg
  }

  /**
  * 导入聊天列表到当前团
  * @param newChatlists
  */
  importAllChatlists(newChatlists: Item[]) {
    this.groups[this.currentGroup].currentChatList = newChatlists
  }

  /**
   * 是否是Root实例?
   * @param object 任意对象
   * @returns {boolean}
   */
  instanceOfRoot(object: any): object is Root {
    return object.discriminator === 'Root';
  }
}

