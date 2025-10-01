import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProformasService } from 'src/app/modules/proformas/service/proformas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


type Operacion = 'GRAVADO' | 'EXONERADO' | 'INAFECTO';

export interface InvoiceRequest {
  ublVersion: string;
  tipoDoc: string;           // "01" factura
  tipoOperacion: string;     // "0101" venta interna
  serie: string;             // "F001"
  correlativo: string;       // "1"
  fechaEmision: string;      // ISO con zona -05:00
  formaPago: { moneda: string; tipo: string }; // { moneda:"PEN", tipo:"Contado" }
  tipoMoneda: string;        // "PEN"
  company: {
    ruc: number;
    razonSocial: string;
    nombreComercial: string;
    address: {
      ubigueo: string;
      departamento: string;
      provincia: string;
      distrito: string;
      urbanizacion: string;
      direccion: string;
      codLocal: string;
    }
  };
  client: {
    tipoDoc: string;
    numDoc: number;
    rznSocial: string;
  };
  details: Array<{
    tipAfeIgv: number;
    codProducto: string;
    unidad: string;
    descripcion: string;
    cantidad: number;
    mtoValorUnitario: number;
    mtoValorVenta: number;
    mtoBaseIgv: number;
    porcentajeIgv: number;
    igv: number;
    totalImpuestos: number;
    mtoPrecioUnitario: number;
  }>;
  legends: Array<{ code: string; value: string }>;
}

interface Producto {
  id: number;
  nombre: string;
  unidad: string;  // p. ej. "CJ", "UND", "KG"
  precioBase?: number; // opcional si lo traes precargado
}

interface ItemVenta {
  idTemp: number;            // id interno para la tabla
  productoId: number;
  productoNombre: string;
  unidad: string;
  tipoOperacion: Operacion;
  cantidad: number;
  precioUnitario: number;    // precio base (sin IGV)
  igv: number;               // monto IGV del ítem
  subtotal: number;          // sin IGV
  total: number;             // con IGV si corresponde
}

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.scss']
})
export class CreateFacturaComponent {

  TODAY: string = 'Y/m/d';
  isLoading$: any;
  imagen_previzualiza: any = '';

  // Mock de productos (cámbialo por tu servicio)
  productos: Producto[] = [
    { id: 1, nombre: 'Arroz Pilado - San José', unidad: 'KG', precioBase: 5.20 },
    { id: 2, nombre: 'Bolsa de Plástico - Ben', unidad: 'UND', precioBase: 0.35 },
    { id: 3, nombre: 'Hyundai Tucson 2025', unidad: 'UND', precioBase: 85000 },
    { id: 4, nombre: 'Johnnie Walker 2024', unidad: 'LT', precioBase: 120.00 },
    { id: 5, nombre: 'Memoria RAM 16GB 2025', unidad: 'CJ', precioBase: 175.00 },
  ];

  tiposOperacion: { value: Operacion; label: string; igv: number }[] = [
    { value: 'GRAVADO', label: 'Gravado (18%)', igv: 0.18 },
    { value: 'EXONERADO', label: 'Exonerado (0%)', igv: 0.00 },
    { value: 'INAFECTO', label: 'Inafecto (0%)', igv: 0.00 },
  ];

  formItem!: FormGroup;
  items: ItemVenta[] = [];
  private rowSeq = 1;

  // Totales
  get subTotalGlobal(): number {
    return this.items.reduce((acc, it) => acc + it.subtotal, 0);
  }
  get igvGlobal(): number {
    return this.items.reduce((acc, it) => acc + it.igv, 0);
  }
  get totalGlobal(): number {
    return this.items.reduce((acc, it) => acc + it.total, 0);
  }

  @ViewChild("discount") something: ElementRef;
  payment_file: any;
  constructor(
    public modalService: NgbModal,
    public proformaService: ProformasService,
    public toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.formItem = this.fb.group({
      productoId: [null, Validators.required],
      tipoOperacion: ['GRAVADO' as Operacion, Validators.required],
      precioBase: [0, [Validators.required, Validators.min(0.0)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });

    // Si el usuario cambia de producto, precarga precio y unidad
    this.formItem.get('productoId')!.valueChanges.subscribe((pid: number) => {
      const p = this.productos.find(x => x.id === +pid);
      if (p?.precioBase != null) {
        this.formItem.patchValue({ precioBase: p.precioBase }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.proformaService.isLoading$;
    this.proformaService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.TODAY = resp.today;
      this.isLoadingProcess();
    })
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toast.warning("WARN", "El archivo no es una imagen");
      return;
    }
    this.payment_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.payment_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    this.isLoadingProcess();
  }

  isLoadingProcess() {
    this.proformaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);
    }, 50);
  }

  agregarItem(): void {
    if (this.formItem.invalid) {
      this.formItem.markAllAsTouched();
      return;
    }

    const { productoId, tipoOperacion, precioBase, cantidad } = this.formItem.value as {
      productoId: number; tipoOperacion: Operacion; precioBase: number; cantidad: number;
    };

    const prod = this.productos.find(p => p.id === productoId)!;
    const igvPerc = this.tiposOperacion.find(t => t.value === tipoOperacion)!.igv;

    const subtotal = this.redondear(precioBase * cantidad, 2);
    const igv = this.redondear(tipoOperacion === 'GRAVADO' ? subtotal * igvPerc : 0, 2);
    const total = this.redondear(subtotal + igv, 2);

    const item: ItemVenta = {
      idTemp: this.rowSeq++,
      productoId: prod.id,
      productoNombre: prod.nombre,
      unidad: prod.unidad,
      tipoOperacion,
      cantidad,
      precioUnitario: precioBase,
      igv,
      subtotal,
      total,
    };

    this.items = [...this.items, item];

    // Opcional: limpiar cantidad (o todo el formulario)
    this.formItem.patchValue({ cantidad: 1 });
  }

  eliminarItem(idTemp: number): void {
    this.items = this.items.filter(x => x.idTemp !== idTemp);
  }

  private redondear(n: number, dec = 2): number {
    const f = Math.pow(10, dec);
    return Math.round((n + Number.EPSILON) * f) / f;
  }

}
