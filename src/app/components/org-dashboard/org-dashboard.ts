import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  OrganizationAdminService,
  OrganizationAdminResponseDto,
  OrganizationAdminRequestDto
} from './organization-admin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-org-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './org-dashboard.html',
  styleUrls: ['./org-dashboard.scss']
})
export class OrgDashboardComponent implements OnInit {
  // state
  activeSection: 'viewAdmins' | 'addAdmin' = 'viewAdmins';
  loading = true;
  message = '';
  messageType: 'info' | 'success' | 'error' = 'info';

  // org/admins
  organizationId!: number;
  admins: OrganizationAdminResponseDto[] = [];

  // form
  name = '';
  email = '';
  phoneNumber = '';
  designation = '';
  document?: File;

  constructor(private service: OrganizationAdminService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (!username) {
      this.setMessage('Username not found in localStorage', 'error');
      this.loading = false;
      return;
    }

    this.service.getOrganizationByUsername(username).subscribe({
      next: org => {
        this.organizationId = org.organizationId;
        this.loadAdmins();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.setMessage('Failed to fetch organization info.', 'error');
        this.loading = false;
      }
    });
  }

  setActiveSection(section: 'viewAdmins' | 'addAdmin') {
    this.activeSection = section;
    if (section === 'viewAdmins') {
      this.loadAdmins();
    }
  }

  // ---------- Data ----------
  loadAdmins(): void {
    if (!this.organizationId) return;

    this.loading = true;
    this.service.listAdmins(this.organizationId).subscribe({
      next: (admins: OrganizationAdminResponseDto[]) => {
        this.admins = admins ?? [];
        this.clearMessage();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.setMessage('Failed to load admins.', 'error');
      },
      complete: () => (this.loading = false)
    });
  }

  // ---------- Create ----------
  createAdmin(): void {
    if (!this.name || !this.email || !this.phoneNumber || !this.designation) {
      this.setMessage('Please fill all required fields.', 'error');
      return;
    }
    if (!this.organizationId) {
      this.setMessage('Organization not loaded yet.', 'error');
      return;
    }

    const dto: OrganizationAdminRequestDto = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      designation: this.designation
    };

    this.loading = true;
    this.service.createAdmin(this.organizationId, dto, this.document).subscribe({
      next: (admin: OrganizationAdminResponseDto) => {
        // add to list and switch to list view for immediate feedback
        this.admins = [admin, ...this.admins];
        this.setMessage('Admin created successfully!', 'success');
        this.resetForm();
        this.setActiveSection('viewAdmins');
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.setMessage(err.error?.message || 'Failed to create admin', 'error');
      },
      complete: () => (this.loading = false)
    });
  }

  // ---------- Deactivate / Reactivate ----------
  deactivateAdminWithPrompt(bankAdminId: number, orgAdminId: number): void {
    const reason = prompt('Enter reason for deactivation:');
    if (!reason || !reason.trim()) {
      this.setMessage('Deactivation cancelled or reason is empty.', 'info');
      return;
    }
    this.deactivateAdmin(bankAdminId, orgAdminId, reason.trim());
  }

  deactivateAdmin(bankAdminId: number, orgAdminId: number, reason: string): void {
    this.loading = true;
    this.service.deactivateAdmin(bankAdminId, orgAdminId, reason).subscribe({
      next: (res: string) => {
        this.setMessage(res || 'Admin deactivated.', 'success');
        this.loadAdmins();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.setMessage('Failed to deactivate admin', 'error');
        this.loading = false;
      }
    });
  }

  reactivateAdmin(bankAdminId: number, orgAdminId: number): void {
    this.loading = true;
    this.service.reactivateAdmin(bankAdminId, orgAdminId).subscribe({
      next: (res: string) => {
        this.setMessage(res || 'Admin reactivated.', 'success');
        this.loadAdmins();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.setMessage('Failed to reactivate admin', 'error');
        this.loading = false;
      }
    });
  }

  // ---------- Form helpers ----------
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.document = input.files[0];
    }
  }

  private resetForm(): void {
    this.name = '';
    this.email = '';
    this.phoneNumber = '';
    this.designation = '';
    this.document = undefined;
  }

  // ---------- Messaging ----------
  private setMessage(msg: string, type: 'info' | 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    // auto-clear after 5s
    setTimeout(() => this.clearMessage(), 5000);
  }
  private clearMessage() {
    this.message = '';
    this.messageType = 'info';
  }

  // ---------- Logout ----------
  logout(): void {
    try {
      sessionStorage.clear();
      localStorage.clear();
      // hard reload to reset any in-memory app state
      window.location.replace('/login');
    } catch {
      window.location.href = '/login';
    }
  }

  // ---------- UI helpers ----------
  statusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge badge-success';
      case 'DEACTIVATED':
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  }
}