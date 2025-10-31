// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
// import { trigger, transition, style, animate } from '@angular/animations';
// import { OtpVerificationComponent } from './otp.component/otp.component';
// import { AuthService, LoginRequest, LoginResponse } from '../services/auth';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RecaptchaModule, OtpVerificationComponent, RouterModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.scss'],
//   animations: [
//     trigger('fadeSlide', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(15px)' }),
//         animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
//       ]),
//       transition(':leave', [
//         animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
//       ])
//     ])
//   ]
// })
// export class LoginComponent implements OnInit {
//   // -------------------- LOGIN STATE --------------------
//   form: LoginRequest = { usernameOrEmail: '', password: '', captchaToken: '', otp: '' };
//   step: 'LOGIN' | 'OTP' = 'LOGIN';
//   loading = false;
//   error = '';
//   returnUrl: string = '/';

//   @ViewChild('captchaRef') recaptchaRef!: RecaptchaComponent;

//   // -------------------- FORGOT PASSWORD STATE --------------------
//   showForgotPassword = false;
//   reset = {
//     identifier: '',
//     otp: '',
//     newPassword: '',
//     step: 'REQUEST' as 'REQUEST' | 'OTP',
//     loading: false
//   };

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     const token = this.authService.getToken();
//     const role = this.authService.getUserRole();

//     if (token && role) {
//       this.redirectByRole(role);
//     }

//     // Capture return URL if redirected from a protected route
//     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
//   }

//   // -------------------- CAPTCHA --------------------
//   onCaptchaResolved(token: string | null) {
//     this.form.captchaToken = token || '';
//   }

//   // -------------------- LOGIN --------------------
//   // onSubmit() {
//   //   this.error = '';
//   //   this.showForgotPassword = false; // ✅ Ensure forgot password section is hidden

//   //   if (!this.form.usernameOrEmail || !this.form.password) {
//   //     this.error = 'Please enter your username/email and password.';
//   //     return;
//   //   }

//   //   if (!this.form.captchaToken) {
//   //     this.error = 'Please complete the CAPTCHA.';
//   //     return;
//   //   }

//   //   this.loading = true;

//   //   this.authService.login(this.form).subscribe({
//   //     next: (res: LoginResponse) => {
//   //       this.loading = false;

//   //       if (res.message === 'OTP_REQUIRED') {
//   //         this.step = 'OTP'; // ✅ Show login OTP screen
//   //         this.showForgotPassword = false; // Hide forgot password
//   //         this.resetCaptcha();
//   //         return;
//   //       }

//   //       if (res.message === 'LOGIN_SUCCESS' && res.jwtToken) {
//   //         localStorage.clear();
//   //         this.authService.saveSession(res);
//   //         this.redirectByRole(res.roleName, this.returnUrl);
//   //       } else {
//   //         this.error = 'Invalid login response or missing token.';
//   //         this.resetCaptcha();
//   //       }
//   //     },
//   //     error: (err) => {
//   //       this.loading = false;
//   //       this.error = err.error?.message || 'Login failed. Please try again.';
//   //       this.resetCaptcha();
//   //     }
//   //   });
//   // }

//   // Replace the onSubmit method in your LoginComponent

// onSubmit() {
//   this.error = '';
//   this.showForgotPassword = false;

//   if (!this.form.usernameOrEmail || !this.form.password) {
//     this.error = 'Please enter your username/email and password.';
//     return;
//   }

//   if (!this.form.captchaToken) {
//     this.error = 'Please complete the CAPTCHA.';
//     return;
//   }

//   this.loading = true;

//   this.authService.login(this.form).subscribe({
//     next: (res: LoginResponse) => {
//       this.loading = false;
//       console.log('📥 Login response received:', res);

//       if (res.message === 'OTP_REQUIRED') {
//         this.step = 'OTP';
//         this.showForgotPassword = false;
//         this.resetCaptcha();
//         return;
//       }

//       if (res.message === 'LOGIN_SUCCESS' && res.jwtToken) {
//         console.log('✅ Login successful, saving session...');
        
//         // Clear old data first
//         localStorage.clear();
        
//         // Save session data
//         try {
//           this.authService.saveSession(res);
//           console.log('✅ Session saved successfully');
          
//           // Verify data was saved (especially for org admin)
//           if (res.roleName?.toUpperCase() === 'ROLE_ORGANISATION_ADMIN') {
//             const savedOrgAdmin = localStorage.getItem('orgAdmin');
//             console.log('🔍 Verifying orgAdmin in localStorage:', savedOrgAdmin);
            
//             if (!savedOrgAdmin) {
//               console.error('❌ orgAdmin data not saved to localStorage!');
//               this.error = 'Session save failed. Please try again.';
//               return;
//             }
//           }
          
//           // Small delay to ensure localStorage is written
//           setTimeout(() => {
//             console.log('🚀 Redirecting to dashboard...');
//             this.redirectByRole(res.roleName, this.returnUrl);
//           }, 100);
          
//         } catch (error) {
//           console.error('❌ Error saving session:', error);
//           this.error = 'Failed to save session. Please try again.';
//           this.resetCaptcha();
//         }
//       } else {
//         this.error = 'Invalid login response or missing token.';
//         this.resetCaptcha();
//       }
//     },
//     error: (err) => {
//       this.loading = false;
//       console.error('❌ Login error:', err);
//       this.error = err.error?.message || 'Login failed. Please try again.';
//       this.resetCaptcha();
//     }
//   });
// }

//   resendOtp() {
//     if (!this.form.usernameOrEmail) {
//       this.error = 'Please enter your username or email first.';
//       return;
//     }

//     this.authService.resendOtp(this.form.usernameOrEmail).subscribe({
//       next: () => alert('OTP resent successfully.'),
//       error: () => alert('Failed to resend OTP. Please try again later.')
//     });
//   }

//   // -------------------- FORGOT PASSWORD --------------------
//   requestResetOtp() {
//     if (!this.reset.identifier) {
//       alert('Please enter your email or username.');
//       return;
//     }

//     this.reset.loading = true;
//     this.authService.requestPasswordReset(this.reset.identifier).subscribe({
//       next: (res) => {
//         this.reset.loading = false;
//         this.reset.step = 'OTP'; // ✅ Move to OTP step
//         alert(res?.message || 'OTP sent to your registered email.');
//       },
//       error: (err) => {
//         this.reset.loading = false;
//         alert(err.error?.message || 'Failed to send OTP.');
//       }
//     });
//   }

//   verifyAndResetPassword() {
//     if (!this.reset.identifier || !this.reset.otp || !this.reset.newPassword) {
//       alert('All fields are required.');
//       return;
//     }

//     this.reset.loading = true;
//     this.authService
//       .verifyResetOtpAndChangePassword(this.reset.identifier, this.reset.otp, this.reset.newPassword)
//       .subscribe({
//         next: (res) => {
//           this.reset.loading = false;
//           alert(res?.message || 'Password reset successful! Please log in again.');

//           // ✅ Reset everything and go back to login
//           this.showForgotPassword = false;
//           this.step = 'LOGIN';
//           this.reset = { identifier: '', otp: '', newPassword: '', step: 'REQUEST', loading: false };
//         },
//         error: (err) => {
//           this.reset.loading = false;
//           alert(err.error?.message || 'Failed to reset password.');
//         }
//       });
//   }

//   // -------------------- CAPTCHA RESET --------------------
//   resetCaptcha() {
//     this.form.captchaToken = '';
//     try {
//       if (this.recaptchaRef) {
//         this.recaptchaRef.reset();
//         setTimeout(() => {
//           const iframe = document.querySelector('iframe[title="reCAPTCHA"]') as HTMLElement;
//           iframe?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }, 300);
//       }
//     } catch (e) {
//       console.warn('Captcha reset failed:', e);
//     }
//   }



// // -------------------- REDIRECT BASED ON ROLE --------------------
// private redirectByRole(roleName?: string, returnUrl?: string) {
//   const role = roleName?.toUpperCase();

//   switch (role) {
//     case 'ROLE_SUPER_ADMIN':
//       this.router.navigate(['/super-admin/dashboard']);
//       break;

//     case 'ROLE_BANK':
//       this.router.navigate(['/bank']);
//       break;

//     case 'ROLE_ORGANISATION':
//       this.router.navigate(['/organisation/dashboard']);
//       break;

//     case 'ROLE_BANK_ADMIN':
//       this.router.navigate(['/bank-admin/dashboard']);
//       break;

//     case 'ROLE_ORGANISATION_ADMIN':  // ✅ FIXED: Changed from ORGANIZATION to ORGANISATION
//       this.router.navigate(['/org-admin/dashboard']);
//       break;

//     case 'ROLE_EMPLOYEE':
//       this.router.navigate(['/employee/dashboard']);
//       break;

//     default:
//       this.router.navigate(['/login']);
//       break;
//   }
// }
// } 


import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { trigger, transition, style, animate } from '@angular/animations';
import { OtpVerificationComponent } from './otp.component/otp.component';
import { AuthService, LoginRequest, LoginResponse } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule, OtpVerificationComponent, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  form: LoginRequest = { usernameOrEmail: '', password: '', captchaToken: '', otp: '' };
  step: 'LOGIN' | 'OTP' = 'LOGIN';
  loading = false;
  error = '';
  returnUrl: string = '/';

  @ViewChild('captchaRef') recaptchaRef!: RecaptchaComponent;

  // Forgot Password
  showForgotPassword = false;
  reset = {
    identifier: '',
    otp: '',
    newPassword: '',
    step: 'REQUEST' as 'REQUEST' | 'OTP',
    loading: false
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const role = this.authService.getUserRole();

    if (token && role) {
      console.log('🔐 Existing session detected. Redirecting by role:', role);
      this.redirectByRole(role);
    }

    // Capture return URL if redirected from a protected route
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // ---------------- CAPTCHA ----------------
  onCaptchaResolved(token: string | null) {
    this.form.captchaToken = token || '';
  }

  // ---------------- LOGIN ----------------
  onSubmit() {
    this.error = '';
    this.showForgotPassword = false;

    if (!this.form.usernameOrEmail || !this.form.password) {
      this.error = 'Please enter your username/email and password.';
      return;
    }

    if (!this.form.captchaToken) {
      this.error = 'Please complete the CAPTCHA.';
      return;
    }

    this.loading = true;

    this.authService.login(this.form).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;
        console.log('📥 Login response received:', res);

        // OTP Step
        if (res.message === 'OTP_REQUIRED') {
          this.step = 'OTP';
          this.showForgotPassword = false;
          this.resetCaptcha();
          return;
        }

        // Successful login
        if (res.message === 'LOGIN_SUCCESS' && res.jwtToken) {
          console.log('✅ Login successful, saving session...');
          localStorage.clear();

          try {
            this.authService.saveSession(res);
            console.log('✅ Session saved successfully:', {
              token: this.authService.getToken(),
              role: this.authService.getUserRole()
            });

            // Ensure localStorage is written before guard check
            setTimeout(() => {
              console.log('🚀 Redirecting by role...');
              this.redirectByRole(res.roleName, this.returnUrl);
            }, 300);
          } catch (error) {
            console.error('❌ Error saving session:', error);
            this.error = 'Failed to save session. Please try again.';
            this.resetCaptcha();
          }
        } else {
          this.error = 'Invalid login response or missing token.';
          this.resetCaptcha();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Login error:', err);
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.resetCaptcha();
      }
    });
  }

  // ---------------- RESEND OTP ----------------
  resendOtp() {
    if (!this.form.usernameOrEmail) {
      this.error = 'Please enter your username or email first.';
      return;
    }

    this.authService.resendOtp(this.form.usernameOrEmail).subscribe({
      next: () => alert('OTP resent successfully.'),
      error: () => alert('Failed to resend OTP. Please try again later.')
    });
  }

  // ---------------- FORGOT PASSWORD ----------------
  requestResetOtp() {
    if (!this.reset.identifier) {
      alert('Please enter your email or username.');
      return;
    }

    this.reset.loading = true;
    this.authService.requestPasswordReset(this.reset.identifier).subscribe({
      next: (res) => {
        this.reset.loading = false;
        this.reset.step = 'OTP';
        alert(res?.message || 'OTP sent to your registered email.');
      },
      error: (err) => {
        this.reset.loading = false;
        alert(err.error?.message || 'Failed to send OTP.');
      }
    });
  }

  verifyAndResetPassword() {
    if (!this.reset.identifier || !this.reset.otp || !this.reset.newPassword) {
      alert('All fields are required.');
      return;
    }

    this.reset.loading = true;
    this.authService
      .verifyResetOtpAndChangePassword(this.reset.identifier, this.reset.otp, this.reset.newPassword)
      .subscribe({
        next: (res) => {
          this.reset.loading = false;
          alert(res?.message || 'Password reset successful! Please log in again.');

          this.showForgotPassword = false;
          this.step = 'LOGIN';
          this.reset = { identifier: '', otp: '', newPassword: '', step: 'REQUEST', loading: false };
        },
        error: (err) => {
          this.reset.loading = false;
          alert(err.error?.message || 'Failed to reset password.');
        }
      });
  }

  // ---------------- CAPTCHA RESET ----------------
  resetCaptcha() {
    this.form.captchaToken = '';
    try {
      if (this.recaptchaRef) {
        this.recaptchaRef.reset();
        setTimeout(() => {
          const iframe = document.querySelector('iframe[title="reCAPTCHA"]') as HTMLElement;
          iframe?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } catch (e) {
      console.warn('Captcha reset failed:', e);
    }
  }

  // ---------------- REDIRECT BY ROLE ----------------
  private redirectByRole(roleName?: string, returnUrl?: string) {
    const role = roleName?.toUpperCase();

    console.log('🎭 Redirecting based on role:', role);

    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        this.router.navigate(['/super-admin/dashboard']);
        break;

      case 'ROLE_BANK':
        this.router.navigate(['/bank']);
        break;

      case 'ROLE_ORGANISATION':
        this.router.navigate(['/organisation/dashboard']);
        break;

      case 'ROLE_BANK_ADMIN':
        this.router.navigate(['/bank-admin/dashboard']);
        break;

      case 'ROLE_ORGANISATION_ADMIN':
        this.router.navigate(['/org-admin/dashboard']);
        break;

      case 'ROLE_EMPLOYEE':
        this.router.navigate(['/employee/dashboard']);
        break;

       case 'ROLE_VENDOR':
        this.router.navigate(['/vendor/dashboard']);
        break; 

      default:
        console.warn('⚠️ Unknown role, redirecting to login.');
        this.router.navigate(['/login']);
        break;
    }
  }
}


