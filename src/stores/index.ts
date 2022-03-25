
import { Item } from "@/component/chat/ChatListItem";
import { createContext } from "react";
import { Key } from "react";
import Chat from "./ChatStore";
import Group, { Team, GroupProps, IWorld, panes, skillEditModal, statusModal, IWorldModal, sendTo, TimeOutNegative } from "./GroupStore";
import PcStore from "./PcStore";
import RootStore from "./RootStore";
export const newpane:panes ={
    title: "默认多选",
    sendTo: {targets:[]},
    key: 0,
    closable: false
}

export class Papa implements GroupProps {
    negative: TimeOutNegative[] = [];
    activeKey: number | undefined = 1;
    initStatusPoint: number = 5;
    initExchangePoint: number = 6;
    currentChatList: Item[] = new Array(
        {
            Id: 0,
            nickName: '所有消息&右键打开世界',
            lastWords: '',
            notReadCount: 0
        }
    );
    guide: string =
    `死亡空间(Metastasis)
    模式：pvp 
    地图：在联合安全委员会对抗第二联盟数年后的宇宙大背景。
    注意：和死亡空间(Dead Space)剧情毫无关联。`;
    picBase64: string | ArrayBuffer | null | undefined;
    name: string = "温馨爬爬乐园";
    description: string = "群创建于2020/6/4:  一个跑团的爬爬乐园，随时可跑路";
    stDesc: string = "";
    wisMPReg: number = 1;
    wisMaxMP: number = 2.5;
    intMaxMP: number = 5;
    vitHPReg: number = 1;
    vitMaxHP: number = 3;
    lvMaxHP: number = 5;
    strMaxHP: number = 1;
    expGainPerLv: number = 3;
    expGainPerLvPvP: number = 0.15;
    pc: PcStore[] = [];
    Modal: statusModal[] = [];
    chatMsg: Chat[] = [];
    runTimes = 0;
    currentChatTo = 0;
    currentSendPanes: panes[] = [newpane];
    currentTeams: Team[] = [];
    currentSkillEdit: skillEditModal[] = [];
    currentWorlds: IWorldModal[] = [];
    get AllChatMsg() {
        const Msg = new Array();
        var i: any;
        for (i in this.chatMsg) {
            Msg.push({ ...this.chatMsg });
        }
        return (Msg)
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
// export default function createMobxStores() {
//     return {
//         RootStore: new RootStore(),
//     };
// }
// export const stores = createMobxStores();

export const storesContext = createContext({
    RootStore: new RootStore(),
})