import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { RouterModule } from '@angular/router';

interface NavSection {
  label: string;
  icon: string;
  expanded: boolean;
  items: NavItem[];
}

interface NavItem {
  label: string;
  routerLink: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, DrawerModule, RouterModule],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss'
})
export class AppSidebarComponent {
  @Input() mobileMenuVisible = false;
  @Output() mobileMenuVisibleChange = new EventEmitter<boolean>();

  isMobileView = false;

  navSections: NavSection[] = [
    {
      label: 'Inventory',
      icon: 'pi pi-box',
      expanded: true,
      items: [
        { label: 'Dashboard', routerLink: '/inventory/dashboard' },
        { label: 'Products', routerLink: '/inventory/products' }
      ]
    },
    {
      label: 'Manufacturing',
      icon: 'pi pi-cog',
      expanded: false,
      items: [
        { label: 'Work Orders', routerLink: '/manufacturing/work-orders' },
        { label: 'Routings', routerLink: '/manufacturing/routings' }
      ]
    },
    {
      label: 'Sales',
      icon: 'pi pi-shopping-cart',
      expanded: false,
      items: [
        { label: 'Orders', routerLink: '/sales/orders' },
        { label: 'Customers', routerLink: '/sales/customers' }
      ]
    }
  ];

  @HostListener('window:resize')
  onResize() {
    this.checkViewMode();
  }

  constructor() {
    this.checkViewMode();
  }

  checkViewMode() {
    this.isMobileView = window.innerWidth < 992;
  }

  toggleSection(section: NavSection) {
    section.expanded = !section.expanded;
  }
}
