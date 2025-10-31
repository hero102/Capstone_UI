// // import { Component, OnInit } from '@angular/core';
// // import { HttpClient, HttpHeaders } from '@angular/common/http';
// // import { Router } from '@angular/router';
// // import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
// // import { FormsModule } from '@angular/forms';

// // interface OrganizationAdmin {
// //   orgAdminId: number;
// //   name: string;
// //   email: string;
// //   phoneNumber: string;
// //   designation: string;
// //   organizationName: string;
// //   organizationId: number;
// //   assignedBankAdmin: string;
// //   status: string;
// // }

// // interface Employee {
// //   employeeId: number;
// //   name: string;
// //   email: string;
// //   phoneNumber: string;
// //   designation: string;
// //   department: string;
// //   status: string;
// //   joiningDate: string;
// //   documentUrl: string;
// // }

// // interface Vendor {
// //   vendorId: number;
// //   vendorName: string;
// //   email: string;
// //   phoneNumber: string;
// //   address: string;
// //   gstNumber: string;
// //   panNumber: string;
// //   status: string;
// //   accountNumber: string;
// //   ifscCode: string;
// //   bankName: string;
// //   createdAt: string;
// // }

// // interface VendorPayment {
// //   paymentId: number;
// //   vendorName: string;
// //   amount: number;
// //   paymentPurpose: string;
// //   paymentMode: string;
// //   status: string;
// //   transactionId: string;
// //   requestedAt: string;
// //   approvedAt: string;
// // }

// // interface Salary {
// //   salaryId: number;
// //   employeeName: string;
// //   basicSalary: number;
// //   hra: number;
// //   allowances: number;
// //   deductions: number;
// //   netSalary: number;
// //   salaryMonth: string;
// //   disbursed: boolean;
// // }

// // interface DisbursementRequest {
// //   requestId: number;
// //   month: string;
// //   totalAmount: number;
// //   status: string;
// //   requestedAt: string;
// //   approvedAt: string;
// // }

// // interface CorporateAccount {
// //   accountNumber: string;
// //   bankName: string;
// //   branch: string;
// //   ifscCode: string;
// //   balance: number;
// //   status: string;
// // }

// // @Component({
// //   selector: 'app-org-admin',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
// //   templateUrl: './org-admin.html'
// // })
// // export class OrgAdminComponent implements OnInit {
// //   private apiUrl = 'http://localhost:8080/api';

// //   orgAdmin: OrganizationAdmin | null = null;
// //   activeTab = 'dashboard';

// //   // Dashboard Stats
// //   dashboardStats = {
// //     totalEmployees: 0,
// //     activeEmployees: 0,
// //     pendingEmployees: 0,
// //     totalVendors: 0,
// //     activeVendors: 0,
// //     pendingSalaries: 0,
// //     corporateBalance: 0
// //   };

// //   // Data Collections
// //   employees: Employee[] = [];
// //   pendingEmployees: Employee[] = [];
// //   vendors: Vendor[] = [];
// //   vendorPayments: VendorPayment[] = [];
// //   pendingPayments: VendorPayment[] = [];
// //   approvedPayments: VendorPayment[] = [];
// //   salaries: Salary[] = [];
// //   disbursementRequests: DisbursementRequest[] = [];
// //   corporateAccount: CorporateAccount | null = null;

// //   // Forms
// //   employeeForm = {
// //     name: '',
// //     email: '',
// //     phoneNumber: '',
// //     designation: '',
// //     department: '',
// //     document: null as File | null
// //   };

// //   vendorForm = {
// //     vendorName: '',
// //     email: '',
// //     phoneNumber: '',
// //     address: '',
// //     gstNumber: '',
// //     panNumber: '',
// //     accountNumber: '',
// //     ifscCode: '',
// //     bankName: '',
// //     branch: ''
// //   };

// //   paymentForm = {
// //     vendorId: 0,
// //     amount: 0,
// //     paymentPurpose: '',
// //     paymentMode: 'BANK_TRANSFER'
// //   };

// //   salaryForm = {
// //     employeeId: 0,
// //     basicSalary: 0,
// //     hra: 0,
// //     allowances: 0,
// //     deductions: 0
// //   };

// //   generateSalaryMonth = '';

// //   // UI States
// //   loading = false;
// //   message = '';
// //   messageType: 'success' | 'error' | 'info' = 'info';
// //   showEmployeeForm = false;
// //   showVendorForm = false;
// //   showPaymentForm = false;
// //   showSalaryForm = false;
// //   selectedVendor: Vendor | null = null;
// //   selectedEmployee: Employee | null = null;

// //   constructor(private http: HttpClient, public router: Router) {}

// //   // ngOnInit(): void {
// //   //   this.loadOrgAdminData();
// //   // }

// //   // // ==================== INITIAL LOAD ====================

// //   // loadOrgAdminData(): void {
// //   //   const adminData = localStorage.getItem('orgAdmin');
// //   //   if (adminData) {
// //   //     this.orgAdmin = JSON.parse(adminData);
// //   //     if (!this.orgAdmin?.orgAdminId) {
// //   //       console.error('❌ orgAdminId missing in localStorage:', this.orgAdmin);
// //   //       return;
// //   //     }
// //   //     this.loadDashboardData();
// //   //   } else {
// //   //     this.router.navigate(['/login']);
// //   //   }
// //   // }

// //   // Update only the ngOnInit and loadOrgAdminData methods in your existing component
// // // Update only the ngOnInit and loadOrgAdminData methods in your existing component

// // ngOnInit(): void {
// //   this.loadOrgAdminData();
// // }

// // // ✅ FIXED: Load org admin data from localStorage
// // loadOrgAdminData(): void {
// //   console.log('🔍 Loading org admin data...');
// //   console.log('🔍 All localStorage keys:', Object.keys(localStorage));
// //   console.log('🔍 localStorage content:', {
// //     orgAdmin: localStorage.getItem('orgAdmin'),
// //     token: localStorage.getItem('token'),
// //     role: localStorage.getItem('role'),
// //     email: localStorage.getItem('email')
// //   });

// //   // Try to get org admin data from localStorage
// //   const orgAdminStr = localStorage.getItem('orgAdmin');
  
// //   if (orgAdminStr) {
// //     try {
// //       this.orgAdmin = JSON.parse(orgAdminStr);
// //       console.log('📦 Parsed org admin data:', this.orgAdmin);
      
// //       // Validate required fields
// //       if (!this.orgAdmin?.orgAdminId || !this.orgAdmin?.organizationId) {
// //         console.error('❌ Invalid org admin data - missing required fields:', this.orgAdmin);
// //         console.error('❌ orgAdminId:', this.orgAdmin?.orgAdminId);
// //         console.error('❌ organizationId:', this.orgAdmin?.organizationId);
// //         this.showMessage('Session data corrupted. Please login again.', 'error');
// //         setTimeout(() => this.router.navigate(['/login']), 2000);
// //         return;
// //       }
      
// //       console.log('✅ Org admin data validated successfully:', this.orgAdmin);
// //       this.loadDashboardData();
// //     } catch (e) {
// //       console.error('❌ Failed to parse org admin data:', e);
// //       console.error('❌ Raw data:', orgAdminStr);
// //       this.showMessage('Session error. Please login again.', 'error');
// //       setTimeout(() => this.router.navigate(['/login']), 2000);
// //     }
// //   } else {
// //     console.error('❌ No org admin data found in localStorage');
// //     console.error('❌ Available keys:', Object.keys(localStorage));
// //     this.showMessage('Session expired. Please login again.', 'error');
// //     setTimeout(() => this.router.navigate(['/login']), 2000);
// //   }
// // }

// //   loadDashboardData(): void {
// //     this.loadEmployees();
// //     this.loadVendors();
// //     this.loadVendorPayments();
// //     this.loadSalaries();
// //     this.loadDisbursementRequests();
// //     this.loadCorporateAccount();
// //   }

// //   // ==================== EMPLOYEES ====================

// //   loadEmployees(): void {
// //     if (!this.orgAdmin) return;

// //     this.http.get<Employee[]>(
// //       `${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/admin/${this.orgAdmin.orgAdminId}/employees`
// //     ).subscribe({
// //       next: (data) => {
// //         this.employees = data;
// //         this.pendingEmployees = data.filter(e => e.status === 'PENDING_APPROVAL');
// //         this.dashboardStats.totalEmployees = data.length;
// //         this.dashboardStats.activeEmployees = data.filter(e => e.status === 'ACTIVE').length;
// //         this.dashboardStats.pendingEmployees = this.pendingEmployees.length;
// //       },
// //       error: (err) => console.error('Failed to load employees', err)
// //     });
// //   }

// //   addEmployee(): void {
// //     if (!this.orgAdmin) return;
// //     if (!this.employeeForm.name || !this.employeeForm.email || !this.employeeForm.designation) {
// //       this.showMessage('Please fill all required employee fields', 'error');
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('data', JSON.stringify(this.employeeForm));
// //     if (this.employeeForm.document) {
// //       formData.append('document', this.employeeForm.document);
// //     }

// //     this.loading = true;
// //     this.http.post(
// //       `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/add-employee`,
// //       formData
// //     ).subscribe({
// //       next: () => {
// //         this.showMessage('Employee added successfully', 'success');
// //         this.resetEmployeeForm();
// //         this.loadEmployees();
// //       },
// //       error: (err) => this.showMessage(err.error?.message || 'Failed to add employee', 'error')
// //     }).add(() => this.loading = false);
// //   }

// //  onFileSelect(event: any, type: 'employee' | 'vendor' = 'employee'): void {
// //   if (event.target.files.length > 0) {
// //     if (type === 'employee') {
// //       this.employeeForm.document = event.target.files[0];
// //     }
// //   }

// //   }

// //   resetEmployeeForm(): void {
// //     this.employeeForm = {
// //       name: '',
// //       email: '',
// //       phoneNumber: '',
// //       designation: '',
// //       department: '',
// //       document: null
// //     };
// //     this.showEmployeeForm = false;
// //   }

// //   // ==================== VENDORS ====================

// //   loadVendors(): void {
// //     if (!this.orgAdmin) return;

// //     this.http.get<Vendor[]>(`${this.apiUrl}/vendors/organization/${this.orgAdmin.organizationId}`)
// //       .subscribe({
// //         next: (data) => {
// //           this.vendors = data;
// //           this.dashboardStats.totalVendors = data.length;
// //           this.dashboardStats.activeVendors = data.filter(v => v.status === 'ACTIVE').length;
// //         },
// //         error: (err) => console.error('Failed to load vendors', err)
// //       });
// //   }

// //   addVendor(): void {
// //     if (!this.orgAdmin) return;

// //     if (!this.vendorForm.vendorName || !this.vendorForm.email || !this.vendorForm.accountNumber) {
// //       this.showMessage('Please fill all vendor details', 'error');
// //       return;
// //     }

// //     this.loading = true;
// //     this.http.post(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/add`, this.vendorForm)
// //       .subscribe({
// //         next: () => {
// //           this.showMessage('Vendor added successfully', 'success');
// //           this.resetVendorForm();
// //           this.loadVendors();
// //         },
// //         error: (err) => this.showMessage(err.error?.message || 'Failed to add vendor', 'error')
// //       }).add(() => this.loading = false);
// //   }

// //   resetVendorForm(): void {
// //     this.vendorForm = {
// //       vendorName: '',
// //       email: '',
// //       phoneNumber: '',
// //       address: '',
// //       gstNumber: '',
// //       panNumber: '',
// //       accountNumber: '',
// //       ifscCode: '',
// //       bankName: '',
// //       branch: ''
// //     };
// //     this.showVendorForm = false;
// //   }

// //   deactivateVendor(vendorId: number): void {
// //     if (!this.orgAdmin || !confirm('Deactivate this vendor?')) return;
// //     const reason = prompt('Enter deactivation reason:');
// //     if (!reason) return;

// //     this.http.put(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/deactivate/${vendorId}`, reason,
// //       { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
// //       .subscribe({
// //         next: () => { this.showMessage('Vendor deactivated', 'success'); this.loadVendors(); },
// //         error: () => this.showMessage('Failed to deactivate vendor', 'error')
// //       });
// //   }

// //   reactivateVendor(vendorId: number): void {
// //     if (!this.orgAdmin) return;
// //     this.http.put(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/reactivate/${vendorId}`, {})
// //       .subscribe({
// //         next: () => { this.showMessage('Vendor reactivated', 'success'); this.loadVendors(); },
// //         error: () => this.showMessage('Failed to reactivate vendor', 'error')
// //       });
// //   }

// //   deleteVendor(vendorId: number): void {
// //     if (!this.orgAdmin || !confirm('Are you sure you want to delete this vendor?')) return;
// //     this.http.delete(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/delete/${vendorId}`)
// //       .subscribe({
// //         next: () => { this.showMessage('Vendor deleted', 'success'); this.loadVendors(); },
// //         error: () => this.showMessage('Failed to delete vendor', 'error')
// //       });
// //   }

// //   // ==================== VENDOR PAYMENTS ====================

// //   loadVendorPayments(): void {
// //     if (!this.orgAdmin) return;
// //     this.http.get<VendorPayment[]>(`${this.apiUrl}/vendors/payments/${this.orgAdmin.organizationId}`)
// //       .subscribe({
// //         next: (data) => {
// //           this.vendorPayments = data;
// //           this.pendingPayments = data.filter(p => p.status === 'PENDING');
// //           this.approvedPayments = data.filter(p => p.status === 'COMPLETED');
// //         },
// //         error: (err) => console.error('Failed to load vendor payments', err)
// //       });
// //   }

// //   openPaymentForm(vendor: Vendor): void {
// //     this.selectedVendor = vendor;
// //     this.paymentForm = {
// //       vendorId: vendor.vendorId,
// //       amount: 0,
// //       paymentPurpose: '',
// //       paymentMode: 'BANK_TRANSFER'
// //     };
// //     this.showPaymentForm = true;
// //   }

// //   requestVendorPayment(): void {
// //     if (!this.orgAdmin) return;

// //     if (!this.paymentForm.amount || this.paymentForm.amount <= 0) {
// //       this.showMessage('Invalid amount', 'error');
// //       return;
// //     }

// //     this.http.post(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/request-payment`, this.paymentForm)
// //       .subscribe({
// //         next: () => {
// //           this.showMessage('Payment request sent', 'success');
// //           this.resetPaymentForm();
// //           this.loadVendorPayments();
// //         },
// //         error: (err) => this.showMessage(err.error?.message || 'Failed to request payment', 'error')
// //       });
// //   }

// //   resetPaymentForm(): void {
// //     this.paymentForm = {
// //       vendorId: 0,
// //       amount: 0,
// //       paymentPurpose: '',
// //       paymentMode: 'BANK_TRANSFER'
// //     };
// //     this.showPaymentForm = false;
// //     this.selectedVendor = null;
// //   }

// //   // ==================== SALARIES ====================

// //   loadSalaries(): void {
// //     if (!this.orgAdmin) return;
// //     this.http.get<Salary[]>(`${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/salaries`)
// //       .subscribe({
// //         next: (data) => {
// //           this.salaries = data;
// //           this.dashboardStats.pendingSalaries = data.filter(s => !s.disbursed).length;
// //         },
// //         error: (err) => console.error('Failed to load salaries', err)
// //       });
// //   }

// //   openSalaryForm(employee: Employee): void {
// //     this.selectedEmployee = employee;
// //     this.salaryForm = {
// //       employeeId: employee.employeeId,
// //       basicSalary: 0,
// //       hra: 0,
// //       allowances: 0,
// //       deductions: 0
// //     };
// //     this.showSalaryForm = true;
// //   }

// //   createSalary(): void {
// //     if (!this.orgAdmin || !this.selectedEmployee) return;
// //     this.http.post(
// //       `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/employee/${this.salaryForm.employeeId}/create-salary`,
// //       this.salaryForm
// //     ).subscribe({
// //       next: () => { this.showMessage('Salary created', 'success'); this.loadSalaries(); this.resetSalaryForm(); },
// //       error: (err) => this.showMessage(err.error?.message || 'Failed to create salary', 'error')
// //     });
// //   }

// //   generateMonthlySalaries(): void {
// //     if (!this.orgAdmin || !this.generateSalaryMonth) return;
// //     this.http.post(
// //       `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/generate-salaries?month=${this.generateSalaryMonth}`,
// //       {}
// //     ).subscribe({
// //       next: (res: any) => this.showMessage(`Generated ${res.length} salaries`, 'success'),
// //       error: (err) => this.showMessage(err.error?.message || 'Failed to generate salaries', 'error')
// //     });
// //   }

// //   resetSalaryForm(): void {
// //     this.salaryForm = {
// //       employeeId: 0,
// //       basicSalary: 0,
// //       hra: 0,
// //       allowances: 0,
// //       deductions: 0
// //     };
// //     this.showSalaryForm = false;
// //     this.selectedEmployee = null;
// //   }

// //   // ==================== DISBURSEMENTS ====================

// //   loadDisbursementRequests(): void {
// //     if (!this.orgAdmin) return;
// //     this.http.get<DisbursementRequest[]>(`${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/disbursements`)
// //       .subscribe({
// //         next: (data) => this.disbursementRequests = data,
// //         error: (err) => console.error('Failed to load disbursement requests', err)
// //       });
// //   }

// //   requestSalaryDisbursement(): void {
// //     if (!this.orgAdmin) return;
// //     const month = prompt('Enter month for disbursement (YYYY-MM-01):');
// //     if (!month) return;

// //     this.http.post(`${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/request-disbursement?month=${month}`, {})
// //       .subscribe({
// //         next: () => { this.showMessage('Disbursement requested', 'success'); this.loadDisbursementRequests(); },
// //         error: (err) => this.showMessage(err.error?.message || 'Failed to request disbursement', 'error')
// //       });
// //   }

// //   // ==================== CORPORATE ACCOUNT ====================

// //   loadCorporateAccount(): void {
// //     if (!this.orgAdmin) return;
// //     this.http.get<CorporateAccount>(`${this.apiUrl}/corporate-accounts/organization/${this.orgAdmin.organizationId}`)
// //       .subscribe({
// //         next: (data) => {
// //           this.corporateAccount = data;
// //           this.dashboardStats.corporateBalance = data.balance;
// //         },
// //         error: (err) => console.error('Failed to load corporate account', err)
// //       });
// //   }

// //   // ==================== UTILITIES ====================

// //   setActiveTab(tab: string): void {
// //     this.activeTab = tab;
// //   }

// //   showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
// //     this.message = msg;
// //     this.messageType = type;
// //     setTimeout(() => this.message = '', 5000);
// //   }

// //   logout(): void {
// //     localStorage.removeItem('orgAdmin');
// //     this.router.navigate(['/login']);
// //   }
// // }


// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface OrganizationAdmin {
//   orgAdminId: number;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   designation: string;
//   organizationName: string;
//   organizationId: number;
//   assignedBankAdmin: string;
//   status: string;
// }

// interface Employee {
//   employeeId: number;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   designation: string;
//   department: string;
//   status: string;
//   joiningDate: string;
//   documentUrl: string;
//   bankAccount?: any; // Add bank account info
// }

// interface Vendor {
//   vendorId: number;
//   vendorName: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
//   gstNumber: string;
//   panNumber: string;
//   status: string;
//   accountNumber: string;
//   ifscCode: string;
//   bankName: string;
//   createdAt: string;
// }

// interface VendorPayment {
//   paymentId: number;
//   vendorName: string;
//   amount: number;
//   paymentPurpose: string;
//   paymentMode: string;
//   status: string;
//   transactionId: string;
//   requestedAt: string;
//   approvedAt: string;
// }

// interface Salary {
//   salaryId: number;
//   employeeName: string;
//   basicSalary: number;
//   hra: number;
//   allowances: number;
//   deductions: number;
//   netSalary: number;
//   salaryMonth: string;
//   disbursed: boolean;
// }

// interface DisbursementRequest {
//   requestId: number;
//   month: string;
//   totalAmount: number;
//   status: string;
//   requestedAt: string;
//   approvedAt: string;
// }

// interface CorporateAccount {
//   accountNumber: string;
//   bankName: string;
//   branch: string;
//   ifscCode: string;
//   balance: number;
//   status: string;
// }

// @Component({
//   selector: 'app-org-admin',
//   standalone: true,
//   imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
//   templateUrl: './org-admin.html'
// })
// export class OrgAdminComponent implements OnInit {
//   private apiUrl = 'http://localhost:8080/api';

//   orgAdmin: OrganizationAdmin | null = null;
//   activeTab = 'dashboard';

//   // Dashboard Stats
//   dashboardStats = {
//     totalEmployees: 0,
//     activeEmployees: 0,
//     pendingEmployees: 0,
//     totalVendors: 0,
//     activeVendors: 0,
//     pendingSalaries: 0,
//     corporateBalance: 0
//   };

//   // Data Collections
//   employees: Employee[] = [];
//   pendingEmployees: Employee[] = [];
//   vendors: Vendor[] = [];
//   vendorPayments: VendorPayment[] = [];
//   pendingPayments: VendorPayment[] = [];
//   approvedPayments: VendorPayment[] = [];
//   salaries: Salary[] = [];
//   disbursementRequests: DisbursementRequest[] = [];
//   corporateAccount: CorporateAccount | null = null;

//   // Forms
//   employeeForm = {
//     name: '',
//     email: '',
//     phoneNumber: '',
//     designation: '',
//     department: '',
//     document: null as File | null
//   };

//   // ✅ NEW: Bank Account Form
//   bankAccountForm = {
//     bankName: '',
//     branch: '',
//     ifscCode: '',
//     accountNumber: ''
//   };

//   vendorForm = {
//     vendorName: '',
//     email: '',
//     phoneNumber: '',
//     address: '',
//     gstNumber: '',
//     panNumber: '',
//     accountNumber: '',
//     ifscCode: '',
//     bankName: '',
//     branch: ''
//   };

//   paymentForm = {
//     vendorId: 0,
//     amount: 0,
//     paymentPurpose: '',
//     paymentMode: 'BANK_TRANSFER'
//   };

//   salaryForm = {
//     employeeId: 0,
//     basicSalary: 0,
//     hra: 0,
//     allowances: 0,
//     deductions: 0
//   };

//   generateSalaryMonth = '';

//   // UI States
//   loading = false;
//   message = '';
//   messageType: 'success' | 'error' | 'info' = 'info';
//   showEmployeeForm = false;
//   showVendorForm = false;
//   showPaymentForm = false;
//   showSalaryForm = false;
//   showBankAccountForm = false; // ✅ NEW
//   selectedVendor: Vendor | null = null;
//   selectedEmployee: Employee | null = null;

//   constructor(private http: HttpClient, public router: Router) {}

//   ngOnInit(): void {
//     this.loadOrgAdminData();
//   }

//   // ✅ FIXED: Load org admin data from localStorage
//   loadOrgAdminData(): void {
//     console.log('🔍 Loading org admin data...');
//     console.log('🔍 All localStorage keys:', Object.keys(localStorage));
//     console.log('🔍 localStorage content:', {
//       orgAdmin: localStorage.getItem('orgAdmin'),
//       token: localStorage.getItem('token'),
//       role: localStorage.getItem('role'),
//       email: localStorage.getItem('email')
//     });

//     const orgAdminStr = localStorage.getItem('orgAdmin');
    
//     if (orgAdminStr) {
//       try {
//         this.orgAdmin = JSON.parse(orgAdminStr);
//         console.log('📦 Parsed org admin data:', this.orgAdmin);
        
//         if (!this.orgAdmin?.orgAdminId || !this.orgAdmin?.organizationId) {
//           console.error('❌ Invalid org admin data - missing required fields:', this.orgAdmin);
//           this.showMessage('Session data corrupted. Please login again.', 'error');
//           setTimeout(() => this.router.navigate(['/login']), 2000);
//           return;
//         }
        
//         console.log('✅ Org admin data validated successfully:', this.orgAdmin);
//         this.loadDashboardData();
//       } catch (e) {
//         console.error('❌ Failed to parse org admin data:', e);
//         this.showMessage('Session error. Please login again.', 'error');
//         setTimeout(() => this.router.navigate(['/login']), 2000);
//       }
//     } else {
//       console.error('❌ No org admin data found in localStorage');
//       this.showMessage('Session expired. Please login again.', 'error');
//       setTimeout(() => this.router.navigate(['/login']), 2000);
//     }
//   }

//   loadDashboardData(): void {
//     this.loadEmployees();
//     this.loadVendors();
//     this.loadVendorPayments();
//     this.loadSalaries();
//     this.loadDisbursementRequests();
//     this.loadCorporateAccount();
//   }

//   // ==================== EMPLOYEES ====================

//   loadEmployees(): void {
//     if (!this.orgAdmin) return;

//     this.http.get<Employee[]>(
//       `${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/admin/${this.orgAdmin.orgAdminId}/employees`
//     ).subscribe({
//       next: (data) => {
//         this.employees = data;
//         this.pendingEmployees = data.filter(e => e.status === 'PENDING_APPROVAL');
//         this.dashboardStats.totalEmployees = data.length;
//         this.dashboardStats.activeEmployees = data.filter(e => e.status === 'ACTIVE').length;
//         this.dashboardStats.pendingEmployees = this.pendingEmployees.length;
//       },
//       error: (err) => console.error('Failed to load employees', err)
//     });
//   }

//   addEmployee(): void {
//     if (!this.orgAdmin) return;
//     if (!this.employeeForm.name || !this.employeeForm.email || !this.employeeForm.designation) {
//       this.showMessage('Please fill all required employee fields', 'error');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('data', JSON.stringify(this.employeeForm));
//     if (this.employeeForm.document) {
//       formData.append('document', this.employeeForm.document);
//     }

//     this.loading = true;
//     this.http.post(
//       `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/add-employee`,
//       formData
//     ).subscribe({
//       next: () => {
//         this.showMessage('Employee added successfully', 'success');
//         this.resetEmployeeForm();
//         this.loadEmployees();
//       },
//       error: (err) => this.showMessage(err.error?.message || 'Failed to add employee', 'error')
//     }).add(() => this.loading = false);
//   }

//   // ✅ NEW: Open Bank Account Form
//   openBankAccountForm(employee: Employee): void {
//     this.selectedEmployee = employee;
//     this.bankAccountForm = {
//       bankName: '',
//       branch: '',
//       ifscCode: '',
//       accountNumber: ''
//     };
//     this.showBankAccountForm = true;
//   }

//   // ✅ NEW: Add Employee Bank Account
//   addEmployeeBankAccount(): void {
//     if (!this.orgAdmin || !this.selectedEmployee) return;

//     if (!this.bankAccountForm.bankName || !this.bankAccountForm.accountNumber || !this.bankAccountForm.ifscCode) {
//       this.showMessage('Please fill all required bank account fields', 'error');
//       return;
//     }

//     this.loading = true;
//     this.http.post(
//       `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/employee/${this.selectedEmployee.employeeId}/add-account`,
//       this.bankAccountForm
//     ).subscribe({
//       next: () => {
//         this.showMessage('Bank account added successfully', 'success');
//         this.resetBankAccountForm();
//         this.loadEmployees();
//       },
//       error: (err) => this.showMessage(err.error?.message || 'Failed to add bank account', 'error')
//     }).add(() => this.loading = false);
//   }

//   // ✅ NEW: Reset Bank Account Form
//   resetBankAccountForm(): void {
//     this.bankAccountForm = {
//       bankName: '',
//       branch: '',
//       ifscCode: '',
//       accountNumber: ''
//     };
//     this.showBankAccountForm = false;
//     this.selectedEmployee = null;
//   }

//   onFileSelect(event: any, type: 'employee' | 'vendor' = 'employee'): void {
//     if (event.target.files.length > 0) {
//       if (type === 'employee') {
//         this.employeeForm.document = event.target.files[0];
//       }
//     }
//   }

//   resetEmployeeForm(): void {
//     this.employeeForm = {
//       name: '',
//       email: '',
//       phoneNumber: '',
//       designation: '',
//       department: '',
//       document: null
//     };
//     this.showEmployeeForm = false;
//   }

//   // ==================== VENDORS ====================

//   loadVendors(): void {
//     if (!this.orgAdmin) return;

//     this.http.get<Vendor[]>(`${this.apiUrl}/vendors/organization/${this.orgAdmin.organizationId}`)
//       .subscribe({
//         next: (data) => {
//           this.vendors = data;
//           this.dashboardStats.totalVendors = data.length;
//           this.dashboardStats.activeVendors = data.filter(v => v.status === 'ACTIVE').length;
//         },
//         error: (err) => console.error('Failed to load vendors', err)
//       });
//   }

//   addVendor(): void {
//     if (!this.orgAdmin) return;

//     if (!this.vendorForm.vendorName || !this.vendorForm.email || !this.vendorForm.accountNumber) {
//       this.showMessage('Please fill all vendor details', 'error');
//       return;
//     }

//     this.loading = true;
//     this.http.post(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/add`, this.vendorForm)
//       .subscribe({
//         next: () => {
//           this.showMessage('Vendor added successfully', 'success');
//           this.resetVendorForm();
//           this.loadVendors();
//         },
//         error: (err) => this.showMessage(err.error?.message || 'Failed to add vendor', 'error')
//       }).add(() => this.loading = false);
//   }

//   resetVendorForm(): void {
//     this.vendorForm = {
//       vendorName: '',
//       email: '',
//       phoneNumber: '',
//       address: '',
//       gstNumber: '',
//       panNumber: '',
//       accountNumber: '',
//       ifscCode: '',
//       bankName: '',
//       branch: ''
//     };
//     this.showVendorForm = false;
//   }

//   deactivateVendor(vendorId: number): void {
//     if (!this.orgAdmin || !confirm('Deactivate this vendor?')) return;
//     const reason = prompt('Enter deactivation reason:');
//     if (!reason) return;

//     this.http.put(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/deactivate/${vendorId}`, reason,
//       { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
//       .subscribe({
//         next: () => { this.showMessage('Vendor deactivated', 'success'); this.loadVendors(); },
//         error: () => this.showMessage('Failed to deactivate vendor', 'error')
//       });
//   }

//   reactivateVendor(vendorId: number): void {
//     if (!this.orgAdmin) return;
//     this.http.put(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/reactivate/${vendorId}`, {})
//       .subscribe({
//         next: () => { this.showMessage('Vendor reactivated', 'success'); this.loadVendors(); },
//         error: () => this.showMessage('Failed to reactivate vendor', 'error')
//       });
//   }

//   deleteVendor(vendorId: number): void {
//     if (!this.orgAdmin || !confirm('Are you sure you want to delete this vendor?')) return;
//     this.http.delete(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/delete/${vendorId}`)
//       .subscribe({
//         next: () => { this.showMessage('Vendor deleted', 'success'); this.loadVendors(); },
//         error: () => this.showMessage('Failed to delete vendor', 'error')
//       });
//   }

//   // ==================== VENDOR PAYMENTS ====================

//   loadVendorPayments(): void {
//     if (!this.orgAdmin) return;
//     this.http.get<VendorPayment[]>(`${this.apiUrl}/vendors/payments/${this.orgAdmin.organizationId}`)
//       .subscribe({
//         next: (data) => {
//           this.vendorPayments = data;
//           this.pendingPayments = data.filter(p => p.status === 'PENDING');
//           this.approvedPayments = data.filter(p => p.status === 'COMPLETED');
//         },
//         error: (err) => console.error('Failed to load vendor payments', err)
//       });
//   }

//   openPaymentForm(vendor: Vendor): void {
//     this.selectedVendor = vendor;
//     this.paymentForm = {
//       vendorId: vendor.vendorId,
//       amount: 0,
//       paymentPurpose: '',
//       paymentMode: 'BANK_TRANSFER'
//     };
//     this.showPaymentForm = true;
//   }

//   requestVendorPayment(): void {
//     if (!this.orgAdmin) return;

//     if (!this.paymentForm.amount || this.paymentForm.amount <= 0) {
//       this.showMessage('Invalid amount', 'error');
//       return;
//     }

//     this.http.post(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/request-payment`, this.paymentForm)
//       .subscribe({
//         next: () => {
//           this.showMessage('Payment request sent', 'success');
//           this.resetPaymentForm();
//           this.loadVendorPayments();
//         },
//         error: (err) => this.showMessage(err.error?.message || 'Failed to request payment', 'error')
//       });
//   }

//   resetPaymentForm(): void {
//     this.paymentForm = {
//       vendorId: 0,
//       amount: 0,
//       paymentPurpose: '',
//       paymentMode: 'BANK_TRANSFER'
//     };
//     this.showPaymentForm = false;
//     this.selectedVendor = null;
//   }

//   // ==================== SALARIES ====================

//   loadSalaries(): void {
//     if (!this.orgAdmin) return;
//     this.http.get<Salary[]>(`${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/salaries`)
//       .subscribe({
//         next: (data) => {
//           this.salaries = data;
//           this.dashboardStats.pendingSalaries = data.filter(s => !s.disbursed).length;
//         },
//         error: (err) => console.error('Failed to load salaries', err)
//       });
//   }

//   openSalaryForm(employee: Employee): void {
//     this.selectedEmployee = employee;
//     this.salaryForm = {
//       employeeId: employee.employeeId,
//       basicSalary: 0,
//       hra: 0,
//       allowances: 0,
//       deductions: 0
//     };
//     this.showSalaryForm = true;
//   }

//   createSalary(): void {
//     if (!this.orgAdmin || !this.selectedEmployee) return;
    
//     if (this.salaryForm.basicSalary <= 0) {
//       this.showMessage('Basic salary must be greater than 0', 'error');
//       return;
//     }

//     this.loading = true;
//     this.http.post(
//       `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/employee/${this.salaryForm.employeeId}/create-salary`,
//       this.salaryForm
//     ).subscribe({
//       next: () => { 
//         this.showMessage('Salary created successfully', 'success'); 
//         this.loadSalaries(); 
//         this.resetSalaryForm(); 
//       },
//       error: (err) => this.showMessage(err.error?.message || 'Failed to create salary', 'error')
//     }).add(() => this.loading = false);
//   }

//   generateMonthlySalaries(): void {
//     if (!this.orgAdmin || !this.generateSalaryMonth) {
//       this.showMessage('Please select a month', 'error');
//       return;
//     }

//     // Convert YYYY-MM to YYYY-MM-01 format
//     const formattedMonth = this.generateSalaryMonth + '-01';

//     this.loading = true;
//     this.http.post(
//       `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/generate-salaries?month=${formattedMonth}`,
//       {}
//     ).subscribe({
//       next: (res: any) => {
//         this.showMessage(`Generated ${res.length} salaries successfully`, 'success');
//         this.loadSalaries();
//       },
//       error: (err) => this.showMessage(err.error?.message || 'Failed to generate salaries', 'error')
//     }).add(() => this.loading = false);
//   }

//   resetSalaryForm(): void {
//     this.salaryForm = {
//       employeeId: 0,
//       basicSalary: 0,
//       hra: 0,
//       allowances: 0,
//       deductions: 0
//     };
//     this.showSalaryForm = false;
//     this.selectedEmployee = null;
//   }

//   // ==================== DISBURSEMENTS ====================

//   loadDisbursementRequests(): void {
//     if (!this.orgAdmin) return;
//     this.http.get<DisbursementRequest[]>(`${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/disbursements`)
//       .subscribe({
//         next: (data) => this.disbursementRequests = data,
//         error: (err) => console.error('Failed to load disbursement requests', err)
//       });
//   }

//   requestSalaryDisbursement(): void {
//     if (!this.orgAdmin) return;
//     const month = prompt('Enter month for disbursement (YYYY-MM-01):');
//     if (!month) return;

//     this.loading = true;
//     this.http.post(`${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/request-disbursement?month=${month}`, {})
//       .subscribe({
//         next: () => { 
//           this.showMessage('Disbursement requested successfully', 'success'); 
//           this.loadDisbursementRequests(); 
//         },
//         error: (err) => this.showMessage(err.error?.message || 'Failed to request disbursement', 'error')
//       }).add(() => this.loading = false);
//   }

//   // ==================== CORPORATE ACCOUNT ====================

//   loadCorporateAccount(): void {
//     if (!this.orgAdmin) return;
//     this.http.get<CorporateAccount>(`${this.apiUrl}/corporate-accounts/organization/${this.orgAdmin.organizationId}`)
//       .subscribe({
//         next: (data) => {
//           this.corporateAccount = data;
//           this.dashboardStats.corporateBalance = data.balance;
//         },
//         error: (err) => console.error('Failed to load corporate account', err)
//       });
//   }

//   // ==================== UTILITIES ====================

//   setActiveTab(tab: string): void {
//     this.activeTab = tab;
//   }

//   showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
//     this.message = msg;
//     this.messageType = type;
//     setTimeout(() => this.message = '', 5000);
//   }

//   logout(): void {
//     localStorage.removeItem('orgAdmin');
//     this.router.navigate(['/login']);
//   }
// }


import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrganizationAdmin {
  orgAdminId: number;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  organizationName: string;
  organizationId: number;
  assignedBankAdmin: string;
  status: string;
}

// ✅ UPDATED: Employee interface with proper bank account structure
interface Employee {
  employeeId: number;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  status: string;
  joiningDate: string;
  documentUrl: string;
  bankAccount?: {
    accountId: number;
    bankName: string;
    branch: string;
    ifscCode: string;
    accountNumber: string;
    balance: number;
    status: string;
    isSameBank: boolean;
  };
}

interface Vendor {
  vendorId: number;
  vendorName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  status: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  createdAt: string;
}

interface VendorPayment {
  paymentId: number;
  vendorName: string;
  amount: number;
  paymentPurpose: string;
  paymentMode: string;
  status: string;
  transactionId: string;
  requestedAt: string;
  approvedAt: string;
}

interface Salary {
  salaryId: number;
  employeeName: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  salaryMonth: string;
  disbursed: boolean;
}

interface DisbursementRequest {
  requestId: number;
  month: string;
  totalAmount: number;
  status: string;
  requestedAt: string;
  approvedAt: string;
}

interface CorporateAccount {
  accountNumber: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  balance: number;
  status: string;
}

@Component({
  selector: 'app-org-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './org-admin.html'
})
export class OrgAdminComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api';

  orgAdmin: OrganizationAdmin | null = null;
  activeTab = 'dashboard';

  // Dashboard Stats
  dashboardStats = {
    totalEmployees: 0,
    activeEmployees: 0,
    pendingEmployees: 0,
    totalVendors: 0,
    activeVendors: 0,
    pendingSalaries: 0,
    corporateBalance: 0
  };

  // Data Collections
  employees: Employee[] = [];
  pendingEmployees: Employee[] = [];
  vendors: Vendor[] = [];
  vendorPayments: VendorPayment[] = [];
  pendingPayments: VendorPayment[] = [];
  approvedPayments: VendorPayment[] = [];
  salaries: Salary[] = [];
  disbursementRequests: DisbursementRequest[] = [];
  corporateAccount: CorporateAccount | null = null;

  // Forms
  employeeForm = {
    name: '',
    email: '',
    phoneNumber: '',
    designation: '',
    department: '',
    document: null as File | null
  };

  bankAccountForm = {
    bankName: '',
    branch: '',
    ifscCode: '',
    accountNumber: ''
  };

  vendorForm = {
    vendorName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gstNumber: '',
    panNumber: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: ''
  };

  paymentForm = {
    vendorId: 0,
    amount: 0,
    paymentPurpose: '',
    paymentMode: 'BANK_TRANSFER'
  };

  salaryForm = {
    employeeId: 0,
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0
  };

  generateSalaryMonth = '';

  // UI States
  loading = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  showEmployeeForm = false;
  showVendorForm = false;
  showPaymentForm = false;
  showSalaryForm = false;
  showBankAccountForm = false;
  selectedVendor: Vendor | null = null;
  selectedEmployee: Employee | null = null;

  constructor(private http: HttpClient, public router: Router) {}
maxMonth = '';



  ngOnInit(): void {
      this.setMaxMonth();
    this.loadOrgAdminData();
  }

  setMaxMonth(): void {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  this.maxMonth = `${year}-${month}`;
}

  // ✅ Load org admin data from localStorage
  loadOrgAdminData(): void {
    console.log('🔍 Loading org admin data...');
    const orgAdminStr = localStorage.getItem('orgAdmin');
    
    if (orgAdminStr) {
      try {
        this.orgAdmin = JSON.parse(orgAdminStr);
        console.log('📦 Parsed org admin data:', this.orgAdmin);
        
        if (!this.orgAdmin?.orgAdminId || !this.orgAdmin?.organizationId) {
          console.error('❌ Invalid org admin data');
          this.showMessage('Session data corrupted. Please login again.', 'error');
          setTimeout(() => this.router.navigate(['/login']), 2000);
          return;
        }
        
        console.log('✅ Org admin data validated successfully');
        this.loadDashboardData();
      } catch (e) {
        console.error('❌ Failed to parse org admin data:', e);
        this.showMessage('Session error. Please login again.', 'error');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    } else {
      console.error('❌ No org admin data found in localStorage');
      this.showMessage('Session expired. Please login again.', 'error');
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }
  }

  loadDashboardData(): void {
    this.loadEmployees();
    this.loadVendors();
    this.loadVendorPayments();
    this.loadSalaries();
    this.loadDisbursementRequests();
    this.loadCorporateAccount();
  }

  // ==================== EMPLOYEES ====================

  // ✅ UPDATED: Load employees with proper error handling and logging
  loadEmployees(): void {
    if (!this.orgAdmin) return;

    console.log('🔄 Loading employees for org:', this.orgAdmin.organizationId);

    this.http.get<Employee[]>(
      `${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/admin/${this.orgAdmin.orgAdminId}/employees`
    ).subscribe({
      next: (data) => {
        console.log('✅ Received employees data:', data);
        
        this.employees = data;
        this.pendingEmployees = data.filter(e => e.status === 'PENDING_APPROVAL');
        this.dashboardStats.totalEmployees = data.length;
        this.dashboardStats.activeEmployees = data.filter(e => e.status === 'ACTIVE').length;
        this.dashboardStats.pendingEmployees = this.pendingEmployees.length;
        
        // ✅ Log bank account status for debugging
        data.forEach(emp => {
          console.log(`Employee: ${emp.name}, Status: ${emp.status}, Has Bank Account: ${!!emp.bankAccount}, Bank Status: ${emp.bankAccount?.status || 'N/A'}`);
        });
      },
      error: (err) => {
        console.error('❌ Failed to load employees:', err);
        this.showMessage('Failed to load employees: ' + (err.error?.message || err.message), 'error');
      }
    });
  }

  addEmployee(): void {
    if (!this.orgAdmin) return;
    if (!this.employeeForm.name || !this.employeeForm.email || !this.employeeForm.designation) {
      this.showMessage('Please fill all required employee fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.employeeForm));
    if (this.employeeForm.document) {
      formData.append('document', this.employeeForm.document);
    }

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/add-employee`,
      formData
    ).subscribe({
      next: () => {
        this.showMessage('Employee added successfully', 'success');
        this.resetEmployeeForm();
        this.loadEmployees();
      },
      error: (err) => this.showMessage(err.error?.message || 'Failed to add employee', 'error')
    }).add(() => this.loading = false);
  }

  openBankAccountForm(employee: Employee): void {
    console.log('🏦 Opening bank account form for:', employee.name);
    this.selectedEmployee = employee;
    this.bankAccountForm = {
      bankName: '',
      branch: '',
      ifscCode: '',
      accountNumber: ''
    };
    this.showBankAccountForm = true;
  }

  // ✅ UPDATED: Add Employee Bank Account with better logging
  addEmployeeBankAccount(): void {
    if (!this.orgAdmin || !this.selectedEmployee) return;

    if (!this.bankAccountForm.bankName || !this.bankAccountForm.accountNumber || !this.bankAccountForm.ifscCode) {
      this.showMessage('Please fill all required bank account fields', 'error');
      return;
    }

    console.log('🏦 Adding bank account for employee:', this.selectedEmployee.employeeId);
    console.log('Bank form data:', this.bankAccountForm);

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/employee/${this.selectedEmployee.employeeId}/add-account`,
      this.bankAccountForm
    ).subscribe({
      next: (response: any) => {
        console.log('✅ Bank account added successfully:', response);
        this.showMessage('Bank account added successfully', 'success');
        this.resetBankAccountForm();
        setTimeout(() => this.loadEmployees(), 500); // ✅ Reload after short delay
      },
      error: (err) => {
        console.error('❌ Failed to add bank account:', err);
        this.showMessage(err.error?.message || 'Failed to add bank account', 'error');
      }
    }).add(() => this.loading = false);
  }

  resetBankAccountForm(): void {
    this.bankAccountForm = {
      bankName: '',
      branch: '',
      ifscCode: '',
      accountNumber: ''
    };
    this.showBankAccountForm = false;
    this.selectedEmployee = null;
  }

  onFileSelect(event: any, type: 'employee' | 'vendor' = 'employee'): void {
    if (event.target.files.length > 0) {
      if (type === 'employee') {
        this.employeeForm.document = event.target.files[0];
      }
    }
  }

  resetEmployeeForm(): void {
    this.employeeForm = {
      name: '',
      email: '',
      phoneNumber: '',
      designation: '',
      department: '',
      document: null
    };
    this.showEmployeeForm = false;
  }

  // ==================== VENDORS ====================

  loadVendors(): void {
    if (!this.orgAdmin) return;

    this.http.get<Vendor[]>(`${this.apiUrl}/vendors/organization/${this.orgAdmin.organizationId}`)
      .subscribe({
        next: (data) => {
          this.vendors = data;
          this.dashboardStats.totalVendors = data.length;
          this.dashboardStats.activeVendors = data.filter(v => v.status === 'ACTIVE').length;
        },
        error: (err) => console.error('Failed to load vendors', err)
      });
  }

  addVendor(): void {
    if (!this.orgAdmin) return;

    if (!this.vendorForm.vendorName || !this.vendorForm.email || !this.vendorForm.accountNumber) {
      this.showMessage('Please fill all vendor details', 'error');
      return;
    }

    this.loading = true;
    this.http.post(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/add`, this.vendorForm)
      .subscribe({
        next: () => {
          this.showMessage('Vendor added successfully', 'success');
          this.resetVendorForm();
          this.loadVendors();
        },
        error: (err) => this.showMessage(err.error?.message || 'Failed to add vendor', 'error')
      }).add(() => this.loading = false);
  }

  resetVendorForm(): void {
    this.vendorForm = {
      vendorName: '',
      email: '',
      phoneNumber: '',
      address: '',
      gstNumber: '',
      panNumber: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: ''
    };
    this.showVendorForm = false;
  }

  deactivateVendor(vendorId: number): void {
    if (!this.orgAdmin || !confirm('Deactivate this vendor?')) return;
    const reason = prompt('Enter deactivation reason:');
    if (!reason) return;

    this.http.put(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/deactivate/${vendorId}`, reason,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .subscribe({
        next: () => { this.showMessage('Vendor deactivated', 'success'); this.loadVendors(); },
        error: () => this.showMessage('Failed to deactivate vendor', 'error')
      });
  }

  reactivateVendor(vendorId: number): void {
    if (!this.orgAdmin) return;
    this.http.put(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/reactivate/${vendorId}`, {})
      .subscribe({
        next: () => { this.showMessage('Vendor reactivated', 'success'); this.loadVendors(); },
        error: () => this.showMessage('Failed to reactivate vendor', 'error')
      });
  }

  deleteVendor(vendorId: number): void {
    if (!this.orgAdmin || !confirm('Are you sure you want to delete this vendor?')) return;
    this.http.delete(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/delete/${vendorId}`)
      .subscribe({
        next: () => { this.showMessage('Vendor deleted', 'success'); this.loadVendors(); },
        error: () => this.showMessage('Failed to delete vendor', 'error')
      });
  }

  // ==================== VENDOR PAYMENTS ====================

  loadVendorPayments(): void {
    if (!this.orgAdmin) return;
    this.http.get<VendorPayment[]>(`${this.apiUrl}/vendors/payments/${this.orgAdmin.organizationId}`)
      .subscribe({
        next: (data) => {
          this.vendorPayments = data;
          this.pendingPayments = data.filter(p => p.status === 'PENDING');
          this.approvedPayments = data.filter(p => p.status === 'COMPLETED');
        },
        error: (err) => console.error('Failed to load vendor payments', err)
      });
  }

  openPaymentForm(vendor: Vendor): void {
    this.selectedVendor = vendor;
    this.paymentForm = {
      vendorId: vendor.vendorId,
      amount: 0,
      paymentPurpose: '',
      paymentMode: 'BANK_TRANSFER'
    };
    this.showPaymentForm = true;
  }

  requestVendorPayment(): void {
    if (!this.orgAdmin) return;

    if (!this.paymentForm.amount || this.paymentForm.amount <= 0) {
      this.showMessage('Invalid amount', 'error');
      return;
    }

    this.http.post(`${this.apiUrl}/vendors/${this.orgAdmin.orgAdminId}/request-payment`, this.paymentForm)
      .subscribe({
        next: () => {
          this.showMessage('Payment request sent', 'success');
          this.resetPaymentForm();
          this.loadVendorPayments();
        },
        error: (err) => this.showMessage(err.error?.message || 'Failed to request payment', 'error')
      });
  }

  resetPaymentForm(): void {
    this.paymentForm = {
      vendorId: 0,
      amount: 0,
      paymentPurpose: '',
      paymentMode: 'BANK_TRANSFER'
    };
    this.showPaymentForm = false;
    this.selectedVendor = null;
  }

  // ==================== SALARIES ====================

  loadSalaries(): void {
    if (!this.orgAdmin) return;
    this.http.get<Salary[]>(`${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/salaries`)
      .subscribe({
        next: (data) => {
          this.salaries = data;
          this.dashboardStats.pendingSalaries = data.filter(s => !s.disbursed).length;
        },
        error: (err) => console.error('Failed to load salaries', err)
      });
  }

  openSalaryForm(employee: Employee): void {
    console.log('💰 Opening salary form for:', employee.name);
    this.selectedEmployee = employee;
    this.salaryForm = {
      employeeId: employee.employeeId,
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      deductions: 0
    };
    this.showSalaryForm = true;
  }

  createSalary(): void {
    if (!this.orgAdmin || !this.selectedEmployee) return;
    
    if (this.salaryForm.basicSalary <= 0) {
      this.showMessage('Basic salary must be greater than 0', 'error');
      return;
    }

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/employee/${this.salaryForm.employeeId}/create-salary`,
      this.salaryForm
    ).subscribe({
      next: () => { 
        this.showMessage('Salary created successfully', 'success'); 
        this.loadSalaries(); 
        this.resetSalaryForm(); 
      },
      error: (err) => this.showMessage(err.error?.message || 'Failed to create salary', 'error')
    }).add(() => this.loading = false);
  }

  generateMonthlySalaries(): void {
    if (!this.orgAdmin || !this.generateSalaryMonth) {
      this.showMessage('Please select a month', 'error');
      return;
    }

    const formattedMonth = this.generateSalaryMonth + '-01';

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/generate-salaries?month=${formattedMonth}`,
      {}
    ).subscribe({
      next: (res: any) => {
        this.showMessage(`Generated ${res.length} salaries successfully`, 'success');
        this.loadSalaries();
      },
      error: (err) => this.showMessage(err.error?.message || 'Failed to generate salaries', 'error')
    }).add(() => this.loading = false);
  }

  resetSalaryForm(): void {
    this.salaryForm = {
      employeeId: 0,
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      deductions: 0
    };
    this.showSalaryForm = false;
    this.selectedEmployee = null;
  }

  // ==================== DISBURSEMENTS ====================

  loadDisbursementRequests(): void {
    if (!this.orgAdmin) return;
    this.http.get<DisbursementRequest[]>(`${this.apiUrl}/payroll/organization/${this.orgAdmin.organizationId}/disbursements`)
      .subscribe({
        next: (data) => this.disbursementRequests = data,
        error: (err) => console.error('Failed to load disbursement requests', err)
      });
  }

  requestSalaryDisbursement(): void {
    if (!this.orgAdmin) return;
    const month = prompt('Enter month for disbursement (YYYY-MM-01):');
    if (!month) return;

    this.loading = true;
    this.http.post(`${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/request-disbursement?month=${month}`, {})
      .subscribe({
        next: () => { 
          this.showMessage('Disbursement requested successfully', 'success'); 
          this.loadDisbursementRequests(); 
        },
        error: (err) => this.showMessage(err.error?.message || 'Failed to request disbursement', 'error')
      }).add(() => this.loading = false);
  }

  // ==================== CORPORATE ACCOUNT ====================

  loadCorporateAccount(): void {
    if (!this.orgAdmin) return;
    this.http.get<CorporateAccount>(`${this.apiUrl}/corporate-accounts/organization/${this.orgAdmin.organizationId}`)
      .subscribe({
        next: (data) => {
          this.corporateAccount = data;
          this.dashboardStats.corporateBalance = data.balance;
        },
        error: (err) => console.error('Failed to load corporate account', err)
      });
  }

  // ==================== UTILITIES ====================

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }

  // logout(): void {
  //   localStorage.removeItem('orgAdmin');
  //   this.router.navigate(['/login']);
  // }
  logout(): void {
  try {
    // Best-effort revoke/cleanup if you ever add a backend logout endpoint
    // const token = localStorage.getItem('token');
    // if (token) {
    //   this.http.post(`${this.apiUrl}/auth/logout`, {}, {
    //     headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    //   }).subscribe({ complete: () => {}, error: () => {} });
    // }

    // 1) Clear ALL client-side storage
    sessionStorage.clear();
    localStorage.clear();

    // 2) Navigate first (so Angular router state updates)…
    this.router.navigate(['/login']).then(() => {
      // …then hard-redirect to fully reset app state and cached in-memory data
      window.location.replace('/login');
    });
  } catch {
    // Fallback—still try to get the user out
    this.router.navigate(['/login']).then(() => window.location.replace('/login'));
  }
}

  // ✅ NEW: Helper methods for cleaner template logic
  canCreateSalary(employee: Employee): boolean {
    return (employee.status === 'APPROVED' || employee.status === 'ACTIVE') && 
           employee.bankAccount != null && 
           employee.bankAccount.status === 'APPROVED';
  }

  needsBankAccount(employee: Employee): boolean {
    return employee.status === 'APPROVED' && !employee.bankAccount;
  }

  isBankAccountPending(employee: Employee): boolean {
    return employee.bankAccount != null && 
           employee.bankAccount.status === 'PENDING_APPROVAL';
  }

  // Add this property to your component class
disbursementMonth = '';

// ✅ NEW: Updated method without prompt
requestSalaryDisbursementNew(): void {
  if (!this.orgAdmin || !this.disbursementMonth) {
    this.showMessage('Please select a month', 'error');
    return;
  }

  // Format: Convert "2025-09" to "2025-09-01"
  const formattedMonth = this.disbursementMonth + '-01';

  console.log('📤 Requesting disbursement for month:', formattedMonth);

  this.loading = true;
  this.http.post(
    `${this.apiUrl}/payroll/${this.orgAdmin.orgAdminId}/request-disbursement?month=${formattedMonth}`,
    {}
  ).subscribe({
    next: () => { 
      this.showMessage('Disbursement requested successfully', 'success'); 
      this.loadDisbursementRequests();
      this.disbursementMonth = ''; // Reset after success
    },
    error: (err) => {
      console.error('❌ Disbursement request failed:', err);
      this.showMessage(err.error?.message || 'Failed to request disbursement', 'error');
    }
  }).add(() => this.loading = false);
}

  getBankAccountBadgeClass(employee: Employee): string {
    if (!employee.bankAccount) return 'badge-danger';
    switch (employee.bankAccount.status) {
      case 'APPROVED': return 'badge-success';
      case 'PENDING_APPROVAL': return 'badge-warning';
      case 'REJECTED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getBankAccountStatusText(employee: Employee): string {
    if (!employee.bankAccount) return '❌ No Account';
    switch (employee.bankAccount.status) {
      case 'APPROVED': return '✅ Approved';
      case 'PENDING_APPROVAL': return '⏳ Pending';
      case 'REJECTED': return '❌ Rejected';
      default: return '❓ Unknown';
    }
  }
}