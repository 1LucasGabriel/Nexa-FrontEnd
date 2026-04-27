import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { EmployeeManagementPage } from './pages/employee-management-page/employee-management-page';

export const routes: Routes = [    
    {
        path: 'login',
        component: LoginPage,
    },
    {
        path: 'employee-management',
        component: EmployeeManagementPage
    }
];
