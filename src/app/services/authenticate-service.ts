import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OutputAuthenticateDTO } from '../dtos/output-authenticate-dto';
import { InputAuthenticateDTO } from '../dtos/input-authenticate-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private http = inject(HttpClient)
  private urlAPI = 'http://localhost:5102/api/auth'

  public postLogin(data: OutputAuthenticateDTO) {
    const url = `${this.urlAPI}/login`
    return this.http.post<InputAuthenticateDTO>(url, data)
  }

  private TOKEN_KEY = 'token';

  public setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public clear() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
