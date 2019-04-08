import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { HomePage } from './home/home.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { CenterPage } from './center/center.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'home', component: HomePage },
      { path: 'dashboard', component: DashboardPage },
      { path: 'center', component: CenterPage }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
