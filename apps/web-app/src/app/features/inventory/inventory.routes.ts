import { Route } from '@angular/router';
import { InventoryDashboardComponent } from './dashboard/inventory-dashboard.component';
import { ProductsListComponent } from './products/products-list.component';

export const inventoryRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: InventoryDashboardComponent },
  { path: 'products', component: ProductsListComponent }
];
