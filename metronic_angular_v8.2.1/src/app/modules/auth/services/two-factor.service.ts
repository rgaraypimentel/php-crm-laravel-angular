import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from './auth.service';

export interface MfaStatus {
  two_factor_enabled: boolean;
}

export interface MfaSetupResponseRaw {
  otpauth_url: string;
  qr_svg: string;               // SVG en base64 (sin prefijo)
  secret_masked?: string;
}

export interface MfaSetupResponse {
  otpauth_url: string;
  qr_img_dataurl: string;       // data:image/svg+xml;base64,xxxx
  secret_masked?: string;
  base: string;
}

@Injectable({ providedIn: 'root' })
export class TwoFactorService {
  loading$ = new BehaviorSubject<boolean>(false);
  authservice: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  status(): Observable<MfaStatus> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<MfaStatus>(`${URL_SERVICIOS}/mfa/status`, { headers });
  }

  setup(): Observable<MfaSetupResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    // OJO con el /api: usa exactamente lo que tengas en URL_SERVICIOS
    return this.http
      .post<MfaSetupResponseRaw>(`${URL_SERVICIOS}/mfa/setup`, {}, { headers }) // ← body {}, headers en options
      .pipe(
        map((raw) => ({
          otpauth_url: raw.otpauth_url,
          secret_masked: raw.secret_masked,
          qr_img_dataurl: `data:image/svg+xml;base64,${raw.qr_svg}`,
          base: raw.qr_svg
        }))
      );
  }

  enable(otp: string): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    // OJO con el /api: usa el que corresponda a tu URL_SERVICIOS
    return this.http
      .post<any>(`${URL_SERVICIOS}/mfa/enable`, { otp }, { headers }) // <-- headers en options
      .pipe(
        map(() => {
          // Actualiza estado local
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.two_factor_enabled = true;
            localStorage.setItem('user', JSON.stringify(user));
            this.auth.currentUserSubject.next(user);
          }
          return true;
        })
      );
  }

  disable(otp: string): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });
    return this.http.post<any>(`${URL_SERVICIOS}/mfa/disable`, { otp }, { headers }).pipe(
      map(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.two_factor_enabled = false;
          localStorage.setItem('user', JSON.stringify(user));
          this.auth.currentUserSubject.next(user);
        }
        return true;
      })
    );
  }

  sendSetupOtpSms() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    // Mantengo el patrón de rutas que ya usas: `${URL_SERVICIOS}/mfa/...`
    return this.http.post<any>(`${URL_SERVICIOS}/auth/setup/sms/send`, {}, { headers });
  }
}
