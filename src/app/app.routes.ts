import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { EmployeeManagementPage } from './pages/employee-management-page/employee-management-page';

export const routes: Routes = [   
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Nexa - Login',
        loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage)
    },
    {
        path: 'employee-management',
        title: 'Nexa - Gerenciamento de Funcionários',
        loadComponent: () => import('./pages/employee-management-page/employee-management-page').then(m => m.EmployeeManagementPage)
    },
    { 
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    }
];
