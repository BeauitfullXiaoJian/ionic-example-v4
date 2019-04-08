/**
 * 统一响应拦截器
 * @author cool1024
 * @date   2018-06-21
 */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, TimeoutError, of } from 'rxjs';
import { HttpConfig, INTERCEPTOR_MESSAGES } from '../configs/http.config';
import { catchError, map, timeout } from 'rxjs/operators';
import { ApiData, ApiResponse } from './api-data';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(private toastCtrl: ToastController, private router: Router) { }

    showToast(code: number, message: string) {
        console.log('code=>', code);
        this.toastCtrl.create({
            message,
            duration: HttpConfig.TOAST_ERROR_TIME,
            showCloseButton: true,
            closeButtonText: '关闭'
        }).then(toast => toast.present());
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // 获取请求参数
        const httpParams = request.params;

        // 获取请求超时时间
        let maxRequestTime = HttpConfig.TIME_OUT;

        // 允许重设请求超时，如果请求参数中出现了关键参数REQUEST_TIME_OUT
        if (httpParams.has('REQUEST_TIME_OUT')) {
            maxRequestTime = Number(httpParams.get('REQUEST_TIME_OUT'));
        }

        return next.handle(request).pipe(
            timeout(maxRequestTime),
            catchError(error => this.errorHandle(error)),
            map(res => this.responseHandle(res, request)),
        );
    }

    /**
     * 错误处理方法
     * @param error 错误数据对象
     */
    errorHandle(error: any): Observable<HttpResponse<string>> {

        let errorMessage = '';
        let errorTitle = '';

        if (error instanceof HttpErrorResponse) {

            const code = error.status;
            errorTitle = `${code} : ${error.statusText}`;

            // 需要跳转的状态码
            if (code === 401) {
                this.router.navigateByUrl('/auth/login');
            } else if (code === 403) {
                this.router.navigateByUrl('/auth/login');
            }

            // 获取状态码对应提示消息
            if (code === 422) {
                errorMessage = new ApiData(error.error.error, error.error.message, error.error.datas).messageStr;
            } else {
                errorMessage = INTERCEPTOR_MESSAGES[code] || HttpConfig.HTTP_ERRORS.RESPONSE_CONTENT_ERROR;
            }

            // 显示提示消息
            this.showToast(code, errorMessage);

        } else if (error instanceof TimeoutError) {
            this.showToast(0, '网络超时');
        } else {
            [errorMessage, errorTitle] = HttpConfig.HTTP_ERRORS.OTHER_ERROR;
            this.showToast(0, errorMessage);
        }

        return of<HttpResponse<string>>(new HttpResponse<string>({
            status: 200,
            body: (new ApiData(false, errorMessage).toJsonString())
        }));
    }

    /**
     * 响应数据预处理
     * @param res 响应数据
     * @param request 请求对象
     */
    responseHandle(res: any, request: HttpRequest<any>) {
        if (res instanceof HttpResponse) {
            if (res.body !== null && ApiResponse.isApiResponse(res.body)) {
                const apiData = new ApiData(res.body.result, res.body.message, res.body.datas || res.body.data);
                if (apiData.result === false) {
                    this.showToast(200, apiData.messageStr);
                }
                res = res.clone<ApiData>({ body: apiData });

            } else if (request.responseType !== 'text') {
                res = res.clone<ApiData>({ body: new ApiData(false, HttpConfig.HTTP_ERRORS.API_DATA_ERROR) });
            }
        }
        return res;
    }
}