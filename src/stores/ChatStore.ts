import { makeAutoObservable } from "mobx";


export enum chatType {
    GroupMessage = 'GroupMessage',
    FriendMessage = 'FriendMessage',
    TempMessage = 'TempMessage',
}

export enum messageType {
    Source = 'Source',
    Quote = 'Quote',
    At = 'At',
    AtAll = 'AtAll',
    Face = 'Face',
    Plain = 'Plain',
    Image = 'Image',
    FlashImage = 'FlashImage',
    Voice = 'Voice',
    Xml = 'Xml',
    Json = 'Json',
    App = 'App',
    Poke = 'Poke',
    Dice = 'Dice',
    MusicShare = 'MusicShare',
    ForwardMessage = 'ForwardMessage',
    File = 'File',
    MiraiCode = 'MiraiCode',

}

export interface miraiSender {
    id: number,
    nickname?: string,
    remark?: string,
    memberName?: string,
    specialTitle?: string,
    permission?: string,
    joinTimestamp?: number,
    lastSpeakTimestamp?: number,
    muteTimeRemaining?: number,
    group?: {
        id: number,
        name: string,
        permission: string,
    },
}

export interface miraiMessageChain {
    type: messageType,
    id: number,
    time?: number,
    groupId?: number,
    senderId?: number,
    targetId?: number,
    origin?: JSON,
    target?: number,
    display?: string,
    faceId?: number,
    name?: string,
    text?: string,
    imageId?: string,
    url?: string,
    path?: string,
    base64?: string,
    voiceId?: string,
    xml?: string,
    json?: string,
    content?: string,
    value?: string,
    kind?: string,
    title?: string,
    summary?: string,
    jumpUrl?: string,
    pictureUrl?: string,
    musicUrl?: string,
    brief?: string,
    nodeList?: JSON,
    size?: number,
    code?: string,
}

export interface miraiContent {
    type: chatType,
    sender: miraiSender | undefined,
    messageChain: miraiMessageChain[],
}


export default class Chat implements miraiContent{
    type!: chatType;
    sender!: miraiSender;
    messageChain!: miraiMessageChain[];
    constructor(chat?:miraiContent) {
        makeAutoObservable(this);
        if(chat) {
            for(let i in chat) {
                this[i] = chat[i];
            }
        }
    }
}