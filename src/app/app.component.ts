import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    backButtonPressed = false;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private toastCtrl: ToastController,
        private auth: AuthService,
    ) {
        this.initializeApp();
        this.loadData();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // 注册返回事件
            document.addEventListener('backbutton', e => {
                const url = window.location.href;
                const exitIndexs = ['tabs', 'login'];
                if (~exitIndexs.findIndex(index => url.indexOf(index) >= 0)) {
                    this.showExit(e);
                } else {
                    e.preventDefault();
                }
            }, true);
        });
    }

    /**
     * 载入必须的数据
     */
    loadData() {
        this.auth.loadUserDeail();
    }

    showExit(e: Event) {
        if (!this.backButtonPressed) {
            this.toastCtrl.create({
                message: '再按一次退出应用',
                duration: 2000,
                showCloseButton: true,
                closeButtonText: '关闭'
            }).then(t => t.present());
            this.backButtonPressed = true;
            setTimeout(() => this.backButtonPressed = false, 2000);
            e.preventDefault();
        } else {
            navigator['app'].exitApp();
        }
    }
}
