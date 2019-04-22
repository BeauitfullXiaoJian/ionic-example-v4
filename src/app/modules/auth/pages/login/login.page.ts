import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { RequestService } from 'src/app/services/request';
import { GlobalService } from 'src/app/services/global.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage {

    // 登入表单数据
    user = {
        account: 'admin',
        password: 'admin'
    };

    constructor(
        public loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private request: RequestService,
        private global: GlobalService,
        private auth: AuthService,
    ) { }

    /**
     * 登入方法
     */
    async doLogin() {

        // 开启加载动画
        const loader = await this.loadingCtrl.create({ message: '正在登入...' });
        loader.present();

        // 发送登入请求
        this.request.post('/managerapi/signin', this.user).subscribe({
            next: (res) => {
                const datas = res.datas;
                this.global.setValuesToStorage({
                    'ng-params-one': datas.id,
                    'ng-params-two': datas.token,
                    'ng-params-three': datas.platform,
                });
                this.auth.loadUserDeail();
                // 导航到首页
                this.navCtrl.navigateRoot('/');
            },
            complete: () => loader.dismiss()
        });
    }

}
