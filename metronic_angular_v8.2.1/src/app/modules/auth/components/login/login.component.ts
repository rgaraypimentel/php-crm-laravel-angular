import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  mfaForm!: FormGroup;
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'CarlosSuperadmin@example.com',
    password: '12345678',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  smsSending = false;
  smsMsg = '';           // mensaje de éxito o error
  smsCooldown = 0;       // segundos de espera para reintentar
  smsTimerRef: any = null;
  smsError = '';



  showMfaModal = false;
  mfa = { token: '', otp: '', hint: '' };
  mfaError: string = '';

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    this.mfaForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;

    const sub = this.authService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe((res: any) => {
        if (!res) {
          this.hasError = true;
          return;
        }
        if (res?.access_token && res?.user) {
          // login normal
          document.location.reload();
          return;
        }

        if (res?.mfa_required === true && res?.mfa_token) {
          // mostrar modal MFA (usa tu estado/flujo de modal)
          this.mfa = { token: res.mfa_token, otp: '', hint: res.user_hint || '' };
          this.mfaForm.reset();
          // reset estado SMS
          this.smsSending = false;
          this.smsMsg = '';
          this.clearSmsTimer();
          this.smsCooldown = 0;
          this.showMfaModal = true;
          return;
        }

        this.hasError = true;
      });

    this.unsubscribe.push(sub);
  }

  onSendOtpSms() {
    // limpio mensajes previos (éxito/error)
    this.smsMsg = '';
    this.smsError = '';

    if (!this.mfa?.token) {
      this.smsError = 'No se encontró el mfa_token. Intente loguearse otra vez.';
      this.autoClearMsg();
      return;
    }

    // evita spam (yo controlo re-click sin deshabilitar el botón)
    if (this.smsSending || this.smsCooldown > 0) return;

    // feedback inmediato: spinner + cooldown ya
    this.smsSending = true;
    this.smsCooldown = 30;            // contador inmediato para que el usuario vea acción
    this.startSmsTimer();

    const sub = this.authService.sendMfaSms(this.mfa.token)
      .pipe(
        first(),
        finalize(() => { this.smsSending = false; })
      )
      .subscribe((ok: boolean | { ok: boolean; message?: string }) => {

        // Soporta tu versión original (boolean) o la mejorada ({ok,message})
        const success = typeof ok === 'boolean' ? ok : ok.ok;
        const msg = typeof ok === 'boolean'
          ? (ok ? 'Código enviado por SMS.' : 'No se pudo enviar el SMS. Intente nuevamente.')
          : (ok.message || (success ? 'Código enviado por SMS.' : 'No se pudo enviar el SMS. Intente nuevamente.'));

        if (success) {
          this.smsMsg = msg;
        } else {
          this.smsError = msg;
          // si falló, no castigo con 30s; dejo un cooldown corto de cortesía
          if (this.smsCooldown > 5) this.smsCooldown = 5;
        }

        this.autoClearMsg();
      });

    this.unsubscribe.push(sub);
  }


  startSmsTimer() {
    this.clearSmsTimer();

    // corremos el setInterval fuera de Angular para no recalcular todo
    this.ngZone.runOutsideAngular(() => {
      this.smsTimerRef = setInterval(() => {
        // y sólo el cambio de estado lo regresamos a Angular
        this.ngZone.run(() => {
          this.smsCooldown--;
          if (this.smsCooldown <= 0) {
            this.clearSmsTimer();
          }
          // asegura que la vista se actualice incluso con OnPush o zone noop
          this.cdr.markForCheck();
        });
      }, 1000);
    });
  }


  clearSmsTimer() {
    if (this.smsTimerRef) {
      clearInterval(this.smsTimerRef);
      this.smsTimerRef = null;
    }
  }

  autoClearMsg() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.smsMsg = '';
          this.smsError = '';
          this.cdr.markForCheck();
        });
      }, 4000);
    });
  }





  onSubmitOtp() {
    this.mfaError = '';

    if (this.mfaForm.invalid) {
      this.mfaError = 'Ingrese el código OTP de 6 dígitos.';
      return;
    }

    const otp = this.mfaForm.get('otp')!.value;
    const token = this.mfa.token;

    const sub = this.authService.mfaVerify(token, otp)
      .pipe(first())
      .subscribe((res: any) => {
        if (res?.error) {
          this.mfaError = res.message;
          return;
        }
        if (res?.access_token && res?.user) {
          this.showMfaModal = false;
          document.location.reload();
          return;
        }
        this.mfaError = 'No se pudo completar la verificación, intente de nuevo en unos minutos';
      });

    this.unsubscribe.push(sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
