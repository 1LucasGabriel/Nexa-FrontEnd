import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OutputAuthenticateDTO } from '../dtos/output-authenticate-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private http = inject(HttpClient)
  private urlAPI = 'https://localhost:7129/api/authenticate'

  public postAuthenticate(data: OutputAuthenticateDTO) {
    const url = `${this.urlAPI}/authenticate`
    return this.http.post<unknown>(url, data)
  }
}
