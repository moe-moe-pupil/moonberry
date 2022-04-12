import { chatType, messageType, miraiContent } from "@/stores/ChatStore";
import Pc from "@/stores/PcStore";
import Root, { ISkillsPoolType } from "@/stores/RootStore";
import Skill, { SkillTargetEnum, SkillTypeEnum } from "@/stores/SkillStore";
import { TransgenderTwoTone } from "@mui/icons-material";
import ReconnectingWebSocket from "reconnectingwebsocket";
import { exchangeHandle, exchangeType, pcInNickNameExchange, pcInPicExchange, pcInSkillExchange, pcInStatusExchange, pcStatusAdd } from "./exchangeHandle";
export const teamChatReg = new RegExp('^(\\[|【).*(\\]|】$)');
export const worldChatReg = new RegExp('^("|“|”).*("|“|”$)');
export const skillNameReg = /名称:|名称：|打击类型:|打击类型：|类型:|类型：|描述:|描述：/g;
export const numberReg = new RegExp('^[0-9]+$');
const statusString = [
  "力量",
  "敏捷",
  "灵巧",
  "体质",
  "智力",
  "智慧",
  "知识",
  "魅力"
]

export function preHandle(RootStore: Root, e: ReconnectingWebSocket.MessageEvent) {
  var eJson = JSON.parse(e.data);
  var newChatMsg: miraiContent = {
    type: chatType.GroupMessage,
    sender: undefined,
    messageChain: []
  }
  for (var i in eJson.data) {
    newChatMsg[i] = eJson.data[i];
  }
  const qqNumber = newChatMsg.sender?.id!;
  if (eJson.syncId != '' && newChatMsg.type == chatType.FriendMessage && !eJson.data.messageId) {
    RootStore.chatAdd(newChatMsg);
    if (RootStore.qqNumberInChatList(newChatMsg.sender?.id || -1) == -1) {
      if (RootStore.canChatListAdd && RootStore.refuseListQQNumber.indexOf(qqNumber) == -1) {
        RootStore.ezSendText(qqNumber, [`请等待ST回应，你已被记录。`])
        RootStore.refuseListQQNumber.push(qqNumber)
        RootStore.openNotification(newChatMsg.sender?.nickname || "未知错误", newChatMsg.sender?.id || 0, RootStore.getLastWord(newChatMsg).lastWords)
      } else {
        if (RootStore.refuseListQQNumber.indexOf(qqNumber) == -1) {
          RootStore.refuseListQQNumber.push(qqNumber)
          RootStore.ezSendText(qqNumber, [`抱歉，ST已经关闭了入团通道，这通常是因为人满了，下次再来吧。`])
        } else {
        }

      }
    } else {
      const last = RootStore.getLastWord(newChatMsg)
      const lastWords = last.lastWords;
      const lastContent = last.lastContent;
      const lastType = last.lastType;
      const nowPc = RootStore.getPcByQQNumber(qqNumber)
      if (lastWords.slice(0, 1) == '.' || lastWords.slice(0, 1) == '。') {
        switch (lastWords.slice(1)) {
          case "兑换":
            exchangeHandle(RootStore, newChatMsg);
            break;
          case "观察":
            const newObj = {}
            newObj['uppic'] = `-1,${window.name},${qqNumber}`
            RootStore.Ue4EzSendMsg('action', JSON.stringify(newObj))
            //RootStore.Ue4SendMsg(`{"action":{"uppic":"-1,${window.name},${qqNumber}"}}`)
            break;
          case "抽取天赋":
            if (nowPc && nowPc.inited) {
              RootStore.drawTalents(qqNumber)
            } else {
              RootStore.ezSendText(qqNumber, [`请先完成兑换再抽取天赋`])
            }

            break;
          case "抽取辅助天赋":
            if (nowPc && nowPc.inited) {
              RootStore.drawTalents(qqNumber, 3, ISkillsPoolType.支援天赋)
            } else {
              RootStore.ezSendText(qqNumber, [`请先完成兑换再抽取天赋`])
            }

            break;
          case "状态":
            RootStore.formatMsgPcStatus(qqNumber)
            break;
          case "已兑换":
            RootStore.formatMsgPcExchanged(qqNumber)
            break;
          case "冷却":
            RootStore.formatMsgPcCooldown(qqNumber)
            break;
          case "频道人员":
            RootStore.rMsgChannelList(qqNumber)
            break;
          default:
            break;
        }
      } else {


      }
      /** 兑换完成后的属性兑换 */
      if (statusString.indexOf(lastWords.split(" ")[0].slice(1, 3)) != -1 && (lastWords.split(" ")[0].slice(0, 1) == "." || lastWords.split(" ")[0].slice(0, 1) == "。")) {
        const value = parseInt(lastWords.split(" ")[1])
        console.log(value)
        if (value && value > 0) {
          pcStatusAdd(RootStore, qqNumber, value, statusString.indexOf(lastWords.split(" ")[0].slice(1, 3)) + 1)
        }
      }
      /** 属性兑换 **/
      if (pcInStatusExchange(RootStore, qqNumber) != -1 && numberReg.test(lastWords)) {
        const costPoint = parseInt(lastWords);
        const nowPc = RootStore.getPcByQQNumber(qqNumber) as Pc;
        if (costPoint <= nowPc.statusPoint && costPoint >= 0) {
          RootStore.addPcStatus(nowPc, costPoint);
          RootStore.nextExchange(qqNumber);
        } else {
          RootStore.ezSendText(qqNumber, ["输入不合法哦,你拥有 " + nowPc.statusPoint + " 属性点,但你试图兑换 " + costPoint + " 点属性，请重新输入"])
        }
      }
      /** 技能兑换 **/
      const nowSkill: string[] = lastWords.split(skillNameReg).slice(1, 5);
      for (var i in nowSkill) {
        nowSkill[i] = nowSkill[i].replace(/\n/g, "");
        nowSkill[i] = nowSkill[i].replace(/\r\n/g, "");
      }
      if (pcInSkillExchange(RootStore, qqNumber) != -1 || (nowPc && nowPc.inited)) {
        if (nowSkill.length == 4) {
          if (RootStore.findSkillByName(qqNumber, nowSkill[0]).count == 0) {
            const newSkill: Skill = new Skill();
            newSkill.name = nowSkill[0];
            newSkill.description = nowSkill[3]
            SkillTargetEnum[nowSkill[1]] ? newSkill.class = SkillTargetEnum[nowSkill[1]]
              : RootStore.ezSendText(qqNumber, ["打击类型错误, " + nowSkill[1] + " 类型不存在,已更改为默认值单目标，如果想做更改请联系st"]);
            SkillTypeEnum[nowSkill[2]] ? newSkill.type = SkillTypeEnum[nowSkill[2]]
              : RootStore.ezSendText(qqNumber, ["类型错误, " + nowSkill[2] + " 类型不存在,已更改为默认值法术，如果想做更改请联系st"]);
            if (nowPc) {
              nowPc.skillChain.push(newSkill);
            }
            RootStore.ezSendText(qqNumber, ["兑换数据已录入，请等待审核"]);
          } else {
            RootStore.ezSendText(qqNumber, ["已有重名兑换，请确保兑换名称唯一"]);
          }

        } else {
          if (skillNameReg.test(lastWords)) {
            console.log(nowSkill)
            RootStore.ezSendText(qqNumber, ["技能兑换输入不合法"])
          }
        }

      }

      if (pcInPicExchange(RootStore, qqNumber) != -1 && lastType == messageType.Image) {
        if (nowPc) {
          RootStore.setPcUrl(nowPc, lastContent)
          RootStore.nextExchange(qqNumber)
        }
      }

      if (pcInNickNameExchange(RootStore, qqNumber) != -1 && lastType == messageType.Plain) {
        if (nowPc) {
          if (RootStore.setPcNickname(nowPc, lastWords)) {
            RootStore.nextExchange(qqNumber)
          } else {
            RootStore.ezSendText(qqNumber, [`很抱歉，「${lastWords}」昵称已经被人使用了，请更换一个昵称`])
          }
        }
      }

      if (lastWords == ".." || lastWords == ".。" || lastWords == "。." || lastWords == "。。") {
        RootStore.lastExchange(qqNumber);
      }
      if (lastWords == "." || lastWords == "。") {
        if (pcInSkillExchange(RootStore, qqNumber) == -1) {
          RootStore.nextExchange(qqNumber);
        } else {
          if (RootStore.isAllSkillStInited(qqNumber)) {
            RootStore.modExchange(qqNumber, exchangeType.confirmSkill);
            RootStore.nextExchange(qqNumber);
          } else {
            RootStore.ezSendText(qqNumber, ["你尚有未完成兑换的技能，请等待审核"]);
          }
        }

      }
    }
  }

}