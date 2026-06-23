import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="placeholder-content">
        <span class="placeholder-icon">⚙️</span>
        <h1>System Settings</h1>
        <p>Configure platform rules and policies</p>
        <div class="features-list">
          <div class="feature">✓ Commission rates</div>
          <div class="feature">✓ Cancellation policies</div>
          <div class="feature">✓ Booking rules</div>
          <div class="feature">✓ Email templates</div>
        </div>
        <span class="coming-soon">Coming Soon</span>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .placeholder-content {
      text-align: center;
      max-width: 600px;

      .placeholder-icon {
        font-size: 5rem;
        display: block;
        margin-bottom: 1.5rem;
        opacity: 0.5;
      }

      h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
      }

      p {
        font-size: 1.125rem;
        color: #6b7280;
        margin: 0 0 2rem 0;
      }

      .features-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;

        .feature {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #4b5563;
        }
      }

      .coming-soon {
        display: inline-block;
        padding: 0.75rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 24px;
        font-weight: 600;
        font-size: 1rem;
      }
    }
  `]
})
export class SettingsComponent {}
