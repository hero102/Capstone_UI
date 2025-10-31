// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { catchError, forkJoin, of } from 'rxjs';

// // 🧩 Interfaces matching Spring Backend DTOs
// interface VendorResponseDto {
//   vendorId: number;
//   vendorName: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
//   gstNumber: string;
//   panNumber: string;
//   status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
//   accountNumber?: string;
//   ifscCode?: string;
//   bankName?: string;
//   createdAt?: string;
// }

// interface VendorBankAccountResponseDto {
//   accountId: number;
//   vendorName: string;
//   bankName: string;
//   branch: string;
//   ifscCode: string;
//   accountNumber: string;
//   balance: number;
//   status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
// }

// interface VendorPaymentResponseDto {
//   paymentId: number;
//   vendorName: string;
//   amount: number;
//   paymentPurpose: string;
//   paymentMode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'CHEQUE';
//   status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
//   transactionId?: string;
//   requestedAt?: string;
//   approvedAt?: string;
//   rejectionReason?: string;
//   documentPath?: string;
// }

// interface VendorTransactionDto {
//   transactionId: string;
//   vendorName: string;
//   amount: number;
//   paymentPurpose: string;
//   paymentMode: string;
//   transactionDate: string;
//   status: string;
//   utrNumber?: string;
// }

// interface DashboardStats {
//   totalPaymentsReceived: number;
//   pendingPayments: number;
//   completedPayments: number;
//   rejectedPayments: number;
//   totalAmount: number;
//   pendingAmount: number;
//   completedAmount: number;
// }

// @Component({
//   selector: 'app-vendor-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
//   template: `
//     <div class="dashboard-container">
//       <!-- Header -->
//       <header class="dashboard-header">
//         <div class="header-content">
//           <h1>🏦 Vendor Payment Portal</h1>
//           <div class="vendor-info" *ngIf="vendor">
//             <span class="vendor-name">{{ vendor.vendorName }}</span>
//             <span class="vendor-id">ID: {{ vendorId }}</span>
//             <span class="status-badge" [class.active]="vendor.status === 'ACTIVE'" 
//                   [class.inactive]="vendor.status !== 'ACTIVE'">
//               {{ vendor.status }}
//             </span>
//           </div>
//         </div>
//       </header>

//       <!-- Loading State -->
//       <div *ngIf="isLoading" class="loading-overlay">
//         <div class="spinner"></div>
//         <p>Loading your data...</p>
//       </div>

//       <!-- Error Message -->
//       <div *ngIf="errorMessage" class="error-banner">
//         <span class="error-icon">⚠️</span>
//         <span>{{ errorMessage }}</span>
//         <button (click)="errorMessage = ''" class="close-btn">✕</button>
//       </div>

//       <!-- Main Content -->
//       <div class="main-content" *ngIf="!isLoading">
        
//         <!-- Navigation Tabs -->
//         <nav class="tab-navigation">
//           <button *ngFor="let tab of tabs"
//                   (click)="activeTab = tab.id"
//                   [class.active]="activeTab === tab.id"
//                   class="tab-button">
//             <span class="tab-icon">{{ tab.icon }}</span>
//             <span class="tab-label">{{ tab.label }}</span>
//           </button>
//         </nav>

//         <!-- Dashboard Overview -->
//         <section *ngIf="activeTab === 'dashboard'" class="content-section">
//           <h2 class="section-title">📊 Dashboard Overview</h2>
          
//           <div class="stats-grid">
//             <div class="stat-card primary">
//               <div class="stat-icon">💰</div>
//               <div class="stat-content">
//                 <h3>Total Received</h3>
//                 <p class="stat-value">₹{{ stats.totalAmount | number:'1.2-2' }}</p>
//                 <span class="stat-label">{{ stats.totalPaymentsReceived }} payments</span>
//               </div>
//             </div>

//             <div class="stat-card warning">
//               <div class="stat-icon">⏳</div>
//               <div class="stat-content">
//                 <h3>Pending</h3>
//                 <p class="stat-value">₹{{ stats.pendingAmount | number:'1.2-2' }}</p>
//                 <span class="stat-label">{{ stats.pendingPayments }} requests</span>
//               </div>
//             </div>

//             <div class="stat-card success">
//               <div class="stat-icon">✅</div>
//               <div class="stat-content">
//                 <h3>Completed</h3>
//                 <p class="stat-value">₹{{ stats.completedAmount | number:'1.2-2' }}</p>
//                 <span class="stat-label">{{ stats.completedPayments }} transactions</span>
//               </div>
//             </div>

//             <div class="stat-card danger">
//               <div class="stat-icon">❌</div>
//               <div class="stat-content">
//                 <h3>Rejected</h3>
//                 <p class="stat-value">{{ stats.rejectedPayments }}</p>
//                 <span class="stat-label">Payment requests</span>
//               </div>
//             </div>
//           </div>

//           <!-- Recent Activity -->
//           <div class="recent-activity">
//             <h3>Recent Transactions</h3>
//             <div class="activity-list">
//               <div *ngFor="let txn of transactions.slice(0, 5)" class="activity-item">
//                 <div class="activity-icon">💳</div>
//                 <div class="activity-details">
//                   <p class="activity-title">{{ txn.paymentPurpose }}</p>
//                   <p class="activity-meta">{{ txn.transactionDate | date:'medium' }} • {{ txn.paymentMode }}</p>
//                 </div>
//                 <div class="activity-amount">₹{{ txn.amount | number:'1.2-2' }}</div>
//               </div>
//               <div *ngIf="transactions.length === 0" class="empty-state">
//                 <p>No recent transactions</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <!-- Vendor Profile -->
//         <section *ngIf="activeTab === 'profile'" class="content-section">
//           <h2 class="section-title">👤 Vendor Profile</h2>
          
//           <div *ngIf="vendor" class="profile-card">
//             <div class="profile-section">
//               <h3>Basic Information</h3>
//               <div class="info-grid">
//                 <div class="info-item">
//                   <label>Vendor Name</label>
//                   <p>{{ vendor.vendorName }}</p>
//                 </div>
//                 <div class="info-item">
//                   <label>Vendor ID</label>
//                   <p>{{ vendor.vendorId }}</p>
//                 </div>
//                 <div class="info-item">
//                   <label>Email Address</label>
//                   <p>{{ vendor.email }}</p>
//                 </div>
//                 <div class="info-item">
//                   <label>Phone Number</label>
//                   <p>{{ vendor.phoneNumber }}</p>
//                 </div>
//                 <div class="info-item full-width">
//                   <label>Business Address</label>
//                   <p>{{ vendor.address }}</p>
//                 </div>
//               </div>
//             </div>

//             <div class="profile-section">
//               <h3>Tax Information</h3>
//               <div class="info-grid">
//                 <div class="info-item">
//                   <label>GST Number</label>
//                   <p>{{ vendor.gstNumber }}</p>
//                 </div>
//                 <div class="info-item">
//                   <label>PAN Number</label>
//                   <p>{{ vendor.panNumber }}</p>
//                 </div>
//               </div>
//             </div>

//             <div class="profile-section">
//               <h3>Account Status</h3>
//               <div class="info-grid">
//                 <div class="info-item">
//                   <label>Status</label>
//                   <p>
//                     <span class="status-badge" [class.active]="vendor.status === 'ACTIVE'"
//                           [class.inactive]="vendor.status !== 'ACTIVE'">
//                       {{ vendor.status }}
//                     </span>
//                   </p>
//                 </div>
//                 <div class="info-item">
//                   <label>Registered On</label>
//                   <p>{{ vendor.createdAt | date:'fullDate' }}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <!-- Bank Account Details -->
//         <section *ngIf="activeTab === 'bankAccount'" class="content-section">
//           <h2 class="section-title">🏦 Bank Account Details</h2>
          
//           <div *ngIf="bankAccount" class="bank-card">
//             <div class="bank-header">
//               <div class="bank-logo">🏦</div>
//               <div class="bank-info">
//                 <h3>{{ bankAccount.bankName }}</h3>
//                 <p>{{ bankAccount.branch }}</p>
//               </div>
//               <span class="account-status" [class.active]="bankAccount.status === 'ACTIVE'">
//                 {{ bankAccount.status }}
//               </span>
//             </div>

//             <div class="bank-details">
//               <div class="detail-row">
//                 <label>Account Holder Name</label>
//                 <p>{{ bankAccount.vendorName }}</p>
//               </div>
//               <div class="detail-row">
//                 <label>Account Number</label>
//                 <p class="masked-account">{{ maskAccountNumber(bankAccount.accountNumber) }}</p>
//               </div>
//               <div class="detail-row">
//                 <label>IFSC Code</label>
//                 <p>{{ bankAccount.ifscCode }}</p>
//               </div>
//               <div class="detail-row highlight">
//                 <label>Current Balance</label>
//                 <p class="balance-amount">₹{{ bankAccount.balance | number:'1.2-2' }}</p>
//               </div>
//             </div>
//           </div>

//           <div *ngIf="!bankAccount && !isLoading" class="empty-state-card">
//             <div class="empty-icon">🏦</div>
//             <h3>No Bank Account Linked</h3>
//             <p>Please contact your organization administrator to link your bank account for receiving payments.</p>
//           </div>
//         </section>

//         <!-- Payment Requests -->
//         <section *ngIf="activeTab === 'payments'" class="content-section">
//           <h2 class="section-title">💳 Payment Requests</h2>
          
//           <!-- Filter Controls -->
//           <div class="filter-bar">
//             <select [(ngModel)]="paymentFilter" (change)="filterPayments()" class="filter-select">
//               <option value="ALL">All Payments</option>
//               <option value="PENDING">Pending</option>
//               <option value="APPROVED">Approved</option>
//               <option value="PROCESSING">Processing</option>
//               <option value="COMPLETED">Completed</option>
//               <option value="REJECTED">Rejected</option>
//             </select>
//             <div class="search-box">
//               <input type="text" [(ngModel)]="searchTerm" (input)="filterPayments()" 
//                      placeholder="Search by purpose or transaction ID..." class="search-input">
//             </div>
//           </div>

//           <div class="table-container">
//             <table class="data-table">
//               <thead>
//                 <tr>
//                   <th>Payment ID</th>
//                   <th>Purpose</th>
//                   <th>Amount</th>
//                   <th>Payment Mode</th>
//                   <th>Status</th>
//                   <th>Transaction ID</th>
//                   <th>Requested Date</th>
//                   <th>Approved Date</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr *ngFor="let payment of filteredPayments" class="table-row">
//                   <td>{{ payment.paymentId }}</td>
//                   <td>
//                     <div class="payment-purpose">
//                       <span>{{ payment.paymentPurpose }}</span>
//                       <span *ngIf="payment.documentPath" class="doc-badge" title="Document attached">📎</span>
//                     </div>
//                   </td>
//                   <td class="amount-cell">₹{{ payment.amount | number:'1.2-2' }}</td>
//                   <td><span class="mode-badge">{{ payment.paymentMode }}</span></td>
//                   <td>
//                     <span class="status-pill" [ngClass]="getStatusClass(payment.status)">
//                       {{ payment.status }}
//                     </span>
//                   </td>
//                   <td>
//                     <span *ngIf="payment.transactionId" class="txn-id">{{ payment.transactionId }}</span>
//                     <span *ngIf="!payment.transactionId" class="na-text">—</span>
//                   </td>
//                   <td>{{ payment.requestedAt | date:'short' }}</td>
//                   <td>
//                     <span *ngIf="payment.approvedAt">{{ payment.approvedAt | date:'short' }}</span>
//                     <span *ngIf="!payment.approvedAt" class="na-text">—</span>
//                   </td>
//                   <td>
//                     <button *ngIf="payment.status === 'REJECTED' && payment.rejectionReason" 
//                             (click)="showRejectionReason(payment)" 
//                             class="action-btn view-btn" 
//                             title="View rejection reason">
//                       👁️
//                     </button>
//                   </td>
//                 </tr>
//                 <tr *ngIf="filteredPayments.length === 0">
//                   <td colspan="9" class="empty-row">
//                     <div class="empty-state">
//                       <p>No payment requests found</p>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <!-- Transaction History -->
//         <section *ngIf="activeTab === 'transactions'" class="content-section">
//           <h2 class="section-title">📜 Transaction History</h2>
          
//           <!-- Summary Cards -->
//           <div class="transaction-summary">
//             <div class="summary-item">
//               <span class="summary-label">Total Transactions</span>
//               <span class="summary-value">{{ transactions.length }}</span>
//             </div>
//             <div class="summary-item">
//               <span class="summary-label">Total Amount</span>
//               <span class="summary-value">₹{{ calculateTotalTransactionAmount() | number:'1.2-2' }}</span>
//             </div>
//           </div>

//           <div class="table-container">
//             <table class="data-table">
//               <thead>
//                 <tr>
//                   <th>Transaction ID</th>
//                   <th>UTR Number</th>
//                   <th>Amount</th>
//                   <th>Purpose</th>
//                   <th>Payment Mode</th>
//                   <th>Transaction Date</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr *ngFor="let txn of transactions" class="table-row">
//                   <td><span class="txn-id">{{ txn.transactionId }}</span></td>
//                   <td>
//                     <span *ngIf="txn.utrNumber" class="utr-number">{{ txn.utrNumber }}</span>
//                     <span *ngIf="!txn.utrNumber" class="na-text">—</span>
//                   </td>
//                   <td class="amount-cell success">₹{{ txn.amount | number:'1.2-2' }}</td>
//                   <td>{{ txn.paymentPurpose }}</td>
//                   <td><span class="mode-badge">{{ txn.paymentMode }}</span></td>
//                   <td>{{ txn.transactionDate | date:'medium' }}</td>
//                   <td>
//                     <span class="status-pill completed">{{ txn.status }}</span>
//                   </td>
//                 </tr>
//                 <tr *ngIf="transactions.length === 0">
//                   <td colspan="7" class="empty-row">
//                     <div class="empty-state">
//                       <p>No completed transactions yet</p>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>

//       <!-- Rejection Modal -->
//       <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
//         <div class="modal-content" (click)="$event.stopPropagation()">
//           <div class="modal-header">
//             <h3>❌ Rejection Reason</h3>
//             <button (click)="closeModal()" class="close-btn">✕</button>
//           </div>
//           <div class="modal-body">
//             <p>{{ selectedRejectionReason }}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .dashboard-container {
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       min-height: 100vh;
//       padding-bottom: 40px;
//     }

//     .dashboard-header {
//       background: white;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//       padding: 20px 0;
//       margin-bottom: 30px;
//     }

//     .header-content {
//       max-width: 1400px;
//       margin: 0 auto;
//       padding: 0 25px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//     }

//     .dashboard-header h1 {
//       margin: 0;
//       color: #2d3748;
//       font-size: 28px;
//       font-weight: 700;
//     }

//     .vendor-info {
//       display: flex;
//       align-items: center;
//       gap: 15px;
//     }

//     .vendor-name {
//       font-weight: 600;
//       color: #2d3748;
//       font-size: 16px;
//     }

//     .vendor-id {
//       color: #718096;
//       font-size: 14px;
//     }

//     .status-badge {
//       padding: 6px 12px;
//       border-radius: 20px;
//       font-size: 12px;
//       font-weight: 600;
//       text-transform: uppercase;
//     }

//     .status-badge.active {
//       background: #c6f6d5;
//       color: #22543d;
//     }

//     .status-badge.inactive {
//       background: #fed7d7;
//       color: #742a2a;
//     }

//     .loading-overlay {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       min-height: 400px;
//       color: white;
//     }

//     .spinner {
//       width: 50px;
//       height: 50px;
//       border: 4px solid rgba(255,255,255,0.3);
//       border-top-color: white;
//       border-radius: 50%;
//       animation: spin 1s linear infinite;
//     }

//     @keyframes spin {
//       to { transform: rotate(360deg); }
//     }

//     .error-banner {
//       max-width: 1400px;
//       margin: 0 auto 20px;
//       padding: 15px 25px;
//       background: #fed7d7;
//       color: #742a2a;
//       border-radius: 8px;
//       display: flex;
//       align-items: center;
//       gap: 10px;
//     }

//     .error-icon {
//       font-size: 20px;
//     }

//     .close-btn {
//       margin-left: auto;
//       background: none;
//       border: none;
//       font-size: 20px;
//       cursor: pointer;
//       color: #742a2a;
//     }

//     .main-content {
//       max-width: 1400px;
//       margin: 0 auto;
//       padding: 0 25px;
//     }

//     .tab-navigation {
//       display: flex;
//       gap: 10px;
//       margin-bottom: 30px;
//       background: rgba(255,255,255,0.2);
//       padding: 10px;
//       border-radius: 12px;
//       backdrop-filter: blur(10px);
//     }

//     .tab-button {
//       flex: 1;
//       padding: 15px 20px;
//       background: transparent;
//       border: 2px solid transparent;
//       border-radius: 8px;
//       color: white;
//       font-size: 16px;
//       font-weight: 500;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 10px;
//     }

//     .tab-button:hover {
//       background: rgba(255,255,255,0.1);
//     }

//     .tab-button.active {
//       background: white;
//       color: #667eea;
//       border-color: white;
//     }

//     .tab-icon {
//       font-size: 20px;
//     }

//     .content-section {
//       background: white;
//       border-radius: 12px;
//       padding: 30px;
//       box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//     }

//     .section-title {
//       margin: 0 0 25px 0;
//       color: #2d3748;
//       font-size: 24px;
//       font-weight: 600;
//     }

//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//       gap: 20px;
//       margin-bottom: 30px;
//     }

//     .stat-card {
//       padding: 25px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       gap: 20px;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//     }

//     .stat-card.primary {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//     }

//     .stat-card.warning {
//       background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
//       color: white;
//     }

//     .stat-card.success {
//       background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
//       color: white;
//     }

//     .stat-card.danger {
//       background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
//       color: white;
//     }

//     .stat-icon {
//       font-size: 48px;
//       opacity: 0.9;
//     }

//     .stat-content h3 {
//       margin: 0 0 8px 0;
//       font-size: 14px;
//       font-weight: 500;
//       opacity: 0.9;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }

//     .stat-value {
//       margin: 0 0 5px 0;
//       font-size: 28px;
//       font-weight: 700;
//     }

//     .stat-label {
//       font-size: 13px;
//       opacity: 0.8;
//     }

//     .recent-activity {
//       margin-top: 30px;
//     }

//     .recent-activity h3 {
//       margin: 0 0 20px 0;
//       color: #2d3748;
//       font-size: 18px;
//       font-weight: 600;
//     }

//     .activity-list {
//       display: flex;
//       flex-direction: column;
//       gap: 15px;
//     }

//     .activity-item {
//       display: flex;
//       align-items: center;
//       gap: 15px;
//       padding: 15px;
//       background: #f7fafc;
//       border-radius: 8px;
//       transition: all 0.2s ease;
//     }

//     .activity-item:hover {
//       background: #edf2f7;
//       transform: translateX(5px);
//     }

//     .activity-icon {
//       font-size: 24px;
//       width: 40px;
//       height: 40px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: white;
//       border-radius: 8px;
//     }

//     .activity-details {
//       flex: 1;
//     }

//     .activity-title {
//       margin: 0 0 5px 0;
//       color: #2d3748;
//       font-weight: 500;
//     }

//     .activity-meta {
//       margin: 0;
//       color: #718096;
//       font-size: 13px;
//     }

//     .activity-amount {
//       font-size: 18px;
//       font-weight: 700;
//       color: #48bb78;
//     }

//     .profile-card, .bank-card {
//       display: flex;
//       flex-direction: column;
//       gap: 30px;
//     }

//     .profile-section {
//       padding: 25px;
//       background: #f7fafc;
//       border-radius: 8px;
//     }

//     .profile-section h3 {
//       margin: 0 0 20px 0;
//       color: #2d3748;
//       font-size: 16px;
//       font-weight: 600;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }

//     .info-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//       gap: 20px;
//     }

//     .info-item.full-width {
//       grid-column: 1 / -1;
//     }

//     .info-item label {
//       display: block;
//       margin-bottom: 5px;
//       color: #718096;
//       font-size: 13px;
//       font-weight: 500;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }

//     .info-item p {
//       margin: 0;
//       color: #2d3748;
//       font-size: 16px;
//       font-weight: 500;
//     }

//     .bank-header {
//       display: flex;
//       align-items: center;
//       gap: 20px;
//       padding: 25px;
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       border-radius: 12px;
//       color: white;
//     }

//     .bank-logo {
//       font-size: 48px;
//       width: 80px;
//       height: 80px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: rgba(255,255,255,0.2);
//       border-radius: 12px;
//     }

//     .bank-info {
//       flex: 1;
//     }

//     .bank-info h3 {
//       margin: 0 0 5px 0;
//       font-size: 24px;
//       font-weight: 700;
//     }

//     .bank-info p {
//       margin: 0;
//       opacity: 0.9;
//       font-size: 14px;
//     }

//     .account-status {
//       padding: 8px 16px;
//       background: rgba(255,255,255,0.2);
//       border-radius: 20px;
//       font-size: 12px;
//       font-weight: 600;
//       text-transform: uppercase;
//     }

//     .account-status.active {
//       background: #c6f6d5;
//       color: #22543d;
//     }

//     .bank-details {
//       display: flex;
//       flex-direction: column;
//       gap: 20px;
//       padding: 25px;
//       background: #f7fafc;
//       border-radius: 12px;
//     }

//     .detail-row {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 15px;
//       background: white;
//       border-radius: 8px;
//     }

//     .detail-row.highlight {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//     }

//     .detail-row label {
//       font-weight: 500;
//       font-size: 14px;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }

//     .detail-row p {
//       margin: 0;
//       font-size: 16px;
//       font-weight: 600;
//     }

//     .masked-account {
//       font-family: monospace;
//       letter-spacing: 2px;
//     }

//     .balance-amount {
//       font-size: 24px !important;
//       font-weight: 700 !important;
//     }

//     .empty-state-card {
//       text-align: center;
//       padding: 60px 20px;
//       background: #f7fafc;
//       border-radius: 12px;
//     }

//     .empty-icon {
//       font-size: 64px;
//       margin-bottom: 20px;
//     }

//     .empty-state-card h3 {
//       margin: 0 0 10px 0;
//       color: #2d3748;
//       font-size: 20px;
//     }

//     .empty-state-card p {
//       margin: 0;
//       color: #718096;
//       font-size: 14px;
//       max-width: 500px;
//       margin: 0 auto;
//     }

//     .filter-bar {
//       display: flex;
//       gap: 15px;
//       margin-bottom: 25px;
//       flex-wrap: wrap;
//     }

//     .filter-select {
//       padding: 10px 15px;
//       border: 2px solid #e2e8f0;
//       border-radius: 8px;
//       background: white;
//       color: #2d3748;
//       font-size: 14px;
//       font-weight: 500;
//       cursor: pointer;
//       transition: all 0.2s ease;
//     }

//     .filter-select:focus {
//       outline: none;
//       border-color: #667eea;
//     }

//     .search-box {
//       flex: 1;
//       min-width: 300px;
//     }

//     .search-input {
//       width: 100%;
//       padding: 10px 15px;
//       border: 2px solid #e2e8f0;
//       border-radius: 8px;
//       font-size: 14px;
//       transition: all 0.2s ease;
//     }

//     .search-input:focus {
//       outline: none;
//       border-color: #667eea;
//     }

//     .table-container {
//       overflow-x: auto;
//       border-radius: 8px;
//       border: 1px solid #e2e8f0;
//     }

//     .data-table {
//       width: 100%;
//       border-collapse: collapse;
//       background: white;
//     }

//     .data-table thead {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//     }

//     .data-table th {
//       padding: 15px;
//       text-align: left;
//       font-weight: 600;
//       font-size: 13px;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }

//     .data-table td {
//       padding: 15px;
//       border-bottom: 1px solid #e2e8f0;
//       color: #2d3748;
//       font-size: 14px;
//     }

//     .table-row:hover {
//       background: #f7fafc;
//     }

//     .amount-cell {
//       font-weight: 700;
//       color: #2d3748;
//       font-size: 16px;
//     }

//     .amount-cell.success {
//       color: #48bb78;
//     }

//     .payment-purpose {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .doc-badge {
//       font-size: 16px;
//       cursor: help;
//     }

//     .mode-badge {
//       padding: 4px 10px;
//       background: #edf2f7;
//       color: #4a5568;
//       border-radius: 4px;
//       font-size: 12px;
//       font-weight: 600;
//     }

//     .status-pill {
//       padding: 6px 12px;
//       border-radius: 20px;
//       font-size: 11px;
//       font-weight: 700;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       display: inline-block;
//     }

//     .status-pill.pending {
//       background: #fef5e7;
//       color: #f39c12;
//     }

//     .status-pill.approved {
//       background: #e8f5e9;
//       color: #4caf50;
//     }

//     .status-pill.processing {
//       background: #e3f2fd;
//       color: #2196f3;
//     }

//     .status-pill.completed {
//       background: #c6f6d5;
//       color: #22543d;
//     }

//     .status-pill.rejected {
//       background: #fed7d7;
//       color: #742a2a;
//     }

//     .status-pill.failed {
//       background: #ffebee;
//       color: #c62828;
//     }

//     .txn-id {
//       font-family: monospace;
//       background: #edf2f7;
//       padding: 4px 8px;
//       border-radius: 4px;
//       font-size: 12px;
//       font-weight: 600;
//     }

//     .utr-number {
//       font-family: monospace;
//       color: #667eea;
//       font-weight: 600;
//       font-size: 13px;
//     }

//     .na-text {
//       color: #cbd5e0;
//       font-style: italic;
//     }

//     .action-btn {
//       padding: 6px 12px;
//       border: none;
//       border-radius: 6px;
//       cursor: pointer;
//       font-size: 14px;
//       transition: all 0.2s ease;
//     }

//     .view-btn {
//       background: #667eea;
//       color: white;
//     }

//     .view-btn:hover {
//       background: #5568d3;
//       transform: translateY(-2px);
//     }

//     .empty-row {
//       text-align: center;
//       padding: 40px !important;
//     }

//     .empty-state {
//       color: #a0aec0;
//       font-style: italic;
//     }

//     .transaction-summary {
//       display: flex;
//       gap: 30px;
//       margin-bottom: 25px;
//       padding: 20px;
//       background: #f7fafc;
//       border-radius: 8px;
//     }

//     .summary-item {
//       display: flex;
//       flex-direction: column;
//       gap: 5px;
//     }

//     .summary-label {
//       font-size: 13px;
//       color: #718096;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       font-weight: 500;
//     }

//     .summary-value {
//       font-size: 24px;
//       font-weight: 700;
//       color: #2d3748;
//     }

//     .modal-overlay {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: rgba(0,0,0,0.6);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 1000;
//       padding: 20px;
//     }

//     .modal-content {
//       background: white;
//       border-radius: 12px;
//       max-width: 500px;
//       width: 100%;
//       box-shadow: 0 10px 40px rgba(0,0,0,0.3);
//     }

//     .modal-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 20px 25px;
//       border-bottom: 1px solid #e2e8f0;
//     }

//     .modal-header h3 {
//       margin: 0;
//       color: #2d3748;
//       font-size: 18px;
//       font-weight: 600;
//     }

//     .modal-body {
//       padding: 25px;
//     }

//     .modal-body p {
//       margin: 0;
//       color: #4a5568;
//       line-height: 1.6;
//       font-size: 15px;
//     }

//     @media (max-width: 768px) {
//       .header-content {
//         flex-direction: column;
//         gap: 15px;
//         align-items: flex-start;
//       }

//       .stats-grid {
//         grid-template-columns: 1fr;
//       }

//       .tab-navigation {
//         flex-direction: column;
//       }

//       .filter-bar {
//         flex-direction: column;
//       }

//       .search-box {
//         min-width: 100%;
//       }

//       .table-container {
//         font-size: 12px;
//       }

//       .data-table th,
//       .data-table td {
//         padding: 10px 8px;
//       }

//       .transaction-summary {
//         flex-direction: column;
//         gap: 15px;
//       }
//     }
//   `]
// })
// export class VendorDashboardComponent implements OnInit {
//   private apiUrl = 'http://localhost:8080/api/vendors';

//   // Vendor ID (in production, get from auth service)
//   vendorId = 1;

//   // Data properties
//   vendor: VendorResponseDto | null = null;
//   bankAccount: VendorBankAccountResponseDto | null = null;
//   payments: VendorPaymentResponseDto[] = [];
//   transactions: VendorTransactionDto[] = [];
//   filteredPayments: VendorPaymentResponseDto[] = [];

//   // UI state
//   activeTab = 'dashboard';
//   isLoading = true;
//   errorMessage = '';
//   paymentFilter = 'ALL';
//   searchTerm = '';
//   showModal = false;
//   selectedRejectionReason = '';

//   // Dashboard stats
//   stats: DashboardStats = {
//     totalPaymentsReceived: 0,
//     pendingPayments: 0,
//     completedPayments: 0,
//     rejectedPayments: 0,
//     totalAmount: 0,
//     pendingAmount: 0,
//     completedAmount: 0
//   };

//   // Navigation tabs
//   tabs = [
//     { id: 'dashboard', icon: '📊', label: 'Dashboard' },
//     { id: 'profile', icon: '👤', label: 'Profile' },
//     { id: 'bankAccount', icon: '🏦', label: 'Bank Account' },
//     { id: 'payments', icon: '💳', label: 'Payments' },
//     { id: 'transactions', icon: '📜', label: 'Transactions' }
//   ];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.loadAllData();
//   }

//   /**
//    * Load all vendor data using forkJoin for parallel requests
//    */
//   loadAllData(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     const vendorProfile$ = this.http.get<VendorResponseDto>(
//       `${this.apiUrl}/${this.vendorId}`
//     ).pipe(catchError(err => {
//       console.error('Failed to load vendor profile', err);
//       return of(null);
//     }));

//     const bankAccount$ = this.http.get<VendorBankAccountResponseDto>(
//       `${this.apiUrl}/vendor/${this.vendorId}/bank-account`
//     ).pipe(catchError(err => {
//       console.warn('No bank account found', err);
//       return of(null);
//     }));

//     // Assuming orgId is 1 for demo purposes
//     const payments$ = this.http.get<VendorPaymentResponseDto[]>(
//       `${this.apiUrl}/payments/1`
//     ).pipe(catchError(err => {
//       console.error('Failed to load payments', err);
//       return of([]);
//     }));

//     const transactions$ = this.http.get<VendorTransactionDto[]>(
//       `${this.apiUrl}/transactions/1`
//     ).pipe(catchError(err => {
//       console.error('Failed to load transactions', err);
//       return of([]);
//     }));

//     forkJoin({
//       vendor: vendorProfile$,
//       bankAccount: bankAccount$,
//       payments: payments$,
//       transactions: transactions$
//     }).subscribe({
//       next: (results) => {
//         this.vendor = results.vendor;
//         this.bankAccount = results.bankAccount;
        
//         // Filter payments for current vendor
//         if (this.vendor) {
//           this.payments = results.payments.filter(
//             p => p.vendorName === this.vendor!.vendorName
//           );
//         } else {
//           this.payments = results.payments;
//         }
        
//         this.transactions = results.transactions;
//         this.filteredPayments = [...this.payments];
        
//         this.calculateStats();
//         this.isLoading = false;

//         if (!this.vendor) {
//           this.errorMessage = 'Failed to load vendor profile. Please try again.';
//         }
//       },
//       error: (err: HttpErrorResponse) => {
//         console.error('Error loading data', err);
//         this.errorMessage = 'Failed to load vendor data. Please check your connection and try again.';
//         this.isLoading = false;
//       }
//     });
//   }

//   /**
//    * Calculate dashboard statistics
//    */
//   calculateStats(): void {
//     this.stats = {
//       totalPaymentsReceived: this.payments.length,
//       pendingPayments: this.payments.filter(p => p.status === 'PENDING').length,
//       completedPayments: this.payments.filter(p => p.status === 'COMPLETED').length,
//       rejectedPayments: this.payments.filter(p => p.status === 'REJECTED').length,
//       totalAmount: this.payments.reduce((sum, p) => sum + p.amount, 0),
//       pendingAmount: this.payments
//         .filter(p => p.status === 'PENDING' || p.status === 'APPROVED' || p.status === 'PROCESSING')
//         .reduce((sum, p) => sum + p.amount, 0),
//       completedAmount: this.payments
//         .filter(p => p.status === 'COMPLETED')
//         .reduce((sum, p) => sum + p.amount, 0)
//     };
//   }

//   /**
//    * Filter payments based on status and search term
//    */
//   filterPayments(): void {
//     let filtered = [...this.payments];

//     // Filter by status
//     if (this.paymentFilter !== 'ALL') {
//       filtered = filtered.filter(p => p.status === this.paymentFilter);
//     }

//     // Filter by search term
//     if (this.searchTerm.trim()) {
//       const term = this.searchTerm.toLowerCase();
//       filtered = filtered.filter(p =>
//         p.paymentPurpose.toLowerCase().includes(term) ||
//         (p.transactionId && p.transactionId.toLowerCase().includes(term))
//       );
//     }

//     this.filteredPayments = filtered;
//   }

//   /**
//    * Get CSS class for payment status
//    */
//   getStatusClass(status: string): string {
//     return status.toLowerCase();
//   }

//   /**
//    * Mask account number for security (show last 4 digits)
//    */
//   maskAccountNumber(accountNumber: string): string {
//     if (!accountNumber || accountNumber.length < 4) return accountNumber;
//     const lastFour = accountNumber.slice(-4);
//     const masked = 'X'.repeat(accountNumber.length - 4);
//     return masked + lastFour;
//   }

//   /**
//    * Calculate total transaction amount
//    */
//   calculateTotalTransactionAmount(): number {
//     return this.transactions.reduce((sum, txn) => sum + txn.amount, 0);
//   }

//   /**
//    * Show rejection reason modal
//    */
//   showRejectionReason(payment: VendorPaymentResponseDto): void {
//     this.selectedRejectionReason = payment.rejectionReason || 'No reason provided';
//     this.showModal = true;
//   }

//   /**
//    * Close modal
//    */
//   closeModal(): void {
//     this.showModal = false;
//     this.selectedRejectionReason = '';
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';

// 🧩 Interfaces matching Spring Backend DTOs
interface VendorResponseDto {
  vendorId: number;
  vendorName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  createdAt?: string;
}

interface VendorBankAccountResponseDto {
  accountId: number;
  vendorName: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  accountNumber: string;
  balance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
}

interface VendorPaymentResponseDto {
  paymentId: number;
  vendorName: string;
  amount: number;
  paymentPurpose: string;
  paymentMode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'CHEQUE';
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
  transactionId?: string;
  requestedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  documentPath?: string;
}

interface VendorTransactionDto {
  transactionId: string;
  vendorName: string;
  amount: number;
  paymentPurpose: string;
  paymentMode: string;
  transactionDate: string;
  status: string;
  utrNumber?: string;
}

interface DashboardStats {
  totalPaymentsReceived: number;
  pendingPayments: number;
  completedPayments: number;
  rejectedPayments: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
}

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1>🏦 Vendor Payment Portal</h1>
          <div class="vendor-info" *ngIf="vendor">
            <span class="vendor-name">{{ vendor.vendorName }}</span>
            <span class="vendor-id">ID: {{ vendorId }}</span>
            <span class="status-badge" [class.active]="vendor.status === 'ACTIVE'" 
                  [class.inactive]="vendor.status !== 'ACTIVE'">
              {{ vendor.status }}
            </span>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Loading your data...</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="error-banner">
        <span class="error-icon">⚠️</span>
        <span>{{ errorMessage }}</span>
        <button (click)="errorMessage = ''" class="close-btn">✕</button>
      </div>

      <!-- Main Content -->
      <div class="main-content" *ngIf="!isLoading">
        
        <!-- Navigation Tabs -->
        <nav class="tab-navigation">
          <button *ngFor="let tab of tabs"
                  (click)="activeTab = tab.id"
                  [class.active]="activeTab === tab.id"
                  class="tab-button">
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Dashboard Overview -->
        <section *ngIf="activeTab === 'dashboard'" class="content-section">
          <h2 class="section-title">📊 Dashboard Overview</h2>
          
          <div class="stats-grid">
            <div class="stat-card primary">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <h3>Total Received</h3>
                <p class="stat-value">₹{{ stats.totalAmount | number:'1.2-2' }}</p>
                <span class="stat-label">{{ stats.totalPaymentsReceived }} payments</span>
              </div>
            </div>

            <div class="stat-card warning">
              <div class="stat-icon">⏳</div>
              <div class="stat-content">
                <h3>Pending</h3>
                <p class="stat-value">₹{{ stats.pendingAmount | number:'1.2-2' }}</p>
                <span class="stat-label">{{ stats.pendingPayments }} requests</span>
              </div>
            </div>

            <div class="stat-card success">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <h3>Completed</h3>
                <p class="stat-value">₹{{ stats.completedAmount | number:'1.2-2' }}</p>
                <span class="stat-label">{{ stats.completedPayments }} transactions</span>
              </div>
            </div>

            <div class="stat-card danger">
              <div class="stat-icon">❌</div>
              <div class="stat-content">
                <h3>Rejected</h3>
                <p class="stat-value">{{ stats.rejectedPayments }}</p>
                <span class="stat-label">Payment requests</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="recent-activity">
            <h3>Recent Transactions</h3>
            <div class="activity-list">
              <div *ngFor="let txn of transactions.slice(0, 5)" class="activity-item">
                <div class="activity-icon">💳</div>
                <div class="activity-details">
                  <p class="activity-title">{{ txn.paymentPurpose }}</p>
                  <p class="activity-meta">{{ txn.transactionDate | date:'medium' }} • {{ txn.paymentMode }}</p>
                </div>
                <div class="activity-amount">₹{{ txn.amount | number:'1.2-2' }}</div>
              </div>
              <div *ngIf="transactions.length === 0" class="empty-state">
                <p>No recent transactions</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Vendor Profile -->
        <section *ngIf="activeTab === 'profile'" class="content-section">
          <h2 class="section-title">👤 Vendor Profile</h2>
          
          <div *ngIf="vendor" class="profile-card">
            <div class="profile-section">
              <h3>Basic Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Vendor Name</label>
                  <p>{{ vendor.vendorName }}</p>
                </div>
                <div class="info-item">
                  <label>Vendor ID</label>
                  <p>{{ vendor.vendorId }}</p>
                </div>
                <div class="info-item">
                  <label>Email Address</label>
                  <p>{{ vendor.email }}</p>
                </div>
                <div class="info-item">
                  <label>Phone Number</label>
                  <p>{{ vendor.phoneNumber }}</p>
                </div>
                <div class="info-item full-width">
                  <label>Business Address</label>
                  <p>{{ vendor.address }}</p>
                </div>
              </div>
            </div>

            <div class="profile-section">
              <h3>Tax Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>GST Number</label>
                  <p>{{ vendor.gstNumber }}</p>
                </div>
                <div class="info-item">
                  <label>PAN Number</label>
                  <p>{{ vendor.panNumber }}</p>
                </div>
              </div>
            </div>

            <div class="profile-section">
              <h3>Account Status</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Status</label>
                  <p>
                    <span class="status-badge" [class.active]="vendor.status === 'ACTIVE'"
                          [class.inactive]="vendor.status !== 'ACTIVE'">
                      {{ vendor.status }}
                    </span>
                  </p>
                </div>
                <div class="info-item">
                  <label>Registered On</label>
                  <p>{{ vendor.createdAt | date:'fullDate' }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Bank Account Details -->
        <section *ngIf="activeTab === 'bankAccount'" class="content-section">
          <h2 class="section-title">🏦 Bank Account Details</h2>
          
          <div *ngIf="bankAccount" class="bank-card">
            <div class="bank-header">
              <div class="bank-logo">🏦</div>
              <div class="bank-info">
                <h3>{{ bankAccount.bankName }}</h3>
                <p>{{ bankAccount.branch }}</p>
              </div>
              <span class="account-status" [class.active]="bankAccount.status === 'ACTIVE'">
                {{ bankAccount.status }}
              </span>
            </div>

            <div class="bank-details">
              <div class="detail-row">
                <label>Account Holder Name</label>
                <p>{{ bankAccount.vendorName }}</p>
              </div>
              <div class="detail-row">
                <label>Account Number</label>
                <p class="masked-account">{{ maskAccountNumber(bankAccount.accountNumber) }}</p>
              </div>
              <div class="detail-row">
                <label>IFSC Code</label>
                <p>{{ bankAccount.ifscCode }}</p>
              </div>
              <div class="detail-row highlight">
                <label>Current Balance</label>
                <p class="balance-amount">₹{{ bankAccount.balance | number:'1.2-2' }}</p>
              </div>
            </div>
          </div>

          <div *ngIf="!bankAccount && !isLoading" class="empty-state-card">
            <div class="empty-icon">🏦</div>
            <h3>No Bank Account Linked</h3>
            <p>Please contact your organization administrator to link your bank account for receiving payments.</p>
          </div>
        </section>

        <!-- Payment Requests -->
        <section *ngIf="activeTab === 'payments'" class="content-section">
          <div class="section-header">
            <div>
              <h2 class="section-title">💳 Payment Requests</h2>
            </div>
            <button (click)="showPaymentForm = !showPaymentForm" class="btn-add-payment">
              <span *ngIf="!showPaymentForm">+ New Payment Request</span>
              <span *ngIf="showPaymentForm">✕ Cancel</span>
            </button>
          </div>

          <!-- New Payment Request Form -->
          <div *ngIf="showPaymentForm" class="payment-form-card">
            <h3>Submit New Payment Request</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Amount (₹) <span class="required">*</span></label>
                <input type="number" [(ngModel)]="newPaymentRequest.amount" 
                       placeholder="Enter amount" min="1" step="0.01" class="form-input">
              </div>

              <div class="form-group">
                <label>Payment Mode <span class="required">*</span></label>
                <select [(ngModel)]="newPaymentRequest.paymentMode" class="form-input">
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IMPS">IMPS</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label>Payment Purpose <span class="required">*</span></label>
                <textarea [(ngModel)]="newPaymentRequest.paymentPurpose" 
                          placeholder="Describe the purpose of payment..." 
                          rows="3" class="form-input"></textarea>
              </div>

              <div class="form-group full-width">
                <label>Supporting Document (Optional)</label>
                <div class="file-upload-wrapper">
                  <input #fileInput type="file" (change)="onFileSelect($event)" 
                         accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" 
                         style="display: none">
                  <button (click)="fileInput.click()" class="btn-file-upload" type="button">
                    📎 {{ selectedFile ? selectedFile.name : 'Choose File' }}
                  </button>
                  <button *ngIf="selectedFile" (click)="removeFile()" 
                          class="btn-remove-file" type="button">✕</button>
                </div>
                <small class="form-hint">PDF, Image, or Document (Max 5MB)</small>
              </div>
            </div>

            <div class="form-actions">
              <button (click)="cancelPaymentForm()" class="btn-cancel" [disabled]="isSubmittingPayment">
                Cancel
              </button>
              <button (click)="submitPaymentRequest()" class="btn-submit" 
                      [disabled]="isSubmittingPayment || !isPaymentFormValid()">
                <span *ngIf="!isSubmittingPayment">Submit Request</span>
                <span *ngIf="isSubmittingPayment">
                  <span class="spinner-mini"></span> Submitting...
                </span>
              </button>
            </div>
          </div>

          <!-- Success/Error Message -->
          <div *ngIf="paymentMessage" 
               [class]="paymentMessageType === 'success' ? 'alert-success' : 'alert-error'">
            <span>{{ paymentMessage }}</span>
            <button (click)="paymentMessage = ''" class="alert-close">✕</button>
          </div>
          
          <!-- Filter Controls -->
          <div class="filter-bar">
            <select [(ngModel)]="paymentFilter" (change)="filterPayments()" class="filter-select">
              <option value="ALL">All Payments</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <div class="search-box">
              <input type="text" [(ngModel)]="searchTerm" (input)="filterPayments()" 
                     placeholder="Search by purpose or transaction ID..." class="search-input">
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Purpose</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Requested Date</th>
                  <th>Approved Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let payment of filteredPayments" class="table-row">
                  <td>{{ payment.paymentId }}</td>
                  <td>
                    <div class="payment-purpose">
                      <span>{{ payment.paymentPurpose }}</span>
                      <span *ngIf="payment.documentPath" class="doc-badge" title="Document attached">📎</span>
                    </div>
                  </td>
                  <td class="amount-cell">₹{{ payment.amount | number:'1.2-2' }}</td>
                  <td><span class="mode-badge">{{ payment.paymentMode }}</span></td>
                  <td>
                    <span class="status-pill" [ngClass]="getStatusClass(payment.status)">
                      {{ payment.status }}
                    </span>
                  </td>
                  <td>
                    <span *ngIf="payment.transactionId" class="txn-id">{{ payment.transactionId }}</span>
                    <span *ngIf="!payment.transactionId" class="na-text">—</span>
                  </td>
                  <td>{{ payment.requestedAt | date:'short' }}</td>
                  <td>
                    <span *ngIf="payment.approvedAt">{{ payment.approvedAt | date:'short' }}</span>
                    <span *ngIf="!payment.approvedAt" class="na-text">—</span>
                  </td>
                  <td>
                    <button *ngIf="payment.status === 'REJECTED' && payment.rejectionReason" 
                            (click)="showRejectionReason(payment)" 
                            class="action-btn view-btn" 
                            title="View rejection reason">
                      👁️
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredPayments.length === 0">
                  <td colspan="9" class="empty-row">
                    <div class="empty-state">
                      <p>No payment requests found</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Transaction History -->
        <section *ngIf="activeTab === 'transactions'" class="content-section">
          <h2 class="section-title">📜 Transaction History</h2>
          
          <!-- Summary Cards -->
          <div class="transaction-summary">
            <div class="summary-item">
              <span class="summary-label">Total Transactions</span>
              <span class="summary-value">{{ transactions.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Amount</span>
              <span class="summary-value">₹{{ calculateTotalTransactionAmount() | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>UTR Number</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Payment Mode</th>
                  <th>Transaction Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let txn of transactions" class="table-row">
                  <td><span class="txn-id">{{ txn.transactionId }}</span></td>
                  <td>
                    <span *ngIf="txn.utrNumber" class="utr-number">{{ txn.utrNumber }}</span>
                    <span *ngIf="!txn.utrNumber" class="na-text">—</span>
                  </td>
                  <td class="amount-cell success">₹{{ txn.amount | number:'1.2-2' }}</td>
                  <td>{{ txn.paymentPurpose }}</td>
                  <td><span class="mode-badge">{{ txn.paymentMode }}</span></td>
                  <td>{{ txn.transactionDate | date:'medium' }}</td>
                  <td>
                    <span class="status-pill completed">{{ txn.status }}</span>
                  </td>
                </tr>
                <tr *ngIf="transactions.length === 0">
                  <td colspan="7" class="empty-row">
                    <div class="empty-state">
                      <p>No completed transactions yet</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Rejection Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>❌ Rejection Reason</h3>
            <button (click)="closeModal()" class="close-btn">✕</button>
          </div>
          <div class="modal-body">
            <p>{{ selectedRejectionReason }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding-bottom: 40px;
    }

    .dashboard-header {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px 0;
      margin-bottom: 30px;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #2d3748;
      font-size: 28px;
      font-weight: 700;
    }

    .vendor-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .vendor-name {
      font-weight: 600;
      color: #2d3748;
      font-size: 16px;
    }

    .vendor-id {
      color: #718096;
      font-size: 14px;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-badge.inactive {
      background: #fed7d7;
      color: #742a2a;
    }

    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: white;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-banner {
      max-width: 1400px;
      margin: 0 auto 20px;
      padding: 15px 25px;
      background: #fed7d7;
      color: #742a2a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .error-icon {
      font-size: 20px;
    }

    .close-btn {
      margin-left: auto;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #742a2a;
    }

    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 25px;
    }

    .tab-navigation {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      background: rgba(255,255,255,0.2);
      padding: 10px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .tab-button {
      flex: 1;
      padding: 15px 20px;
      background: transparent;
      border: 2px solid transparent;
      border-radius: 8px;
      color: white;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .tab-button:hover {
      background: rgba(255,255,255,0.1);
    }

    .tab-button.active {
      background: white;
      color: #667eea;
      border-color: white;
    }

    .tab-icon {
      font-size: 20px;
    }

    .content-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .section-title {
      margin: 0 0 25px 0;
      color: #2d3748;
      font-size: 24px;
      font-weight: 600;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .btn-add-payment {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-add-payment:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .payment-form-card {
      background: #f7fafc;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      border: 2px solid #e2e8f0;
    }

    .payment-form-card h3 {
      margin: 0 0 25px 0;
      color: #2d3748;
      font-size: 18px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 25px;
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

    .form-input {
      padding: 10px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    textarea.form-input {
      resize: vertical;
    }

    .file-upload-wrapper {
      display: flex;
      gap: 10px;
    }

    .btn-file-upload {
      flex: 1;
      padding: 10px 16px;
      background: white;
      border: 2px dashed #cbd5e0;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      color: #4a5568;
      transition: all 0.2s;
    }

    .btn-file-upload:hover {
      border-color: #667eea;
      background: #f7fafc;
    }

    .btn-remove-file {
      padding: 10px 16px;
      background: #fed7d7;
      color: #742a2a;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-remove-file:hover {
      background: #fc8181;
      color: white;
    }

    .form-hint {
      color: #718096;
      font-size: 12px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
    }

    .btn-cancel, .btn-submit {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }

    .btn-cancel {
      background: #edf2f7;
      color: #4a5568;
    }

    .btn-cancel:hover:not(:disabled) {
      background: #e2e8f0;
    }

    .btn-submit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:disabled, .btn-cancel:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-mini {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.8s linear infinite;
    }

    .alert-success, .alert-error {
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .alert-success {
      background: #c6f6d5;
      color: #22543d;
      border: 1px solid #9ae6b4;
    }

    .alert-error {
      background: #fed7d7;
      color: #742a2a;
      border: 1px solid #fc8181;
    }

    .alert-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .alert-close:hover {
      opacity: 1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      padding: 25px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-card.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-card.warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .stat-card.success {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .stat-card.danger {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .stat-icon {
      font-size: 48px;
      opacity: 0.9;
    }

    .stat-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      margin: 0 0 5px 0;
      font-size: 28px;
      font-weight: 700;
    }

    .stat-label {
      font-size: 13px;
      opacity: 0.8;
    }

    .recent-activity {
      margin-top: 30px;
    }

    .recent-activity h3 {
      margin: 0 0 20px 0;
      color: #2d3748;
      font-size: 18px;
      font-weight: 600;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: #f7fafc;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .activity-item:hover {
      background: #edf2f7;
      transform: translateX(5px);
    }

    .activity-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 8px;
    }

    .activity-details {
      flex: 1;
    }

    .activity-title {
      margin: 0 0 5px 0;
      color: #2d3748;
      font-weight: 500;
    }

    .activity-meta {
      margin: 0;
      color: #718096;
      font-size: 13px;
    }

    .activity-amount {
      font-size: 18px;
      font-weight: 700;
      color: #48bb78;
    }

    .profile-card, .bank-card {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .profile-section {
      padding: 25px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .profile-section h3 {
      margin: 0 0 20px 0;
      color: #2d3748;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      display: block;
      margin-bottom: 5px;
      color: #718096;
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item p {
      margin: 0;
      color: #2d3748;
      font-size: 16px;
      font-weight: 500;
    }

    .bank-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 25px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .bank-logo {
      font-size: 48px;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
    }

    .bank-info {
      flex: 1;
    }

    .bank-info h3 {
      margin: 0 0 5px 0;
      font-size: 24px;
      font-weight: 700;
    }

    .bank-info p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .account-status {
      padding: 8px 16px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .account-status.active {
      background: #c6f6d5;
      color: #22543d;
    }

    .bank-details {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 25px;
      background: #f7fafc;
      border-radius: 12px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
    }

    .detail-row.highlight {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .detail-row label {
      font-weight: 500;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-row p {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .masked-account {
      font-family: monospace;
      letter-spacing: 2px;
    }

    .balance-amount {
      font-size: 24px !important;
      font-weight: 700 !important;
    }

    .empty-state-card {
      text-align: center;
      padding: 60px 20px;
      background: #f7fafc;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state-card h3 {
      margin: 0 0 10px 0;
      color: #2d3748;
      font-size: 20px;
    }

    .empty-state-card p {
      margin: 0;
      color: #718096;
      font-size: 14px;
      max-width: 500px;
      margin: 0 auto;
    }

    .filter-bar {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 10px 15px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      color: #2d3748;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-box {
      flex: 1;
      min-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 10px 15px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .table-container {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .data-table thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .data-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .data-table td {
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
      color: #2d3748;
      font-size: 14px;
    }

    .table-row:hover {
      background: #f7fafc;
    }

    .amount-cell {
      font-weight: 700;
      color: #2d3748;
      font-size: 16px;
    }

    .amount-cell.success {
      color: #48bb78;
    }

    .payment-purpose {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .doc-badge {
      font-size: 16px;
      cursor: help;
    }

    .mode-badge {
      padding: 4px 10px;
      background: #edf2f7;
      color: #4a5568;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-pill {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
    }

    .status-pill.pending {
      background: #fef5e7;
      color: #f39c12;
    }

    .status-pill.approved {
      background: #e8f5e9;
      color: #4caf50;
    }

    .status-pill.processing {
      background: #e3f2fd;
      color: #2196f3;
    }

    .status-pill.completed {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-pill.rejected {
      background: #fed7d7;
      color: #742a2a;
    }

    .status-pill.failed {
      background: #ffebee;
      color: #c62828;
    }

    .txn-id {
      font-family: monospace;
      background: #edf2f7;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .utr-number {
      font-family: monospace;
      color: #667eea;
      font-weight: 600;
      font-size: 13px;
    }

    .na-text {
      color: #cbd5e0;
      font-style: italic;
    }

    .action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .view-btn {
      background: #667eea;
      color: white;
    }

    .view-btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }

    .empty-row {
      text-align: center;
      padding: 40px !important;
    }

    .empty-state {
      color: #a0aec0;
      font-style: italic;
    }

    .transaction-summary {
      display: flex;
      gap: 30px;
      margin-bottom: 25px;
      padding: 20px;
      background: #f7fafc;
      border-radius: 8px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .summary-label {
      font-size: 13px;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .summary-value {
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
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
      max-width: 500px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h3 {
      margin: 0;
      color: #2d3748;
      font-size: 18px;
      font-weight: 600;
    }

    .modal-body {
      padding: 25px;
    }

    .modal-body p {
      margin: 0;
      color: #4a5568;
      line-height: 1.6;
      font-size: 15px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tab-navigation {
        flex-direction: column;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .filter-bar {
        flex-direction: column;
      }

      .search-box {
        min-width: 100%;
      }

      .table-container {
        font-size: 12px;
      }

      .data-table th,
      .data-table td {
        padding: 10px 8px;
      }

      .transaction-summary {
        flex-direction: column;
        gap: 15px;
      }
    }
  `]
})
export class VendorDashboardComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api/vendors';

  // Vendor ID (in production, get from auth service)
  vendorId = 1;

  // Data properties
  vendor: VendorResponseDto | null = null;
  bankAccount: VendorBankAccountResponseDto | null = null;
  payments: VendorPaymentResponseDto[] = [];
  transactions: VendorTransactionDto[] = [];
  filteredPayments: VendorPaymentResponseDto[] = [];

  // UI state
  activeTab = 'dashboard';
  isLoading = true;
  errorMessage = '';
  paymentFilter = 'ALL';
  searchTerm = '';
  showModal = false;
  selectedRejectionReason = '';
  showPaymentForm = false;
  isSubmittingPayment = false;
  paymentMessage = '';
  paymentMessageType: 'success' | 'error' = 'success';
  selectedFile: File | null = null;

  // New payment request
  newPaymentRequest = {
    vendorId: this.vendorId,
    amount: 0,
    paymentPurpose: '',
    paymentMode: 'NEFT' as 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'CHEQUE'
  };

  // Dashboard stats
  stats: DashboardStats = {
    totalPaymentsReceived: 0,
    pendingPayments: 0,
    completedPayments: 0,
    rejectedPayments: 0,
    totalAmount: 0,
    pendingAmount: 0,
    completedAmount: 0
  };

  // Navigation tabs
  tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'bankAccount', icon: '🏦', label: 'Bank Account' },
    { id: 'payments', icon: '💳', label: 'Payments' },
    { id: 'transactions', icon: '📜', label: 'Transactions' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  /**
   * Load all vendor data using forkJoin for parallel requests
   */
  loadAllData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const vendorProfile$ = this.http.get<VendorResponseDto>(
      `${this.apiUrl}/${this.vendorId}`
    ).pipe(catchError(err => {
      console.error('Failed to load vendor profile', err);
      return of(null);
    }));

    const bankAccount$ = this.http.get<VendorBankAccountResponseDto>(
      `${this.apiUrl}/vendor/${this.vendorId}/bank-account`
    ).pipe(catchError(err => {
      console.warn('No bank account found', err);
      return of(null);
    }));

    // Assuming orgId is 1 for demo purposes
    const payments$ = this.http.get<VendorPaymentResponseDto[]>(
      `${this.apiUrl}/payments/1`
    ).pipe(catchError(err => {
      console.error('Failed to load payments', err);
      return of([]);
    }));

    const transactions$ = this.http.get<VendorTransactionDto[]>(
      `${this.apiUrl}/transactions/1`
    ).pipe(catchError(err => {
      console.error('Failed to load transactions', err);
      return of([]);
    }));

    forkJoin({
      vendor: vendorProfile$,
      bankAccount: bankAccount$,
      payments: payments$,
      transactions: transactions$
    }).subscribe({
      next: (results) => {
        this.vendor = results.vendor;
        this.bankAccount = results.bankAccount;
        
        // Filter payments for current vendor
        if (this.vendor) {
          this.payments = results.payments.filter(
            p => p.vendorName === this.vendor!.vendorName
          );
        } else {
          this.payments = results.payments;
        }
        
        this.transactions = results.transactions;
        this.filteredPayments = [...this.payments];
        
        this.calculateStats();
        this.isLoading = false;

        if (!this.vendor) {
          this.errorMessage = 'Failed to load vendor profile. Please try again.';
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading data', err);
        this.errorMessage = 'Failed to load vendor data. Please check your connection and try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Calculate dashboard statistics
   */
  calculateStats(): void {
    this.stats = {
      totalPaymentsReceived: this.payments.length,
      pendingPayments: this.payments.filter(p => p.status === 'PENDING').length,
      completedPayments: this.payments.filter(p => p.status === 'COMPLETED').length,
      rejectedPayments: this.payments.filter(p => p.status === 'REJECTED').length,
      totalAmount: this.payments.reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: this.payments
        .filter(p => p.status === 'PENDING' || p.status === 'APPROVED' || p.status === 'PROCESSING')
        .reduce((sum, p) => sum + p.amount, 0),
      completedAmount: this.payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0)
    };
  }

  /**
   * Filter payments based on status and search term
   */
  filterPayments(): void {
    let filtered = [...this.payments];

    // Filter by status
    if (this.paymentFilter !== 'ALL') {
      filtered = filtered.filter(p => p.status === this.paymentFilter);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.paymentPurpose.toLowerCase().includes(term) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(term))
      );
    }

    this.filteredPayments = filtered;
  }

  /**
   * Get CSS class for payment status
   */
  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  /**
   * Mask account number for security (show last 4 digits)
   */
  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length < 4) return accountNumber;
    const lastFour = accountNumber.slice(-4);
    const masked = 'X'.repeat(accountNumber.length - 4);
    return masked + lastFour;
  }

  /**
   * Calculate total transaction amount
   */
  calculateTotalTransactionAmount(): number {
    return this.transactions.reduce((sum, txn) => sum + txn.amount, 0);
  }

  /**
   * Show rejection reason modal
   */
  showRejectionReason(payment: VendorPaymentResponseDto): void {
    this.selectedRejectionReason = payment.rejectionReason || 'No reason provided';
    this.showModal = true;
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedRejectionReason = '';
  }

  /**
   * Handle file selection for payment request
   */
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.showPaymentMessage('File size must be less than 5MB', 'error');
        return;
      }
      
      this.selectedFile = file;
    }
  }

  /**
   * Remove selected file
   */
  removeFile(): void {
    this.selectedFile = null;
  }

  /**
   * Check if payment form is valid
   */
  isPaymentFormValid(): boolean {
    return this.newPaymentRequest.amount > 0 &&
           this.newPaymentRequest.paymentPurpose.trim() !== '' &&
           this.newPaymentRequest.paymentMode !== null;
  }

  /**
   * Submit payment request
   */
  submitPaymentRequest(): void {
    if (!this.isPaymentFormValid()) {
      this.showPaymentMessage('Please fill in all required fields', 'error');
      return;
    }

    this.isSubmittingPayment = true;
    
    // Assuming orgAdminId is 1 (in production, get from organization data)
    const orgAdminId = 1;
    
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.newPaymentRequest));
    
    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }

    this.http.post<VendorPaymentResponseDto>(
      `${this.apiUrl}/${orgAdminId}/request-payment`,
      formData
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error submitting payment request', err);
        this.showPaymentMessage(
          err.error?.message || 'Failed to submit payment request. Please try again.',
          'error'
        );
        this.isSubmittingPayment = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.showPaymentMessage('Payment request submitted successfully!', 'success');
        
        // Add new payment to the list
        this.payments.unshift(response);
        this.filterPayments();
        
        // Refresh stats
        this.calculateStats();
        
        // Reset form
        this.resetPaymentForm();
        this.showPaymentForm = false;
      }
      this.isSubmittingPayment = false;
    });
  }

  /**
   * Reset payment form
   */
  resetPaymentForm(): void {
    this.newPaymentRequest = {
      vendorId: this.vendorId,
      amount: 0,
      paymentPurpose: '',
      paymentMode: 'NEFT'
    };
    this.selectedFile = null;
  }

  /**
   * Cancel payment form
   */
  cancelPaymentForm(): void {
    this.resetPaymentForm();
    this.showPaymentForm = false;
    this.paymentMessage = '';
  }

  /**
   * Show payment message
   */
  showPaymentMessage(message: string, type: 'success' | 'error'): void {
    this.paymentMessage = message;
    this.paymentMessageType = type;
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      this.paymentMessage = '';
    }, 5000);
  }
}