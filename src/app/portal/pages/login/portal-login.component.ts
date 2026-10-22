import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PortalStoreService } from '../../services/portal-store.service';
import { UserRole } from '../../models/portal.models';

@Component({
  selector: 'app-portal-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-login.component.html',
  styleUrls: ['./portal-login.component.scss']
})
export class PortalLoginComponent {
  readonly store = inject(PortalStoreService);
  private readonly router = inject(Router);

  readonly email = signal<string>('gerencia@gruposoto.es');
  readonly password = signal<string>('Soto2026!Seguro');
  readonly selectedRole = signal<UserRole>('SUPERADMIN');

  enterPortal(): void {
    this.store.loginWithCredentials(this.email(), this.selectedRole());
    this.router.navigate(['/portal/dashboard']);
  }

  quickRoleAccess(role: UserRole, email: string): void {
    this.email.set(email);
    this.selectedRole.set(role);
    this.store.loginWithCredentials(email, role);
    this.router.navigate(['/portal/dashboard']);
  }
}
