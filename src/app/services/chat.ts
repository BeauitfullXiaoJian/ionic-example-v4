import { Injectable } from '@angular/core';
import 'rxjs/add/observable/interval';
import { RequestService } from './request';
import { Observable } from 'rxjs';


@Injectable()
export class ChatService {

    private obs: Observable<string>;

    private messages = new Array<Message>();

    private apiRequestUrl = 'http://192.168.1.109:8080/request';
    private msgRequestUrl = 'http://192.168.1.109:8080/message';

    constructor(private request: RequestService) { }

    getInstance(uid: string) {
        if (!this.obs) {
            this.obs = this.request.websocket(this.apiRequestUrl, uid);
            this.initMsgSub(uid);
            try {
                this.messages = JSON.parse(localStorage.getItem('chatMessage'));
            } catch (e) {
                this.messages = [];
            }
        }
        return this.obs;
    }

    sendMessageTo(msg: Message) {
        this.messages.push(msg);
        return this.request.withoutHost.post(this.msgRequestUrl, { message: msg.message }, false);
    }

    newMsg(avatar: string, from: string, to: string, msg: { type: string, content: string }): Message {
        return {
            status: 0,
            self: true,
            avatar: avatar,
            message: {
                from: from,
                to: to,
                message: msg
            }
        };
    }

    newTextMsg(avatar: string, from: string, to: string, content: string) {
        return this.newMsg(avatar, from, to, { type: 'text', content });
    }

    newImageMsg(avatar: string, from: string, to: string, imgUrl: any) {
        return this.newMsg(avatar, from, to, { type: 'image', content: imgUrl });
    }

    newSoundMsg(avatar: string, from: string, to: string, soundUrl: any) {
        return this.newMsg(avatar, from, to, { type: 'sound', content: soundUrl });
    }


    initMsgSub(uid: string) {
        this.obs.subscribe(msgStr => {
            try {
                const msg: any = JSON.parse(msgStr);
                this.messages.push({
                    status: 1,
                    self: msg.from === uid,
                    avatar: '',
                    message: msg
                });
            } catch (e) {
                console.log('消息格式错误');
            }
        });
        setInterval(() => localStorage.setItem('chatMessage', JSON.stringify(this.messages)), 1000);
    }
}

export interface Message {
    status: number, // 0 发送中，1 正常，2 发送失败
    self: boolean,
    avatar: string,
    message: MessageData,
    blob?: Blob
}

export interface MessageData {
    from: string,
    to: string,
    message: {
        type: string,
        content: string
    }
}