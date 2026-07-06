import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../ui/page-header/page-header.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ProductVariant } from '@mes-system/shared-types';

interface ProductRow extends Partial<ProductVariant> {
  name: string;
  category: string;
  inStock: number;
  status: string;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule, 
    PageHeaderComponent, 
    TableModule, 
    ButtonModule, 
    IconFieldModule, 
    InputIconModule, 
    InputTextModule,
    TagModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  products: ProductRow[] = [];

  ngOnInit() {
    this.products = [
      {
        id: '1',
        sku: 'PRD-001',
        name: 'Industrial Valve A',
        category: 'Valves',
        price: 120.5,
        inStock: 450,
        status: 'In Stock',
      },
      {
        id: '2',
        sku: 'PRD-002',
        name: 'Steel Pipe 20ft',
        category: 'Pipes',
        price: 85.0,
        inStock: 12,
        status: 'Low Stock',
      },
      {
        id: '3',
        sku: 'PRD-003',
        name: 'Pressure Gauge',
        category: 'Instruments',
        price: 45.25,
        inStock: 0,
        status: 'Out of Stock',
      },
      {
        id: '4',
        sku: 'PRD-004',
        name: 'Sealing Ring (Pack of 10)',
        category: 'Consumables',
        price: 15.0,
        inStock: 1200,
        status: 'In Stock',
      },
      {
        id: '5',
        sku: 'PRD-005',
        name: 'Hydraulic Pump C',
        category: 'Pumps',
        price: 850.0,
        inStock: 5,
        status: 'Low Stock',
      },
    ];
  }

  getSeverity(status: string): Extract<any, string> | 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warn';
      case 'Out of Stock': return 'danger';
      default: return 'info';
    }
  }
}
