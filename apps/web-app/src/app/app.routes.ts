import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesOrdersComponent } from './sales-orders/sales-orders.component';
import { OrderDetailComponent } from './sales-orders/order-detail.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'sales-orders', component: SalesOrdersComponent },
      { path: 'sales-orders/SO-1092', component: OrderDetailComponent },
      { path: 'sales-orders/:id', component: OrderDetailComponent }, // Dynamic route for future
    ]
  },
  { path: '**', redirectTo: '' }
];
