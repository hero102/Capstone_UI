// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable, tap, switchMap } from 'rxjs';

// // 🔹 Request + Response interfaces
// export interface LoginRequest {
//   usernameOrEmail: string;
//   password: string;
//   captchaToken: string;
//   otp?: string;
// }

// export interface LoginResponse {
//   message: string;
//   jwtToken?: string;
//   roleName?: string;
//   username?: string;
//   employeeId?: number;
//   email?: string;
//   orgAdminId?: number;
//   organizationId?: number;
//   organizationName?: string;
//   bankAdminId?: number;
//   bankId?: number;
//   bankName?: string;
// }

// // ✅ Main Auth Service
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private baseUrl = 'http://localhost:8080/api/auth';

//   private TOKEN_KEY = 'token';
//   private ROLE_KEY = 'role';
//   private USERNAME_KEY = 'username';
//   private EMAIL_KEY = 'email';
//   private EMP_ID_KEY = 'employeeId';
//   private ORG_ID_KEY = 'organizationId';
//   private ORG_ADMIN_KEY = 'orgAdminId';

//   constructor(private http: HttpClient, private router: Router) {}

//   // ✅ Login
//   login(data: LoginRequest): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
//   }

//   // ✅ Resend OTP
//   resendOtp(usernameOrEmail: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/resend-otp`, null, { 
//       params: { identifier: usernameOrEmail } 
//     });
//   }

//   // ✅ Request password reset (send OTP to email)
//   requestPasswordReset(identifier: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/forgot-password/request`, { identifier });
//   }

//   // ✅ Verify OTP and reset password
//   verifyResetOtpAndChangePassword(identifier: string, otp: string, newPassword: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/forgot-password/verify`, {
//       identifier,
//       otp,
//       newPassword
//     });
//   }

//   // ✅ Save session data (after login success) - ENHANCED FOR ALL ROLES
//   saveSession(res: any) {
//   try {
//     const role = res.roleName?.toUpperCase();

//     // ✅ Common session storage for all users
//     localStorage.setItem('token', res.jwtToken);
//     localStorage.setItem('role', role);
//     localStorage.setItem('email', res.email);
//     localStorage.setItem('username', res.username);

//     // ✅ Organisation Admin
//     if (role?.includes('ORGANISATION_ADMIN') || role?.includes('ORGANIZATION_ADMIN')) {
//       const orgAdminData = {
//         orgAdminId: res.orgAdminId || 0,
//         organizationId: res.organizationId || 0,
//         organizationName: res.organizationName || 'Unknown',
//         name: res.username || 'Admin',
//         email: res.email || '',
//         status: 'ACTIVE'
//       };

//       if (res.orgAdminId && res.organizationId) {
//         localStorage.setItem('orgAdmin', JSON.stringify(orgAdminData));
//         localStorage.setItem(this.ORG_ADMIN_KEY, String(res.orgAdminId));
//         localStorage.setItem(this.ORG_ID_KEY, String(res.organizationId));
//         console.log('✅ OrgAdmin data saved in localStorage:', orgAdminData);
//       } else {
//         console.warn('⚠️ OrgAdmin data missing from backend response:', res);
//       }
//     }

//     // ✅ Employee Role
//     if (role?.includes('EMPLOYEE')) {
//       const empData = {
//         employeeId: res.employeeId || 0,
//         organizationId: res.organizationId || 0,
//         organizationName: res.organizationName || 'Unknown',
//         name: res.username || 'Employee',
//         email: res.email || '',
//         status: 'ACTIVE'
//       };

//       if (res.employeeId && res.organizationId) {
//         localStorage.setItem('employee', JSON.stringify(empData));
//         localStorage.setItem(this.EMP_ID_KEY, String(res.employeeId));
//         localStorage.setItem(this.ORG_ID_KEY, String(res.organizationId));
//         console.log('✅ Employee data saved in localStorage:', empData);
//       } else {
//         console.warn('⚠️ Employee data missing from backend response:', res);
//       }
//     }

//   } catch (error) {
//     console.error('❌ Error while saving session:', error);
//   }
// }



//   // ✅ Get stored JWT token
//   getToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   // ✅ Get stored role
//   getUserRole(): string | null {
//     return localStorage.getItem(this.ROLE_KEY);
//   }

//   // ✅ Get username
//   getUsername(): string | null {
//     return localStorage.getItem(this.USERNAME_KEY);
//   }

//   // ✅ Get employee ID
//   getEmployeeId(): number {
//     const id = localStorage.getItem(this.EMP_ID_KEY);
//     return id ? parseInt(id, 10) : 0;
//   }

//   // ✅ Get org admin ID
//   getOrgAdminId(): number {
//     const id = localStorage.getItem(this.ORG_ADMIN_KEY);
//     return id ? parseInt(id, 10) : 0;
//   }

//   // ✅ Get organization ID
//   getOrganizationId(): number {
//     const id = localStorage.getItem(this.ORG_ID_KEY);
//     return id ? parseInt(id, 10) : 0;
//   }

//   // ✅ Get org admin object (for org-admin dashboard)
//   getOrgAdmin(): any {
//     const data = localStorage.getItem('orgAdmin');
//     return data ? JSON.parse(data) : null;
//   }

//   // ✅ Get bank admin object (for bank-admin dashboard)
//   getBankAdmin(): any {
//     const data = localStorage.getItem('bankAdmin');
//     return data ? JSON.parse(data) : null;
//   }

//   // ✅ Logout (clear everything)
//   logout() {
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }

//   // ✅ Check if logged in
//   isLoggedIn(): boolean {
//     return !!localStorage.getItem(this.TOKEN_KEY);
//   }

//   // ✅ Fetch employee dashboard data by employee ID
// getEmployeeDashboard(empId: number) {
//   return this.http.get(`http://localhost:8080/api/employee/${empId}/dashboard`);
// }


//   // ✅ Fetch full org admin details after login (if backend doesn't return all data)
//   fetchOrgAdminDetails(orgAdminId: number): Observable<any> {
//     return this.http.get(`${this.baseUrl}/org-admin/${orgAdminId}`);
//   }

//   // ✅ Organization Admin Login (separate endpoint - optional)
//   orgAdminLogin(data: { email: string; password: string }): Observable<any> {
//     return this.http.post(`${this.baseUrl}/org-admin-login`, data).pipe(
//       tap((res: any) => {
//         console.log('🔐 Org Admin login response:', res);
        
//         // Store token and role
//         if (res.jwtToken) localStorage.setItem(this.TOKEN_KEY, res.jwtToken);
//         localStorage.setItem(this.ROLE_KEY, 'ROLE_ORGANISATION_ADMIN');
        
//         // Store complete org admin object
//         const orgAdminData = {
//           orgAdminId: res.orgAdminId,
//           organizationId: res.organizationId,
//           organizationName: res.organizationName,
//           name: res.name || res.username,
//           email: res.email,
//           status: res.status || 'ACTIVE',
//           assignedBankAdmin: res.assignedBankAdmin || ''
//         };
        
//         localStorage.setItem('orgAdmin', JSON.stringify(orgAdminData));
//         localStorage.setItem(this.ORG_ADMIN_KEY, String(res.orgAdminId));
//         localStorage.setItem(this.ORG_ID_KEY, String(res.organizationId));
//         localStorage.setItem(this.EMAIL_KEY, res.email);
        
//         console.log('✅ Org Admin data stored:', orgAdminData);
//       })
//     );
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

// 🔹 Request + Response interfaces
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  captchaToken: string;
  otp?: string;
}

export interface LoginResponse {
  message: string;
  jwtToken?: string;
  roleName?: string;
  username?: string;
  employeeId?: number;
  email?: string;
  orgAdminId?: number;
  organizationId?: number;
  organizationName?: string;
  bankAdminId?: number;
  bankId?: number;
  bankName?: string;
}

// ✅ Main Auth Service
@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  private TOKEN_KEY = 'token';
  private ROLE_KEY = 'role';
  private USERNAME_KEY = 'username';
  private EMAIL_KEY = 'email';
  private EMP_ID_KEY = 'employeeId';
  private ORG_ID_KEY = 'organizationId';
  private ORG_ADMIN_KEY = 'orgAdminId';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Login
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  // ✅ Resend OTP
  resendOtp(usernameOrEmail: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-otp`, null, {
      params: { identifier: usernameOrEmail },
    });
  }

  // ✅ Request password reset (send OTP to email)
  requestPasswordReset(identifier: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password/request`, {
      identifier,
    });
  }

  // ✅ Verify OTP and reset password
  verifyResetOtpAndChangePassword(
    identifier: string,
    otp: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password/verify`, {
      identifier,
      otp,
      newPassword,
    });
  }

  // ✅ Save session data (after login success)
  saveSession(res: any) {
    try {
      const role = res.roleName?.toUpperCase() || '';

      // ✅ Common session info
      if (res.jwtToken) {
        localStorage.setItem(this.TOKEN_KEY, res.jwtToken);
      }
      localStorage.setItem(this.ROLE_KEY, role);
      localStorage.setItem(this.EMAIL_KEY, res.email || '');
      localStorage.setItem(this.USERNAME_KEY, res.username || '');

      // ✅ Organization Admin
      if (role.includes('ORGANISATION_ADMIN') || role.includes('ORGANIZATION_ADMIN')) {
        const orgAdminData = {
          orgAdminId: res.orgAdminId || 0,
          organizationId: res.organizationId || 0,
          organizationName: res.organizationName || 'Unknown',
          name: res.username || 'Admin',
          email: res.email || '',
          status: 'ACTIVE',
        };

        if (res.orgAdminId && res.organizationId) {
          localStorage.setItem('orgAdmin', JSON.stringify(orgAdminData));
          localStorage.setItem(this.ORG_ADMIN_KEY, String(res.orgAdminId));
          localStorage.setItem(this.ORG_ID_KEY, String(res.organizationId));
          console.log('✅ OrgAdmin data saved in localStorage:', orgAdminData);
        } else {
          console.warn('⚠️ OrgAdmin data missing from backend response:', res);
        }
      }

      // ✅ Employee Role
      if (role === 'ROLE_EMPLOYEE' && res.employeeId) {
        const empData = {
          employeeId: res.employeeId || 0,
          organizationId: res.organizationId || 0,
          organizationName: res.organizationName || 'Unknown',
          name: res.username || 'Employee',
          email: res.email || '',
          status: 'ACTIVE',
        };

        localStorage.setItem('employee', JSON.stringify(empData));
        localStorage.setItem(this.EMP_ID_KEY, String(res.employeeId));
        localStorage.setItem(this.ORG_ID_KEY, String(res.organizationId));
        console.log('✅ Employee data saved in localStorage:', empData);

         // ✅ 🔥 BANK ADMIN ROLE — ADD THIS 🔥
    if (role === 'ROLE_BANK_ADMIN' && res.bankAdminId) {
      const bankAdminData = {
        bankAdminId: res.bankAdminId,
        bankId: res.bankId,
        bankName: res.bankName || 'Unknown Bank',
        name: res.username || 'Bank Admin',
        email: res.email,
        status: 'ACTIVE'
      };

      // ✅ Bank (ROLE_BANK) — if main bank login, not bank admin
if (role === 'ROLE_BANK' && res.bankId) {
  const bankData = {
    bankId: res.bankId,
    bankName: res.bankName || 'Unknown Bank',
    name: res.username || 'Bank',
    email: res.email,
    status: 'ACTIVE'
  };

  localStorage.setItem('bank', JSON.stringify(bankData));
  localStorage.setItem('bankId', String(res.bankId));
  console.log('✅ Bank data saved in localStorage:', bankData);
}


      // Save to localStorage
      localStorage.setItem('bankAdmin', JSON.stringify(bankAdminData));
      localStorage.setItem('bankAdminId', String(res.bankAdminId));
      localStorage.setItem('bankId', String(res.bankId));

      console.log('✅ BankAdmin data saved in localStorage:', bankAdminData);
    }
      }
    } catch (error) {
      console.error('❌ Error while saving session:', error);
    }
  }

  // ✅ Get stored JWT token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Get stored role
  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  // ✅ Get username
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  // ✅ Get employee ID
  getEmployeeId(): number {
    const id = localStorage.getItem(this.EMP_ID_KEY);
    return id ? parseInt(id, 10) : 0;
  }

  // ✅ Get org admin ID
  getOrgAdminId(): number {
    const id = localStorage.getItem(this.ORG_ADMIN_KEY);
    return id ? parseInt(id, 10) : 0;
  }

  // ✅ Get organization ID
  getOrganizationId(): number {
    const id = localStorage.getItem(this.ORG_ID_KEY);
    return id ? parseInt(id, 10) : 0;
  }

  // ✅ Get org admin object (for org-admin dashboard)
  getOrgAdmin(): any {
    const data = localStorage.getItem('orgAdmin');
    return data ? JSON.parse(data) : null;
  }

  // ✅ Get bank admin object (for bank-admin dashboard)
  getBankAdmin(): any {
    const data = localStorage.getItem('bankAdmin');
    return data ? JSON.parse(data) : null;
  }

  // ✅ Logout (clear everything)
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // ✅ Check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Fetch employee dashboard data by employee ID
  getEmployeeDashboard(empId: number) {
    return this.http.get(
      `http://localhost:8080/api/employees/${empId}/dashboard`
    );
  }

  // ✅ Fetch full org admin details after login
  fetchOrgAdminDetails(orgAdminId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/org-admin/${orgAdminId}`);
  }

  // ==================== CONCERNS MANAGEMENT ====================

// ✅ 1️⃣ Fetch all concerns for the organization admin
// ==================== CONCERNS MANAGEMENT ====================

// ✅ 1️⃣ Fetch all concerns for the organization admin
getOrganizationConcerns(orgAdminId: number): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:8080/api/concerns/organization/${orgAdminId}`);
}

// ✅ 2️⃣ Reply to a concern (Org Admin)
replyToConcern(replyData: {
  concernId: number;
  replyBy: string;
  replyMessage: string;
  newStatus?: string;
}): Observable<any> {
  return this.http.post<any>(`http://localhost:8080/api/concerns/reply`, replyData);
}



  // ✅ Organization Admin Login (optional separate endpoint)
  orgAdminLogin(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/org-admin-login`, data).pipe(
      tap((res: any) => {
        console.log('🔐 Org Admin login response:', res);

        // Store token and role
        if (res.jwtToken) localStorage.setItem(this.TOKEN_KEY, res.jwtToken);
        localStorage.setItem(this.ROLE_KEY, 'ROLE_ORGANISATION_ADMIN');

        // Store complete org admin object
        const orgAdminData = {
          orgAdminId: res.orgAdminId,
          organizationId: res.organizationId,
          organizationName: res.organizationName,
          name: res.name || res.username,
          email: res.email,
          status: res.status || 'ACTIVE',
          assignedBankAdmin: res.assignedBankAdmin || '',
        };

        localStorage.setItem('orgAdmin', JSON.stringify(orgAdminData));
        localStorage.setItem(this.ORG_ADMIN_KEY, String(res.orgAdminId));
        localStorage.setItem(this.ORG_ID_KEY, String(res.organizationId));
        localStorage.setItem(this.EMAIL_KEY, res.email);

        console.log('✅ Org Admin data stored:', orgAdminData);
      })
    );
  }
}
