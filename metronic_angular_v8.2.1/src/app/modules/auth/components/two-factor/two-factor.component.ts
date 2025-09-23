import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { Router } from '@angular/router';
import { TwoFactorService, MfaStatus, MfaSetupResponse } from '../../services/two-factor.service';
import { AuthService } from '../../services/auth.service';

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

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public mfa: TwoFactorService,
    private auth: AuthService,
    private router: Router,
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
          // this.router.navigate(['/auth/login']);
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
          this.loadStatus();
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
    this.router.navigate(['/']); // Ajusta si tu dashboard es otra ruta
  }

  openOtpauth() {
    if (this.setupData?.otpauth_url) {
      window.open(this.setupData.otpauth_url, '_blank');
    }
  }
}
function finalize(arg0: () => void): import("rxjs").OperatorFunction<MfaSetupResponse, unknown> {
  throw new Error('Function not implemented.');
}

