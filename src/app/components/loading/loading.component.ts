import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="loading-overlay" *ngIf="loadingService.isLoading$ | async">
      <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    :host ::ng-deep .p-progress-spinner-circle {
      stroke: #10B981; /* Green color to match Nexa standard */
      animation: p-progress-spinner-dash 1.5s ease-in-out infinite;
    }
  `]
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
