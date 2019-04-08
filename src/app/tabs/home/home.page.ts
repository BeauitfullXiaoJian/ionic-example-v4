import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request';
import { Pagination } from 'src/app/classes/page.class';
import { NavController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    page = new Pagination();

    listDatas = new Array<any>();

    constructor(
        private request: RequestService,
        private navCtrl: NavController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        this.loadDatas();
    }

    loadDatas(complete = new Function(), reset = false) {
        this.request.get('/store/user/search', this.page.params()).subscribe({
            next: (res) => {
                reset && (this.page.reset(), this.listDatas = []);
                this.page.total = res.datas.total;
                this.listDatas.push(...res.datas.rows);
                this.page.hasNext() || this.toastCtrl.create({
                    message: '没有更多数据了',
                    duration: 2000,
                    showCloseButton: true,
                    closeButtonText: '关闭'
                }).then(toast => toast.present());
            },
            complete: () => (this.page.loading = false, complete())
        });
    }

    doRefresh(refresher) {
        this.loadDatas(() => refresher.complete(), true)
    }


    doInfinite(infinite) {
        if ((!this.page.loading) && this.page.hasNext()) {
            this.page.currentPage++;
            this.page.loading = true;
            this.loadDatas(() => infinite.complete());
        }
    }

    goDetailPage(item: any) {
        this.navCtrl.navigateForward('/example/detail?userId=' + item.id);
    }
}
