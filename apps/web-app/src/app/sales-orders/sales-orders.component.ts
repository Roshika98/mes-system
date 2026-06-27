import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  totalCost: number;
  status: 'Production' | 'Pending' | 'Shipped';
  materialCost: number;
  laborCost: number;
}

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule],
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.scss'
})
export class SalesOrdersComponent {
  orders: SalesOrder[] = [
    { id: 'SO-1092', customer: 'Acme Corp', date: 'Oct 12, 2026', materialCost: 4500.00, laborCost: 1200.50, totalCost: 5700.50, status: 'Production' },
    { id: 'SO-1093', customer: 'Globex Industries', date: 'Oct 13, 2026', materialCost: 12000.00, laborCost: 4500.00, totalCost: 16500.00, status: 'Pending' },
    { id: 'SO-1094', customer: 'Initech', date: 'Oct 10, 2026', materialCost: 890.00, laborCost: 400.00, totalCost: 1290.00, status: 'Shipped' },
    { id: 'SO-1095', customer: 'Soylent Corp', date: 'Oct 14, 2026', materialCost: 34500.00, laborCost: 12000.00, totalCost: 46500.00, status: 'Production' },
  ];
}
