import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../ui/page-header/page-header.component';
import { StatCardComponent } from '../../../ui/stat-card/stat-card.component';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent],
  templateUrl: './inventory-dashboard.component.html',
  styleUrl: './inventory-dashboard.component.scss'
})
export class InventoryDashboardComponent {
}
