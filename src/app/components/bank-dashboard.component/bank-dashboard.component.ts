// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
// import { BankAdmin, BankService, Organization } from '../../services/Bank-Service/bank-service';


// @Component({
//   selector: 'app-bank-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './bank-dashboard.component.html',
//   styleUrls: ['./bank-dashboard.component.scss']
// })
// export class BankDashboardComponent implements OnInit {
//   passwordForm!: FormGroup;
//   adminForm!: FormGroup;
//   showPasswordForm = false;
//   showForm = false;
//   isEditing = false;
//   loading = false;

//   bankAdmins: BankAdmin[] = [];


//   selectedFile: File | null = null;
//   editingAdminId: number | null = null;
//   bankId = 1; // change to logged-in bank ID if dynamic

//   constructor(private fb: FormBuilder, private bankService: BankService) {}

//   ngOnInit(): void {
//     this.initForms();
//     this.loadData();
//   }

//   private initForms() {
//     this.passwordForm = this.fb.group({
//       oldPassword: ['', Validators.required],
//       newPassword: ['', [Validators.required, Validators.minLength(6)]],
//     });

//     this.adminForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
//     });
//   }

//   private loadData() {
//     this.loadBankAdmins();
//   }

//   loadBankAdmins() {
//     this.bankService.getAllBankAdmins(this.bankId).subscribe({
//       next: (data) => (this.bankAdmins = data),
//       error: (err) => console.error('Error loading bank admins:', err)
//     });
//   }

 

//   // 🔐 Password Update
//   onPasswordSubmit() {
//     if (this.passwordForm.invalid) return;
//     const { oldPassword, newPassword } = this.passwordForm.value;

//     this.bankService.updateBankPassword(this.bankId, oldPassword, newPassword).subscribe({
//       next: () => {
//         alert('Password updated successfully!');
//         this.passwordForm.reset();
//         this.showPasswordForm = false;
//       },
//       error: (err) => alert('Error updating password: ' + err)
//     });
//   }

//   // 🧾 File Change
//   onFileChange(event: any) {
//     const file = event.target.files?.[0];
//     if (file && file.size < 5 * 1024 * 1024) this.selectedFile = file;
//     else alert('File too large (max 5MB)');
//   }

//   // ➕ Add/Edit Admin
//   openAddForm() {
//     this.resetForm();
//     this.showForm = true;
//   }

//   editAdmin(admin: BankAdmin) {
//     this.adminForm.patchValue(admin);
//     this.isEditing = true;
//     this.editingAdminId = admin.bankAdminId || null;
//     this.showForm = true;
//   }

//   resetForm() {
//     this.adminForm.reset();
//     this.showForm = false;
//     this.isEditing = false;
//     this.editingAdminId = null;
//     this.selectedFile = null;
//   }

//   onSubmit() {
//     if (this.adminForm.invalid) return;

//     this.loading = true;
//     const data = this.adminForm.value;

//     const request$ = this.isEditing
//       ? this.bankService.updateBankAdmin(this.bankId, this.editingAdminId!, data, this.selectedFile!)
//       : this.bankService.addBankAdmin(this.bankId, data, this.selectedFile!);

//     request$.subscribe({
//       next: () => {
//         alert(this.isEditing ? 'Admin updated!' : 'Admin added!');
//           window.location.reload();
//         this.resetForm();
//       },
//       error: (err) => alert('Error saving admin: ' + err),
//       complete: () => (this.loading = false)
//     });
//   }

//   // 🗑 Delete Admin
//   deleteAdmin(adminId: number) {
//     if (confirm('Are you sure you want to delete this admin?')) {
//       this.bankService.deleteBankAdmin(this.bankId, adminId).subscribe({
//         next: () => {
//           alert('Admin deleted successfully');
//           this.loadBankAdmins();
//           window.location.reload();
//         },
//         error: (err) => alert('Error deleting admin: ' + err)
//       });
//     }
//   }

//   // 🚪 Logout
//   logout() {
//     localStorage.clear();
//     window.location.href = '/login';
//   }
// }

// src/app/components/Bank-Admin-component/bank-dashboard/bank-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

interface BankAdmin {
  bankAdminId?: number;
  name: string;
  email: string;
  phoneNumber: string;
  status?: string;
  bankName?: string;
  documentUrl?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.scss']
})
export class BankDashboardComponent implements OnInit {

  // 🎯 Forms & States
  adminForm!: FormGroup;
  showForm = false;
  isEditing = false;
  loading = false;
  bankAdmins: BankAdmin[] = [];
  selectedFile: File | null = null;
  editingAdminId: number | null = null;
  
  // 🏦 Bank Info
  bankInfo: any = null;
  bankId = 1; // Replace with dynamic ID from localStorage

  // 📊 Dashboard Stats
  dashboard = {
    activeBanks: 0,
    pendingBanks: 0,
    totalAdmins: 0,
    totalOrganizations: 0,
    totalDisbursed: 0,
    monthlyGrowth: 0
  };

  // 📋 Data Lists
  pendingBanks: any[] = [];
  activeBanks: any[] = [];
  recentActivities: any[] = [];
  
  // 🔄 View Toggle
  currentView: 'overview' | 'admins' | 'banks' = 'overview';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

           // ✅ holds dynamic bank ID
bankName!: string;           // ✅ holds bank name (e.g. "State Bank of India")
bankAdminId!: number;        // ✅ logged-in admin ID
email!: string;              // ✅ logged-in admin email
username!: string;           // (optional) if you use username elsewhere

  ngOnInit(): void {
    this.loadBankInfo();
    this.initForms();
    this.loadDashboardData();
  }

  // 🏦 Load Bank Info from localStorage
  loadBankInfo() {
    const bankData = localStorage.getItem('bankAdmin');
    if (bankData) {
      this.bankInfo = JSON.parse(bankData);
      this.bankId = this.bankInfo.bankId;
    }
  }

  // 🧾 Initialize Form
  private initForms() {
    this.adminForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  // 📊 Load All Dashboard Data
  loadDashboardData() {
    this.loading = true;
    
    forkJoin({
      banks: this.http.get<any[]>('http://localhost:8080/api/banks/all'),
     admins: this.http.get<any[]>(`http://localhost:8080/api/bank-admins/bank/${this.bankId}`),

      organizations: this.http.get<any[]>('http://localhost:8080/api/organizations/all')
    }).subscribe({
      next: ({ banks, admins, organizations }) => {
        // Calculate stats
        this.dashboard.activeBanks = banks.filter(b => b.approvalStatus === 'APPROVED').length;
        this.pendingBanks = banks.filter(b => b.approvalStatus === 'PENDING');
        this.dashboard.pendingBanks = this.pendingBanks.length;
        this.dashboard.totalAdmins = admins.length;
        this.dashboard.totalOrganizations = organizations.length;
        this.dashboard.totalDisbursed = this.dashboard.activeBanks * 5000000;
        this.dashboard.monthlyGrowth = 12.5; // Mock percentage

        // Active banks ranking
        this.activeBanks = banks
          .filter(b => b.approvalStatus === 'APPROVED')
          .slice(0, 5)
          .map((b, i) => ({
            rank: i + 1,
            bankName: b.bankName,
            totalProcessed: Math.floor(Math.random() * 10000000) + 5000000,
            growth: (Math.random() * 20).toFixed(1)
          }));

        // Recent activities (mock data)
        this.recentActivities = [
          { icon: '✅', text: 'New bank approved: HDFC Bank', time: '2 hours ago', type: 'success' },
          { icon: '👤', text: 'Bank admin added: John Doe', time: '5 hours ago', type: 'info' },
          { icon: '🏢', text: 'Organization registered: Tech Corp', time: '1 day ago', type: 'info' },
          { icon: '💰', text: 'Disbursement completed: ₹50L', time: '2 days ago', type: 'success' },
          { icon: '❌', text: 'Bank rejected: ABC Bank', time: '3 days ago', type: 'danger' }
        ];

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });

    this.loadBankAdmins();
  }

  // 🧩 Load Bank Admins
  loadBankAdmins() {
    this.http.get<BankAdmin[]>(`http://localhost:8080/api/bank-admins/bank/${this.bankId}`).subscribe({
      next: (data) => this.bankAdmins = data,
      error: (err) => console.error('Error loading bank admins:', err)
    });
    const bankData = localStorage.getItem('bankAdmin');
  if (bankData) {
    this.bankInfo = JSON.parse(bankData);
    this.bankId = this.bankInfo.bankId;
    console.log('✅ Bank Info Loaded:', this.bankInfo);
  } else {
    console.warn('⚠️ No bank info found in localStorage');
  }
  }

  // 🔄 View Switching
  switchView(view: 'overview' | 'admins' | 'banks') {
    this.currentView = view;
  }

  // 🏦 Bank Actions
  approveBank(bank: any) {
    if (!confirm(`Approve ${bank.bankName}?`)) return;
    
    this.http.put(`http://localhost:8080/api/banks/approve/${bank.bankId}`, {}).subscribe({
      next: () => {
        this.showNotification('✅ Bank approved successfully', 'success');
        this.loadDashboardData();
      },
      error: (err) => this.showNotification(err.error?.message || 'Approval failed', 'error')
    });
  }

  rejectBank(bank: any) {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    this.http.put(`http://localhost:8080/api/banks/reject/${bank.bankId}`, reason, {
      headers: { 'Content-Type': 'text/plain' }
    }).subscribe({
      next: () => {
        this.showNotification('❌ Bank rejected', 'success');
        this.loadDashboardData();
      },
      error: (err) => this.showNotification(err.error?.message || 'Rejection failed', 'error')
    });
  }

  // 👤 Admin Management
  openAddForm() {
    this.resetForm();
    this.showForm = true;
  }

  editAdmin(admin: BankAdmin) {
    this.adminForm.patchValue(admin);
    this.isEditing = true;
    this.editingAdminId = admin.bankAdminId || null;
    this.showForm = true;
  }

  resetForm() {
    this.adminForm.reset();
    this.showForm = false;
    this.isEditing = false;
    this.editingAdminId = null;
    this.selectedFile = null;
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size < 5 * 1024 * 1024) {
        this.selectedFile = file;
      } else {
        this.showNotification('File too large (max 5MB)', 'error');
      }
    }
  }

  onSubmit() {
    if (this.adminForm.invalid) {
      this.showNotification('Please fill all required fields', 'error');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    
    const dto = {
      name: this.adminForm.value.name,
      email: this.adminForm.value.email,
      phoneNumber: this.adminForm.value.phoneNumber
    };

    formData.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    
    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }

    const url = this.isEditing
      ? `http://localhost:8080/api/bank-admins/update/${this.bankId}/${this.editingAdminId}`
      : `http://localhost:8080/api/bank-admins/${this.bankId}/create`;

    this.http.post(url, formData).subscribe({
      next: () => {
        this.showNotification(
          this.isEditing ? '✅ Admin updated successfully' : '✅ Admin added successfully',
          'success'
        );
        this.resetForm();
        this.loadBankAdmins();
        this.loadDashboardData();
      },
      error: (err) => {
        this.showNotification(err.error?.message || 'Operation failed', 'error');
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

  deleteAdmin(adminId: number) {
    if (!confirm('Delete this admin? This action cannot be undone.')) return;
    
    this.http.delete(`http://localhost:8080/api/bank-admins/delete/${this.bankId}/${adminId}`).subscribe({
      next: () => {
        this.showNotification('🗑️ Admin deleted successfully', 'success');
        this.loadBankAdmins();
      },
      error: (err) => this.showNotification('Error deleting admin', 'error')
    });
  }

  // 🔔 Notification System
  private showNotification(message: string, type: 'success' | 'error' | 'info') {
    // Simple alert for now - can be replaced with toast notification
    alert(message);
  }

  // 🎨 Format Numbers
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-IN').format(num);
  }

  // 🚪 Logout
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      this.router.navigate(['/bank-admin/login']);
    }
  }
}