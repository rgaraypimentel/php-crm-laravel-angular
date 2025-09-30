import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-create-lote',
  templateUrl: './create-lote.component.html',
  styleUrls: ['./create-lote.component.scss']
})
export class CreateLoteComponent {
  @Output() SucursalC: EventEmitter<any> = new EventEmitter();
  name: string = '';
  address: string = '';

   isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      codigoLote: ['', [Validators.required, Validators.maxLength(30)]],
      productoSku: ['', [Validators.required, Validators.maxLength(40), Validators.pattern(/^[A-Za-z0-9\-\._]+$/)]],
      almacen: ['', Validators.required],
      fechaFabricacion: ['', Validators.required],
      fechaCaducidad: ['', Validators.required],
      autorizado: [false, Validators.required],
      costoUnitario: [null, [Validators.required, Validators.min(0)]],
      cantidadInicial: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      cantidadDisponible: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      proveedor: [''],
      documentoOc: ['', [Validators.maxLength(40)]],
      observacion: ['']
    }, {
      validators: [this.fechaCaducidadMayorQueFabricacion()]
    });

    // Sincroniza cantidadDisponible con cantidadInicial si aún no tocaste el campo
    this.form.get('cantidadInicial')?.valueChanges.subscribe(val => {
      const dispCtrl = this.form.get('cantidadDisponible');
      if (dispCtrl && !dispCtrl.dirty) {
        dispCtrl.setValue(val);
      }
    });
  }

  form!: FormGroup;

  // Opciones inventadas para el desplegable de Almacén
  almacenes = [
    { id: 'ALM-LIM-01', nombre: 'A. Lima — Villa El Salvador' },
    { id: 'ALM-CUS-02', nombre: 'A. Cusco — San Jerónimo' },
    { id: 'ALM-ARE-03', nombre: 'A. Arequipa — Cerro Colorado' },
    { id: 'ALM-TRU-04', nombre: 'A. Trujillo — Moche' },
  ];

  // Puedes usar esto como select de proveedor (opcional)
  proveedores = [
    { id: 'PRV-001', nombre: 'Químicos Andinos S.A.' },
    { id: 'PRV-002', nombre: 'BioSafe Perú SAC' },
    { id: 'PRV-003', nombre: 'Industrias del Sur SRL' },
  ];



  // Validador cross-field: caducidad > fabricación
  private fechaCaducidadMayorQueFabricacion() {
    return (fg: AbstractControl) => {
      const fFab = fg.get('fechaFabricacion')?.value;
      const fCad = fg.get('fechaCaducidad')?.value;
      if (!fFab || !fCad) return null;
      const ok = new Date(fCad) > new Date(fFab);
      return ok ? null : { caducidadInvalida: true };
    };
  }

  control(name: string) {
    return this.form.get(name)!;
  }

  error(name: string, err: string) {
    const c = this.control(name);
    return c.touched && c.hasError(err);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.next(true);

    // Simula request
    setTimeout(() => {
      this.isLoading.next(false);
      // Aquí emites el payload o llamas a tu servicio
      // console.log('Payload:', this.form.value);
      alert('Lote registrado correctamente ✅');
      this.form.reset({ autorizado: false });
    }, 800);
  }

  onClose(modal?: any) {
    // Si lo usas dentro de un modal ng-bootstrap
    if (modal) modal.dismiss();
    this.form.reset({ autorizado: false });
  }
}
