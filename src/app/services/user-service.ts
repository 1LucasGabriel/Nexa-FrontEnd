import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetUserDTO } from '../dtos/get-user-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient)
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api/users'

  public getUser() {
    const url = `${this.urlAPI}`
    return this.http.get<GetUserDTO>(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public getMe() {
    const url = `${this.urlAPI}/me`
    return this.http.get<any>(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public updateMe(data: any) {
    const url = `${this.urlAPI}/me`
    return this.http.put<any>(url, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public changePassword(data: any) {
    const url = `${this.urlAPI}/change-password`
    return this.http.put<any>(url, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
