import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

// Interfaces
interface VendorPaymentRequestDto {
  vendorId: number;
  amount: number;
  paymentPurpose: string;
  paymentMode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'CHEQUE';
}

interface VendorPaymentResponseDto {
  paymentId: number;
  vendorName: string;
  amount: number;
  paymentPurpose: string;
  paymentMode: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
  transactionId?: string;
  requestedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  documentPath?: string;
}

interface VendorResponseDto {
  vendorId: number;
  vendorName: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-vendor-payment-request',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="vendor-container">
      
      <!-- Message Alert -->
      <div *ngIf="message" 
           [class]="messageType === 'success' ? 'alert success' : 'alert error'">
        <span class="alert-icon">{{ messageType === 'success' ? '✓' : '⚠️' }}</span>
        <span>{{ message }}</span>
        <button (click)="clearMessage()" class="close-btn">✕</button>
      </div>

      <!-- Payment Request Form -->
      <div class="card">
        <div class="card-header">
          <h2>🧾 Submit Payment Request</h2>
          <p class="subtitle">Request payment from organization admin</p>
        </div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label for="vendor">Vendor <span class="required">*</span></label>
            <select id="vendor" [(ngModel)]="newPayment.vendorId" 
                    [disabled]="isLoading || vendors.length === 0"
                    class="form-control">
              <option value="">-- Select Vendor --</option>
              <option *ngFor="let v of vendors" [value]="v.vendorId">
                {{ v.vendorName }} ({{ v.email }})
              </option>
            </select>
            <small class="form-hint" *ngIf="vendors.length === 0">Loading vendors...</small>
          </div>

          <div class="form-group">
            <label for="amount">Amount <span class="required">*</span></label>
            <div class="input-prefix">
              <span class="prefix">₹</span>
              <input type="number" id="amount" [(ngModel)]="newPayment.amount" 
                     placeholder="0.00" min="1" step="0.01" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label for="paymentMode">Payment Mode <span class="required">*</span></label>
            <select id="paymentMode" [(ngModel)]="newPayment.paymentMode" class="form-control">
              <option value="NEFT">NEFT</option>
              <option value="RTGS">RTGS</option>
              <option value="IMPS">IMPS</option>
              <option value="UPI">UPI</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label for="purpose">Payment Purpose <span class="required">*</span></label>
            <textarea id="purpose" [(ngModel)]="newPayment.paymentPurpose" 
                      placeholder="Describe the purpose of this payment request..." 
                      rows="3" class="form-control"></textarea>
          </div>

          <div class="form-group full-width">
            <label for="document">Supporting Document</label>
            <div class="file-upload-area" 
                 [class.has-file]="selectedFile"
                 (click)="fileInput.click()">
              <input #fileInput type="file" 
                     (change)="onFileSelect($event)" 
                     accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                     style="display: none" />
              
              <div *ngIf="!selectedFile" class="upload-prompt">
                <span class="upload-icon">📎</span>
                <p>Click to attach document</p>
                <small>PDF, Image, or Document (Max 5MB)</small>
              </div>
              
              <div *ngIf="selectedFile" class="file-info">
                <span class="file-icon">📄</span>
                <div class="file-details">
                  <p class="file-name">{{ selectedFile.name }}</p>
                  <small class="file-size">{{ formatFileSize(selectedFile.size) }}</small>
                </div>
                <button (click)="removeFile($event)" class="remove-file-btn" type="button">✕</button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button (click)="resetForm()" class="btn btn-secondary" [disabled]="isSubmitting">
            Clear Form
          </button>
          <button (click)="submitPayment()" class="btn btn-primary" [disabled]="isSubmitting || !isFormValid()">
            <span *ngIf="!isSubmitting">Submit Request</span>
            <span *ngIf="isSubmitting" class="loading-text">
              <span class="spinner-small"></span> Submitting...
            </span>
          </button>
        </div>
      </div>

      <!-- Payment History -->
      <div class="card">
        <div class="card-header">
          <h2>💰 Payment Request History</h2>
          <p class="subtitle">Track your submitted payment requests</p>
        </div>

        <!-- Filter -->
        <div class="filter-section">
          <select [(ngModel)]="statusFilter" (change)="filterPayments()" class="filter-select">
            <option value="ALL">All Requests</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          
          <div class="stats-mini">
            <span class="stat-item">
              <strong>{{ filteredPayments.length }}</strong> requests
            </span>
            <span class="stat-item">
              <strong>₹{{ calculateTotal() | number:'1.2-2' }}</strong> total
            </span>
          </div>
        </div>

        <div *ngIf="isLoadingPayments" class="loading-state">
          <div class="spinner"></div>
          <p>Loading payment history...</p>
        </div>

        <div *ngIf="!isLoadingPayments && filteredPayments.length === 0" class="empty-state">
          <div class="empty-icon">💳</div>
          <h3>No Payment Requests</h3>
          <p>You haven't submitted any payment requests yet.</p>
        </div>

        <div *ngIf="!isLoadingPayments && filteredPayments.length > 0" class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Document</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filteredPayments" class="table-row">
                <td><span class="payment-id">#{{ p.paymentId }}</span></td>
                <td>{{ p.vendorName }}</td>
                <td class="amount-cell">₹{{ p.amount | number:'1.2-2' }}</td>
                <td>
                  <div class="purpose-cell" [title]="p.paymentPurpose">
                    {{ p.paymentPurpose | slice:0:40 }}{{ p.paymentPurpose.length > 40 ? '...' : '' }}
                  </div>
                </td>
                <td><span class="mode-badge">{{ p.paymentMode }}</span></td>
                <td>
                  <span class="status-badge" [ngClass]="getStatusClass(p.status)">
                    {{ p.status }}
                  </span>
                </td>
                <td>{{ p.requestedAt | date:'short' }}</td>
                <td class="text-center">
                  <a *ngIf="p.documentPath" 
                     [href]="getDocumentUrl(p.documentPath)" 
                     target="_blank" 
                     class="doc-link"
                     title="View document">
                    📎
                  </a>
                  <span *ngIf="!p.documentPath" class="na-text">—</span>
                </td>
                <td>
                  <button *ngIf="p.status === 'REJECTED' && p.rejectionReason" 
                          (click)="showRejectionModal(p)" 
                          class="btn-icon"
                          title="View rejection reason">
                    👁️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Rejection Reason Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>❌ Rejection Reason</h3>
            <button (click)="closeModal()" class="close-btn">✕</button>
          </div>
          <div class="modal-body">
            <div class="rejection-info">
              <p><strong>Payment ID:</strong> #{{ selectedPayment?.paymentId }}</p>
              <p><strong>Amount:</strong> ₹{{ selectedPayment?.amount | number:'1.2-2' }}</p>
              <p><strong>Purpose:</strong> {{ selectedPayment?.paymentPurpose }}</p>
            </div>
            <div class="rejection-reason">
              <strong>Reason:</strong>
              <p>{{ selectedPayment?.rejectionReason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vendor-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    .alert {
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .alert.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-icon {
      font-size: 20px;
    }

    .close-btn {
      margin-left: auto;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 30px;
      overflow: hidden;
    }

    .card-header {
      padding: 25px 30px;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-header h2 {
      margin: 0 0 5px 0;
      color: #2d3748;
      font-size: 24px;
      font-weight: 600;
    }

    .subtitle {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }

    .form-grid {
      padding: 30px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      color: #2d3748;
      font-weight: 500;
      font-size: 14px;
    }

    .required {
      color: #e53e3e;
    }

    .form-control {
      padding: 10px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }

    textarea.form-control {
      resize: vertical;
      font-family: inherit;
    }

    .input-prefix {
      position: relative;
    }

    .prefix {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #718096;
      font-weight: 600;
    }

    .input-prefix .form-control {
      padding-left: 32px;
    }

    .form-hint {
      color: #718096;
      font-size: 12px;
    }

    .file-upload-area {
      border: 2px dashed #cbd5e0;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .file-upload-area:hover {
      border-color: #667eea;
      background: #f7fafc;
    }

    .file-upload-area.has-file {
      border-style: solid;
      border-color: #48bb78;
      background: #f0fff4;
    }

    .upload-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .upload-icon {
      font-size: 48px;
    }

    .upload-prompt p {
      margin: 0;
      color: #2d3748;
      font-weight: 500;
    }

    .upload-prompt small {
      color: #718096;
      font-size: 12px;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .file-icon {
      font-size: 32px;
    }

    .file-details {
      flex: 1;
      text-align: left;
    }

    .file-name {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-weight: 500;
    }

    .file-size {
      color: #718096;
      font-size: 12px;
    }

    .remove-file-btn {
      background: #fed7d7;
      color: #742a2a;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }

    .remove-file-btn:hover {
      background: #fc8181;
      color: white;
    }

    .form-actions {
      padding: 0 30px 30px;
      display: flex;
      gap: 15px;
      justify-content: flex-end;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e2e8f0;
    }

    .loading-text {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .filter-section {
      padding: 20px 30px;
      background: #f7fafc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      cursor: pointer;
    }

    .stats-mini {
      display: flex;
      gap: 20px;
    }

    .stat-item {
      color: #718096;
      font-size: 14px;
    }

    .stat-item strong {
      color: #2d3748;
    }

    .loading-state {
      padding: 60px 20px;
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #667eea;
      border-radius: 50%;
      margin: 0 auto 15px;
      animation: spin 1s linear infinite;
    }

    .empty-state {
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 15px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #2d3748;
    }

    .empty-state p {
      margin: 0;
      color: #718096;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: #f7fafc;
    }

    .data-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #718096;
      border-bottom: 2px solid #e2e8f0;
    }

    .data-table td {
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
      color: #2d3748;
    }

    .table-row:hover {
      background: #f7fafc;
    }

    .payment-id {
      font-family: monospace;
      font-weight: 600;
      color: #667eea;
    }

    .amount-cell {
      font-weight: 700;
      color: #48bb78;
    }

    .purpose-cell {
      max-width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mode-badge {
      padding: 4px 10px;
      background: #edf2f7;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #4a5568;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      display: inline-block;
    }

    .status-badge.pending {
      background: #fef5e7;
      color: #f39c12;
    }

    .status-badge.approved {
      background: #e8f5e9;
      color: #4caf50;
    }

    .status-badge.processing {
      background: #e3f2fd;
      color: #2196f3;
    }

    .status-badge.completed {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-badge.rejected {
      background: #fed7d7;
      color: #742a2a;
    }

    .text-center {
      text-align: center;
    }

    .doc-link {
      font-size: 18px;
      text-decoration: none;
      transition: transform 0.2s;
      display: inline-block;
    }

    .doc-link:hover {
      transform: scale(1.2);
    }

    .na-text {
      color: #cbd5e0;
    }

    .btn-icon {
      background: #667eea;
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .modal-header {
      padding: 20px 25px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 18px;
    }

    .modal-body {
      padding: 25px;
    }

    .rejection-info {
      background: #f7fafc;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .rejection-info p {
      margin: 8px 0;
      color: #2d3748;
    }

    .rejection-reason {
      padding: 15px;
      background: #fed7d7;
      border-radius: 8px;
      border-left: 4px solid #742a2a;
    }

    .rejection-reason strong {
      display: block;
      margin-bottom: 10px;
      color: #742a2a;
    }

    .rejection-reason p {
      margin: 0;
      color: #2d3748;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .filter-section {
        flex-direction: column;
        align-items: stretch;
      }

      .stats-mini {
        justify-content: space-between;
      }

      .data-table {
        font-size: 12px;
      }

      .data-table th,
      .data-table td {
        padding: 10px 8px;
      }
    }
  `]
})
export class VendorPaymentRequestComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api/vendors';
  
  // Assuming orgAdminId is 1 (in production, get from auth service)
  orgAdminId = 1;
  orgId = 1;

  vendors: VendorResponseDto[] = [];
  payments: VendorPaymentResponseDto[] = [];
  filteredPayments: VendorPaymentResponseDto[] = [];

  newPayment: VendorPaymentRequestDto = {
    vendorId: 0,
    amount: 0,
    paymentPurpose: '',
    paymentMode: 'NEFT'
  };

  selectedFile: File | null = null;
  message = '';
  messageType: 'success' | 'error' = 'success';
  isSubmitting = false;
  isLoading = false;
  isLoadingPayments = false;
  statusFilter = 'ALL';
  showModal = false;
  selectedPayment: VendorPaymentResponseDto | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVendors();
    this.loadPayments();
  }

  loadVendors(): void {
    this.isLoading = true;
    this.http.get<VendorResponseDto[]>(`${this.apiUrl}/organization/${this.orgId}`)
      .pipe(catchError(err => {
        console.error('Error loading vendors', err);
        this.showMessage('Failed to load vendors', 'error');
        return of([]);
      }))
      .subscribe(data => {
        this.vendors = data.filter(v => v.status === 'ACTIVE');
        this.isLoading = false;
      });
  }

  loadPayments(): void {
    this.isLoadingPayments = true;
    this.http.get<VendorPaymentResponseDto[]>(`${this.apiUrl}/payments/${this.orgId}`)
      .pipe(catchError(err => {
        console.error('Error loading payments', err);
        return of([]);
      }))
      .subscribe(data => {
        this.payments = data;
        this.filterPayments();
        this.isLoadingPayments = false;
      });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('File size must be less than 5MB', 'error');
        return;
      }
      
      this.selectedFile = file;
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  isFormValid(): boolean {
    return this.newPayment.vendorId > 0 &&
           this.newPayment.amount > 0 &&
           this.newPayment.paymentPurpose.trim() !== '' &&
           this.newPayment.paymentMode !== null;
  }

  submitPayment(): void {
    if (!this.isFormValid()) {
      this.showMessage('Please fill in all required fields', 'error');
      return;
    }

    this.isSubmitting = true;
    
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.newPayment));
    
    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }

    this.http.post<VendorPaymentResponseDto>(
      `${this.apiUrl}/${this.orgAdminId}/request-payment`,
      formData
    ).subscribe({
      next: (response) => {
        this.showMessage('Payment request submitted successfully!', 'success');
        this.payments.unshift(response);
        this.filterPayments();
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error submitting payment', err);
        this.showMessage(
          err.error?.message || 'Failed to submit payment request. Please try again.',
          'error'
        );
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.newPayment = {
      vendorId: 0,
      amount: 0,
      paymentPurpose: '',
      paymentMode: 'NEFT'
    };
    this.selectedFile = null;
  }

  filterPayments(): void {
    if (this.statusFilter === 'ALL') {
      this.filteredPayments = [...this.payments];
    } else {
      this.filteredPayments = this.payments.filter(
        p => p.status === this.statusFilter
      );
    }
  }

  calculateTotal(): number {
    return this.filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getDocumentUrl(documentPath: string): string {
    return `http://localhost:8080${documentPath}`;
  }

  showRejectionModal(payment: VendorPaymentResponseDto): void {
    this.selectedPayment = payment;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPayment = null;
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    
    // Auto-clear message after 5 seconds
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  clearMessage(): void {
    this.message = '';
  }
}