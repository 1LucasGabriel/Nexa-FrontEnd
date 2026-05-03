import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetHomePageDTO } from '../dtos/get-home-page-dto';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  private http = inject(HttpClient)
  private urlAPI = 'http://localhost:5102/api/home'

  public get() {
    const url = `${this.urlAPI}`
    return this.http.get<GetHomePageDTO >(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
