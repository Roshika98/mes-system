import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

interface NavItem {
    label: string;
    icon: string;
    route: string;
    exact?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, DrawerModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  isDarkMode = false;
  drawerVisible = false;
  isMobileView = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/', exact: true },
    { label: 'Sales Orders', icon: 'pi pi-shopping-cart', route: '/sales-orders' },
    { label: 'Work Orders', icon: 'pi pi-hammer', route: '/work-orders' },
    { label: 'Bill of Materials', icon: 'pi pi-sitemap', route: '/bom' },
    { label: 'Inventory', icon: 'pi pi-box', route: '/inventory' }
  ];

  ngOnInit() {
    this.checkViewport();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView.set(window.innerWidth < 768);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.querySelector('html');
    if (this.isDarkMode) {
      htmlElement?.classList.add('app-dark');
    } else {
      htmlElement?.classList.remove('app-dark');
    }
  }
}
