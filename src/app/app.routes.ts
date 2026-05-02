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
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage),
        title: 'Nexa - Login'
    },
    {
        path: 'employee-management',
        component: EmployeeManagementPage
    }
];
