import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.scss'
})
export class AppTopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  isDarkMode = false;

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
