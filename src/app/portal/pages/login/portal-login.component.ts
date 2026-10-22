import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PortalStoreService } from '../../services/portal-store.service';

@Component({
  selector: 'app-portal-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-login.component.html',
  styleUrls: ['./portal-login.component.scss']
})
export class PortalLoginComponent {
  readonly store = inject(PortalStoreService);
  private readonly router = inject(Router);

  readonly email = signal<string>('gerencia@gruposoto.es');
  readonly password = signal<string>('Soto2026!Seguro');
  readonly errorMsg = signal<string>('');

  enterPortal(): void {
    this.errorMsg.set('');
    this.store.loginWithCredentials(this.email(), this.password(), (ok, role, err) => {
      if (!ok) {
        this.errorMsg.set(err || 'Credenciales incorrectas.');
        return;
      }
      this.router.navigate([role === 'ALMACEN_OBRA' ? '/portal/almacen' : '/portal/dashboard']);
    });
  }
}
