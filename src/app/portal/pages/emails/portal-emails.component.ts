import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalStoreService } from '../../services/portal-store.service';
import { EmailAccountConfig } from '../../models/portal.models';

@Component({
  selector: 'app-portal-emails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-emails.component.html',
  styleUrls: ['./portal-emails.component.scss']
})
export class PortalEmailsComponent {
  readonly store = inject(PortalStoreService);

  readonly showNewAccountModal = signal<boolean>(false);
  readonly feedbackMsg = signal<string>('');

  // Autogestión exclusiva de cuentas de correo de la empresa/sede activa
  readonly selectedProviderPreset = signal<'IONOS' | 'GMAIL' | 'OUTLOOK' | 'OTRO'>('IONOS');
  readonly newAlias = signal<string>('');
  readonly newEmailAddress = signal<string>('');
  readonly newEmailPassword = signal<string>('');
  readonly newDepartment = signal<EmailAccountConfig['department']>('GENERAL');
  readonly newSmtpHost = signal<string>('smtp.ionos.es');
  readonly newSmtpPort = signal<number>(587);
  readonly newImapHost = signal<string>('imap.ionos.es');
  readonly newImapPort = signal<number>(993);

  applyProviderPreset(provider: 'IONOS' | 'GMAIL' | 'OUTLOOK' | 'OTRO'): void {
    this.selectedProviderPreset.set(provider);
    if (provider === 'IONOS') {
      this.newSmtpHost.set('smtp.ionos.es');
      this.newSmtpPort.set(587);
      this.newImapHost.set('imap.ionos.es');
      this.newImapPort.set(993);
    } else if (provider === 'GMAIL') {
      this.newSmtpHost.set('smtp.gmail.com');
      this.newSmtpPort.set(587);
      this.newImapHost.set('imap.gmail.com');
      this.newImapPort.set(993);
    } else if (provider === 'OUTLOOK') {
      this.newSmtpHost.set('smtp.office365.com');
      this.newSmtpPort.set(587);
      this.newImapHost.set('outlook.office365.com');
      this.newImapPort.set(993);
    }
  }

  saveNewEmailAccount(): void {
    const email = this.newEmailAddress().trim();
    if (!email) return;
    const created: EmailAccountConfig = {
      id: `mail-${Date.now()}`,
      aliasName: this.newAlias().trim() || this.store.security.activeTenant().commercialName,
      emailAddress: email,
      department: this.newDepartment(),
      smtpHost: this.newSmtpHost(),
      smtpPort: this.newSmtpPort(),
      imapHost: this.newImapHost(),
      imapPort: this.newImapPort(),
      useTls: true,
      status: 'CONECTADO_OK',
      signatureHtml: this.store.security.activeTenant().commercialName
    };
    this.store.addEmailAccount(created);
    this.newAlias.set('');
    this.newEmailAddress.set('');
    this.newEmailPassword.set('');
    this.showNewAccountModal.set(false);
    this.feedbackMsg.set(
      `✓ Correo ${created.emailAddress} guardado en ${this.store.security.activeTenant().commercialName}.`
    );
  }

  deleteEmailAccount(id: string): void {
    this.store.removeEmailAccount(id);
  }
}
