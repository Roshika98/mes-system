import { Route } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesOrdersComponent } from './sales-orders/sales-orders.component';
import { OrderDetailComponent } from './sales-orders/order-detail.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'sales-orders', component: SalesOrdersComponent },
      { path: 'sales-orders/SO-1092', component: OrderDetailComponent },
      { path: 'sales-orders/:id', component: OrderDetailComponent },
      { path: 'inventory', loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.inventoryRoutes) }
    ]
  },
  { path: '**', redirectTo: '' }
];
