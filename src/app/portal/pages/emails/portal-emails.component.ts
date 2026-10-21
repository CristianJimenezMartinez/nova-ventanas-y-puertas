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

  // Campos para enviar un correo vinculado a expediente
  readonly selectedSenderEmail = signal<string>(this.store.emailAccounts()[0]?.emailAddress || '');
  readonly recipientName = signal<string>('Estudio Arquitectura Valcárcel SLP');
  readonly recipientEmail = signal<string>('estudio@valcarcelarquitectura.es');
  readonly linkedDocCode = signal<string>('PRE-2026-0192');
  readonly subject = signal<string>('Propuesta Técnica y Croquis UNE-EN 12519 · NOVA Ventanas & Puertas');
  readonly messageBody = signal<string>(
    'Estimado cliente,\n\nAdjuntamos la propuesta técnica detallada por huecos con croquis de mano de apertura vista desde el interior, especificaciones térmicas CTE DB-HE y desglose de acristalamiento.\n\nQuedamos a su disposición en nuestro Showroom de Molina de Segura.'
  );

  // Campos para añadir nueva cuenta SMTP/IMAP propia
  readonly newAlias = signal<string>('Showroom & Atención Arquitectos');
  readonly newEmailAddress = signal<string>('arquitectura@novaventanasypuertas.com');
  readonly newDepartment = signal<EmailAccountConfig['department']>('PRESUPUESTOS');
  readonly newSmtpHost = signal<string>('smtp.ionos.es');
  readonly newSmtpPort = signal<number>(587);
  readonly newImapHost = signal<string>('imap.ionos.es');
  readonly newImapPort = signal<number>(993);
  readonly newSignature = signal<string>('Departamento de Prescripción Arquitectónica · NOVA Ventanas & Puertas');

  applyTemplate(type: 'PRESUPUESTO' | 'ALMACEN' | 'FACTURA'): void {
    if (type === 'PRESUPUESTO') {
      this.selectedSenderEmail.set('presupuestos@novaventanasypuertas.com');
      this.subject.set('Dossier Técnico y Presupuesto por Huecos PRE-2026-0192 · NOVA');
      this.messageBody.set(
        'Adjuntamos la memoria técnica valorada con croquis vectorial UNE-EN 12519 por cada posición y cálculo de transmitancia térmica.'
      );
    } else if (type === 'ALMACEN') {
      this.selectedSenderEmail.set('compras@novaventanasypuertas.com');
      this.subject.set('Aviso de Material Completo en Almacén (Caballete Asignado) · PED-2026-0107');
      this.messageBody.set(
        'Le informamos que su pedido se encuentra 100% recepcionado y verificado en nuestro almacén del Pol. Ind. La Serreta, listo para recogida o planificación de montaje.'
      );
    } else {
      this.selectedSenderEmail.set('administracion@novaventanasypuertas.com');
      this.subject.set('Factura Oficial VeriFactu FAC-2026002 + Código QR AEAT · NOVA');
      this.messageBody.set(
        'Adjuntamos su factura oficial emitida con huella encadenada SHA-256 conforme al reglamento VeriFactu de la Agencia Tributaria.'
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
    this.feedbackMsg.set(`✓ Correo enviado desde ${this.selectedSenderEmail()} hacia ${this.recipientEmail()} y vinculado al expediente ${this.linkedDocCode()}.`);
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
    this.feedbackMsg.set(`✓ Nueva cuenta corporativa ${created.emailAddress} (${created.smtpHost}:${created.smtpPort}) verificada y activa.`);
  }
}
