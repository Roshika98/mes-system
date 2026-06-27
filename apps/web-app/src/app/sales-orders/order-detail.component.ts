import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  materials = [
    { part: 'Galvanized Steel Sheet (2mm)', qty: '45 kg', unitCost: 4.50, total: 202.50 },
    { part: 'Compressor Unit Z-100', qty: '1 units', unitCost: 3200.00, total: 3200.00 },
    { part: 'Copper Tubing (15mm)', qty: '110 m', unitCost: 12.50, total: 1375.00, note: 'Scrap +10%' }
  ];

  labor = [
    { initials: 'J.D', name: 'John Doe', operation: 'Sheet Cutting', hours: 4.5, cost: 270.00 },
    { initials: 'S.S', name: 'Sarah Smith', operation: 'Assembly & Welding', hours: 8.0, cost: 560.00 },
    { initials: 'M.J', name: 'Mike Johnson', operation: 'QA Inspection', hours: 3.0, cost: 270.00 }
  ];
}
