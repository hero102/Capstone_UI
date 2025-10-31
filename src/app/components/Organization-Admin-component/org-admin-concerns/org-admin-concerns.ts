import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-org-admin-concerns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>📢 Employee Concerns</h2>

      <!-- Table View -->
      <table *ngIf="concerns.length > 0; else noData" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Raised At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of concerns">
            <td>{{ c.concernId }}</td>
            <td>{{ c.employeeName }}</td>
            <td>{{ c.subject }}</td>
            <td [ngClass]="c.priority.toLowerCase()">{{ c.priority }}</td>
            <td [ngClass]="getStatusClass(c.status)">{{ c.status }}</td>
            <td>{{ c.raisedAt | date: 'medium' }}</td>
            <td>
              <button (click)="viewConcern(c)" class="btn-view">View</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No Data Message -->
      <ng-template #noData>
        <p>No concerns found for your organization.</p>
      </ng-template>

      <!-- Concern Detail Section -->
      <div *ngIf="selectedConcern" class="detail">
        <h3>Concern Details</h3>
        <p><strong>Employee:</strong> {{ selectedConcern.employeeName }}</p>
        <p><strong>Subject:</strong> {{ selectedConcern.subject }}</p>
        <p><strong>Description:</strong> {{ selectedConcern.description }}</p>
        <p><strong>Priority:</strong> {{ selectedConcern.priority }}</p>
        <p><strong>Status:</strong> {{ selectedConcern.status }}</p>

        <div *ngIf="selectedConcern.documentUrl">
          <a [href]="selectedConcern.documentUrl" target="_blank">📎 View Attachment</a>
        </div>

        <hr />

        <h4>Reply to Concern</h4>
        <textarea
          [(ngModel)]="replyMessage"
          placeholder="Enter your reply..."
          rows="3">
        </textarea>

        <div class="action-buttons">
          <button (click)="sendReply('RESOLVE')" class="btn-reply">
            ✅ Resolve Directly
          </button>
          <button (click)="sendReply('FORWARD_TO_BANK')" class="btn-forward">
            📤 Forward to Bank
          </button>
          <button (click)="closeDetail()" class="btn-close">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .table th, .table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    .table th {
      background-color: #667eea;
      color: white;
    }

    .btn-view {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-view:hover {
      background: #5a67d8;
    }

    .detail {
      background: #f9fafb;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    textarea {
      width: 100%;
      margin-top: 10px;
      border-radius: 6px;
      padding: 8px;
      border: 1px solid #ccc;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .btn-reply {
      background-color: #38a169;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-reply:hover {
      background-color: #2f855a;
    }

    .btn-forward {
      background-color: #f6ad55;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-forward:hover {
      background-color: #ed8936;
    }

    .btn-close {
      background-color: #718096;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-close:hover {
      background-color: #4a5568;
    }

    .high { color: red; font-weight: bold; }
    .medium { color: orange; font-weight: bold; }
    .low { color: green; font-weight: bold; }

    .status-resolved { color: green; font-weight: bold; }
    .status-forwarded { color: orange; font-weight: bold; }
    .status-open { color: blue; font-weight: bold; }
  `]
})
export class OrgAdminConcernsComponent implements OnInit {
  concerns: any[] = [];
  selectedConcern: any = null;
  replyMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const orgAdmin = JSON.parse(localStorage.getItem('orgAdmin') || '{}');
    if (orgAdmin && orgAdmin.orgAdminId) {
      this.authService.getOrganizationConcerns(orgAdmin.orgAdminId).subscribe({
        next: (data) => {
          console.log('✅ Loaded concerns:', data);
          this.concerns = data;
        },
        error: (err) => console.error('❌ Error loading concerns:', err)
      });
    }
  }

  viewConcern(c: any) {
    this.selectedConcern = c;
  }

  closeDetail() {
    this.selectedConcern = null;
    this.replyMessage = '';
  }

  // ✅ Updated sendReply with support for Resolve & Forward
  sendReply(action: string) {
    if (!this.replyMessage.trim()) {
      alert('Please enter a reply message.');
      return;
    }

    const replyData = {
      concernId: this.selectedConcern.concernId,
      replyBy: 'ORGANIZATION_ADMIN',
      replyMessage: this.replyMessage,
      newStatus: action // either "RESOLVE" or "FORWARD_TO_BANK"
    };

    this.authService.replyToConcern(replyData).subscribe({
      next: (res) => {
        alert('✅ Reply processed successfully!');
        this.closeDetail();
        this.ngOnInit(); // refresh the concern list
      },
      error: (err) => {
        console.error('❌ Error sending reply:', err);
        alert('Error sending reply: ' + (err.error?.message || err.message));
      }
    });
  }

  // ✅ Helper: Status color
  getStatusClass(status: string): string {
    if (status.includes('RESOLVED')) return 'status-resolved';
    if (status.includes('FORWARDED')) return 'status-forwarded';
    if (status.includes('OPEN')) return 'status-open';
    return '';
  }
}
