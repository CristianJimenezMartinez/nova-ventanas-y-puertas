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

  readonly selectedSenderEmail = signal<string>(
    this.store.emailAccounts()[0]?.emailAddress || 'gerencia@gruposoto.es'
  );
  readonly recipientName = signal<string>('');
  readonly recipientEmail = signal<string>('');
  readonly linkedDocCode = signal<string>('');
  readonly subject = signal<string>('');
  readonly messageBody = signal<string>('');

  // Autogestión sencilla de cuenta de correo para cada sede/franquicia
  readonly selectedProviderPreset = signal<'IONOS' | 'GMAIL' | 'OUTLOOK' | 'OTRO'>('IONOS');
  readonly newAlias = signal<string>('');
  readonly newEmailAddress = signal<string>('');
  readonly newEmailPassword = signal<string>('');
  readonly newDepartment = signal<EmailAccountConfig['department']>('GENERAL');
  readonly newSmtpHost = signal<string>('smtp.ionos.es');
  readonly newSmtpPort = signal<number>(587);
  readonly newImapHost = signal<string>('imap.ionos.es');
  readonly newImapPort = signal<number>(993);
  readonly newSignature = signal<string>('');

  constructor() {
    const draft = this.store.security.pendingEmailDraft();
    if (draft) {
      this.recipientName.set(draft.recipientName);
      this.recipientEmail.set(draft.recipientEmail);
      this.linkedDocCode.set(draft.linkedDocCode);
      this.subject.set(draft.subject);
      this.messageBody.set(draft.messageBody);
      this.feedbackMsg.set(
        `✓ Documento ${draft.linkedDocCode} cargado automáticamente listo para enviar a ${draft.recipientName}.`
      );
      this.store.security.pendingEmailDraft.set(null);
    }
  }

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

  applyTemplate(type: 'PRESUPUESTO' | 'ALMACEN' | 'FACTURA'): void {
    if (type === 'PRESUPUESTO') {
      this.subject.set(`Presupuesto ${this.linkedDocCode()} · NOVA Ventanas & Puertas`);
      this.messageBody.set(
        `Estimado/a ${this.recipientName()},\n\nLe enviamos adjunto el presupuesto ${this.linkedDocCode()} con el detalle de cada ventana y sus medidas.\n\nUn cordial saludo.`
      );
    } else if (type === 'ALMACEN') {
      this.subject.set(`Aviso de material disponible en almacén · Pedido ${this.linkedDocCode()}`);
      this.messageBody.set(
        `Estimado/a ${this.recipientName()},\n\nLe informamos de que el material de su pedido ${this.linkedDocCode()} ya se encuentra completo y revisado en nuestro almacén, listo para recogida o coordinación de montaje.`
      );
    } else {
      this.subject.set(`Factura ${this.linkedDocCode()} · NOVA Ventanas & Puertas`);
      this.messageBody.set(
        `Estimado/a ${this.recipientName()},\n\nAdjuntamos la factura oficial ${this.linkedDocCode()} correspondiente a su expediente.\n\nMuchas gracias por su confianza.`
      );
    }
  }

  sendTrackedMessage(): void {
    this.store.sendEmailMessage({
      folder: 'ENVIADOS',
      accountEmail: this.selectedSenderEmail(),
      counterpartEmail: this.recipientEmail(),
      counterpartName: this.recipientName(),
      subject: this.subject(),
      linkedDocumentCode: this.linkedDocCode(),
      snippet: this.messageBody().slice(0, 140) + '...'
    });
    this.feedbackMsg.set(
      `✓ Correo enviado desde ${this.selectedSenderEmail()} a ${this.recipientEmail()} (${this.linkedDocCode()}).`
    );
  }

  saveNewEmailAccount(): void {
    const created: EmailAccountConfig = {
      id: `mail-${Date.now()}`,
      aliasName: this.newAlias(),
      emailAddress: this.newEmailAddress(),
      department: this.newDepartment(),
      smtpHost: this.newSmtpHost(),
      smtpPort: this.newSmtpPort(),
      imapHost: this.newImapHost(),
      imapPort: this.newImapPort(),
      useTls: true,
      status: 'CONECTADO_OK',
      signatureHtml: this.newSignature()
    };
    this.store.addEmailAccount(created);
    this.selectedSenderEmail.set(created.emailAddress);
    this.showNewAccountModal.set(false);
    this.feedbackMsg.set(
      `✓ Cuenta ${created.emailAddress} conectada y guardada en esta sede (${this.store.security.activeTenant().commercialName}).`
    );
  }
}
