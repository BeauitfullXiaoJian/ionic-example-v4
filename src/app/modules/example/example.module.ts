import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DetailPage } from './pages/detail.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            { path: 'detail', component: DetailPage }
        ])
    ],
    declarations: [DetailPage]
})
export class ExampleModule { }
