import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { CreateUpdateEmployeeDTO } from '../dtos/create-update-employee-dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient)
  private urlAPI = 'http://localhost:5102/api/employees'

  public getEmployees() {
    const url = `${this.urlAPI}`
    return this.http.get<Employee[]>(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public postEmployees(employee: CreateUpdateEmployeeDTO) {
    const url = `${this.urlAPI}`
    return this.http.post<Employee>(url, employee, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public putEmployees(id: number, employee: CreateUpdateEmployeeDTO) {
    const url = `${this.urlAPI}/${id}`
    return this.http.put(url, employee, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public deleteEmployees(id: number) {
    const url = `${this.urlAPI}/${id}`
    return this.http.delete(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
