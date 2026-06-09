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


}
