import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf,RouterModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  data: any = null;
  empId!: number;
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // ✅ Get employee ID from localStorage/session
    this.empId = this.auth.getEmployeeId();

    if (!this.empId || this.empId === 0) {
      console.error('❌ Employee ID not found in localStorage');
      this.errorMessage = 'Session expired or invalid login. Please log in again.';
      return;
    }

    console.log('✅ Employee ID found:', this.empId);

    // ✅ Fetch employee dashboard data
    this.loading = true;
    this.auth.getEmployeeDashboard(this.empId).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        console.log('✅ Employee dashboard data loaded:', res);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load employee dashboard.';
        console.error('❌ Error fetching employee dashboard:', err);
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}
