import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { HomePage } from './home/home.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { CenterPage } from './center/center.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage, HomePage, DashboardPage, CenterPage]
})
export class TabsPageModule { }
