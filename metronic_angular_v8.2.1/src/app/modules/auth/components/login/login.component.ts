import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
    email: 'super_admin_crm@gmail.com',
    password: '12345678',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  smsSending = false;
  smsMsg = '';           // mensaje de éxito o error
  smsCooldown = 0;       // segundos de espera para reintentar
  private smsTimerRef: any;


  showMfaModal = false;
  mfa = { token: '', otp: '', hint: '' };
  mfaError: string = '';

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
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
  clearSmsTimer() {
    if (this.smsTimerRef) {
      clearInterval(this.smsTimerRef);
      this.smsTimerRef = null;
    }
  }

  onSendOtpSms() {
    this.smsMsg = '';

    if (!this.mfa?.token) {
      this.smsMsg = 'No se encontró el mfa_token. Intente loguearse otra vez.';
      return;
    }

    // evita spam si hay cooldown
    if (this.smsCooldown > 0 || this.smsSending) return;

    this.smsSending = true;

    const sub = this.authService.sendMfaSms(this.mfa.token)
      .pipe(first(), finalize(() => { this.smsSending = false; }))
      .subscribe((ok: boolean) => {
        if (ok) {
          this.smsMsg = 'Código enviado por SMS.';
          this.smsCooldown = 5;
          this.clearSmsTimer();
          this.smsTimerRef = setInterval(() => {
            this.smsCooldown--;
            if (this.smsCooldown <= 0) {
              this.clearSmsTimer();
            }
          }, 1000);
        } else {
          this.smsMsg = 'No se pudo enviar el SMS. Intente nuevamente.';
        }
      });

    this.unsubscribe.push(sub);
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
