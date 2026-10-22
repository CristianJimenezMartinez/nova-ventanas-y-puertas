import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'portal',
    loadComponent: () =>
      import('./portal/layout/portal-shell.component').then(m => m.PortalShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./portal/pages/dashboard/portal-dashboard.component').then(
            m => m.PortalDashboardComponent
          )
      },
      {
        path: 'catalogo',
        loadComponent: () =>
          import('./portal/pages/catalog/portal-catalog.component').then(
            m => m.PortalCatalogComponent
          )
      },
      {
        path: 'presupuestos',
        loadComponent: () =>
          import('./portal/pages/quotes/portal-quotes.component').then(
            m => m.PortalQuotesComponent
          )
      },
      {
        path: 'almacen',
        loadComponent: () =>
          import('./portal/pages/warehouse/portal-warehouse.component').then(
            m => m.PortalWarehouseComponent
          )
      },
      {
        path: 'facturacion',
        loadComponent: () =>
          import('./portal/pages/invoicing/portal-invoicing.component').then(
            m => m.PortalInvoicingComponent
          )
      },
      {
        path: 'correos',
        loadComponent: () =>
          import('./portal/pages/emails/portal-emails.component').then(
            m => m.PortalEmailsComponent
          )
      },
      {
        path: 'documentacion',
        loadComponent: () =>
          import('./portal/pages/docs/portal-docs.component').then(
            m => m.PortalDocsComponent
          )
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./portal/pages/login/portal-login.component').then(
            m => m.PortalLoginComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
