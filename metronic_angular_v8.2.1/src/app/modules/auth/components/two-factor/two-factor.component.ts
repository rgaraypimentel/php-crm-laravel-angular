import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { Router } from '@angular/router';
import { TwoFactorService, MfaStatus, MfaSetupResponse } from '../../services/two-factor.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef, NgZone } from '@angular/core';

type ViewState = 'status' | 'enable' | 'disable';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss'],
})
export class TwoFactorComponent implements OnInit, OnDestroy {
  state: ViewState = 'status';
  status?: MfaStatus;

  enableForm!: FormGroup;     // OTP para habilitar
  disableForm!: FormGroup;    // OTP para deshabilitar

  setupData?: MfaSetupResponse;
  errorMsg = '';
  successMsg = '';

  // --- SMS durante el SETUP ---
  setupSmsMsg = '';
  setupSmsCooldown = 0;   // seg. para anti-spam simple
  setupSmsSending = false;
  private setupSmsInterval?: any;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public mfa: TwoFactorService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.enableForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
    this.disableForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });

    this.loadStatus();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    if (this.setupSmsInterval) {
      clearInterval(this.setupSmsInterval);
    }
  }

  // ====== Estado ======
  loadStatus() {
    this.errorMsg = '';
    this.successMsg = '';
    this.mfa.loading$.next(true);
    const sub = this.mfa.status().pipe(first()).subscribe({
      next: (st) => {
        this.status = st;
        this.state = 'status';
        this.mfa.loading$.next(false);
      },
      error: () => {
        this.errorMsg = 'No se pudo obtener el estado de 2FA.';
        this.mfa.loading$.next(false);
      }
    });
    this.subs.push(sub);
  }

  // ====== Habilitar ======
  startEnable() {
    this.errorMsg = '';
    this.successMsg = '';
    this.setupData = undefined;
    this.enableForm.reset();
    this.state = 'enable';
    this.requestSetup();
  }

  requestSetup() {
    this.mfa.loading$.next(true);
    const sub = this.mfa.setup()
      .pipe(first())
      .subscribe({
        next: (data: MfaSetupResponse) => {
          this.setupData = data;
          this.mfa.loading$.next(false);
          console.log('Respuesta completa:', data);
        },
        error: (e: unknown) => {
          this.errorMsg = 'No se pudo generar el QR. Intente nuevamente.';
          this.mfa.loading$.next(false);
        }
      });
    this.subs.push(sub);
  }

  confirmEnable() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.enableForm.invalid) {
      this.errorMsg = 'Ingrese el código OTP (6 dígitos).';
      return;
    }

    const otp = this.enableForm.get('otp')!.value;
    this.mfa.loading$.next(true);

    const sub = this.mfa.enable(otp).pipe(first()).subscribe({
      next: (ok) => {
        this.mfa.loading$.next(false);
        if (ok) {
          // ✅ Requisito: al habilitar 2FA, botar al usuario para que se loguee de nuevo
          this.successMsg = '2FA habilitado. Saliendo de la sesión...';
          // Limpia y redirige a /auth/login
          this.auth.logout();           // tu logout ya limpia localStorage y navega a /auth/login
          // Si tu logout NO navega, podrías forzar:
          this.router.navigate(['/auth/login']);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/auth/login');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          this.errorMsg = 'No se pudo habilitar el 2FA.';
        }
      },
      error: (e) => {
        this.mfa.loading$.next(false);
        this.errorMsg = e?.error?.message || 'OTP inválido o secreto expirado.';
      }
    });

    this.subs.push(sub);
  }

  // ====== Deshabilitar ======
  startDisable() {
    this.errorMsg = '';
    this.successMsg = '';
    this.disableForm.reset();
    this.state = 'disable';
  }

  confirmDisable() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.disableForm.invalid) {
      this.errorMsg = 'Ingrese el código OTP actual (6 dígitos).';
      return;
    }

    const otp = this.disableForm.get('otp')!.value;
    this.mfa.loading$.next(true);

    const sub = this.mfa.disable(otp).pipe(first()).subscribe({
      next: (ok) => {
        this.mfa.loading$.next(false);
        if (ok) {
          this.successMsg = '2FA deshabilitado correctamente.';
          this.auth.logout();           // tu logout ya limpia localStorage y navega a /auth/login
          // Si tu logout NO navega, podrías forzar:
          this.router.navigate(['/auth/login']);
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/auth/login');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          this.errorMsg = 'No se pudo deshabilitar el 2FA.';
        }
      },
      error: (e) => {
        this.mfa.loading$.next(false);
        this.errorMsg = e?.error?.message || 'OTP inválido.';
      }
    });

    this.subs.push(sub);
  }

  // ====== UI ======
  backToDashboard() {
    this.router.navigateByUrl('/');
    setTimeout(() => {
            window.location.reload();
          }, 100);
  }

  /**
 * Envía el OTP por SMS usando el secreto TEMPORAL del setup.
 * Respeta un cooldown simple para evitar spam.
 */
  onSendSetupOtpSms() {
    this.setupSmsMsg = '';

    // Si hay cooldown o ya está enviando, no hagas nada
    if (this.setupSmsCooldown > 0 || this.setupSmsSending) return;

    this.setupSmsSending = true;

    const sub = this.mfa.sendSetupOtpSms().pipe(first()).subscribe({
      next: (resp) => {
        // Backend: { sent, to_masked, approx_expires_in_seconds, sms }
        // Usamos ~30-60s como ventana típica (depende de tu backend)
        const ttl = Number(resp?.approx_expires_in_seconds ?? 60);
        const masked = resp?.to_masked ? ` al ${resp.to_masked}` : '';
        this.setupSmsMsg = resp?.sent === false
          ? 'No se pudo enviar el SMS. Intente nuevamente.'
          : `SMS enviado${masked}. El código expira aprox. en ${ttl}s.`;

        // Inicia cooldown corto (30s anti-spam; ajusta si tu backend impone otro)
        this.setupSmsCooldown = 30;
        this.cdr.markForCheck();
        if (this.setupSmsInterval) clearInterval(this.setupSmsInterval);
        this.setupSmsInterval = setInterval(() => {
          this.ngZone.run(() => {           // garantizamos que Angular detecte el tick
            this.setupSmsCooldown--;
            if (this.setupSmsCooldown <= 0) {
              clearInterval(this.setupSmsInterval);
              this.setupSmsInterval = undefined;
            }
            this.cdr.markForCheck();        // fuerza refresco de la vista en OnPush
          });
        }, 1000);
      },
      error: (e) => {
        // Mensajes de rate-limit del backend, etc.
        const msg = e?.error?.message || e?.error?.error || 'No se pudo enviar el SMS.';
        this.setupSmsMsg = msg;
        this.cdr.markForCheck();
      },
      complete: () => {
        this.setupSmsSending = false;
        this.cdr.markForCheck();
      }
    });

    this.subs.push(sub);
  }

  openOtpauth() {
    if (this.setupData?.otpauth_url) {
      window.open(this.setupData.otpauth_url, '_blank');
    }
  }
}

