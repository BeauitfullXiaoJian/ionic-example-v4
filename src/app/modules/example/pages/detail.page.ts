import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request';
import { ActivatedRoute } from '@angular/router';
import { switchMap, skipWhile } from 'rxjs/operators';

@Component({
    template: `
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-back-button></ion-back-button>
            </ion-buttons>
             <ion-title>详情页面</ion-title>
        </ion-toolbar>
    </ion-header>
  
    <ion-content>
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event.target)">
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-card mode="md">
            <ion-img src="https://ionicframework.com/docs/demos/api/card/madison.jpg"></ion-img>
            <ion-card-header>
                <ion-card-subtitle>{{detail.mobile}}</ion-card-subtitle>
                <ion-card-title>{{detail.nick}}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
                Keep close to Nature's heart... and break clear away, once in awhile,
                and climb a mountain or spend a week in the woods. Wash your spirit clean.
            </ion-card-content>
        </ion-card>
    </ion-content>`,
})
export class DetailPage implements OnInit {

    detail: any = {};

    constructor(
        private request: RequestService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.pipe(
            skipWhile(params => !params.userId),
        ).subscribe(params => {
            this.detail.id = params.userId;
            this.loadDatas();
        });
    }

    loadDatas(complete = new Function()) {
        this.request.get('/store/user/get', { userId: this.detail.id })
            .subscribe(
                {
                    next: (res) => {
                        this.detail = res.datas;
                    },
                    complete: () => complete()
                }
            );
    }

    doRefresh(refresher) {
        this.loadDatas(() => refresher.complete());
    }

}