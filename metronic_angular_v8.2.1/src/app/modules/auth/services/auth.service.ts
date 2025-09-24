import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, timeout } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  token: any;
  user: any;

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.http.post(URL_SERVICIOS + "/auth/login", { email, password }).pipe(
      map((resp: any) => {
        // Caso A: login normal (hay token + user)
        if (resp?.access_token && resp?.user) {
          this.setAuthFromLocalStorage(resp); // guarda token+user y hace next al currentUserSubject
          return resp; // <-- retornamos el objeto completo
        }

        // Caso B: MFA requerido (no hay token aún)
        if (resp?.mfa_required === true && resp?.mfa_token) {
          return resp; // <-- retornamos el objeto MFA para que el componente muestre el modal
        }

        // Respuesta inesperada
        return undefined;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  mfaVerify(mfa_token: string, otp: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.http.post(URL_SERVICIOS + '/auth/mfa/verify', { mfa_token, otp }).pipe(
      map((auth: any) => {
        // auth aquí debería traer { access_token, token_type, expires_in, user }
        const ok = this.setAuthFromLocalStorage(auth);
        return ok ? auth : undefined;
      }),
      catchError((err) => {
        return of({ error: true, message: err?.error?.message || 'OTP inválido o expirado' });
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // auth.service.ts
  sendMfaSms(mfa_token: string) {
    return this.http.post<{ sent?: boolean; message?: string; to_masked?: string }>(
      `${URL_SERVICIOS}/auth/sms/send`,
      { mfa_token }
    ).pipe(
      map((res) => {
        if (res?.sent) {
          return { ok: true, message: `Código enviado al número ${res.to_masked || ''}` };
        }
        return { ok: false, message: res?.message || 'No se pudo enviar el SMS.' };
      }),
      catchError((err) => {
        return of({ ok: false, message: err?.error?.message || 'Error al enviar SMS' });
      }),
      timeout(10000) // abortamos si demora más de 8s
    );
  }


  getUserByToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return of(auth).pipe(
      map((user: any) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: any): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.access_token) {
      localStorage.setItem('token', auth.access_token);
      localStorage.setItem('user', JSON.stringify(auth.user));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem('user');
      if (!lsValue) {
        return undefined;
      }
      this.token = localStorage.getItem('token')
      this.user = JSON.parse(lsValue);
      const authData = this.user
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
