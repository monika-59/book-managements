// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookFormComponent } from './components/book-form/book-form.component';
// import { ImportExportComponent } from './components/import-export/import-export.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-book', component: BookFormComponent },
  { path: 'edit-book/:id', component: BookFormComponent },
  // { path: 'import-export', component: ImportExportComponent },
  { path: '**', redirectTo: '/dashboard' },
  { path: 'edit/:id', component: BookFormComponent }

]