import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NumberFormatInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar si la URL contiene un ID (número) y excluirla del formateo
    if (this.isUrlWithId(req.url)) {
      return next.handle(req);
    }
    if (req.headers.has('X-Bypass-Number-Format')) {
      return next.handle(req); // no formatear esta respuesta
    }
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body) {
          this.formatNumbersInObject(event.body);
          return event.clone({ body: event.body });
        }
        return event;
      })
    );
  }

  private isUrlWithId(url: string): boolean {
    // Detectar URLs que contienen números (IDs) en la ruta
    // Ejemplo: /api/proformas/2881, /api/users/123, etc.
    const urlWithIdPattern = /\/api\/[a-zA-Z-]+\/\d+/;
    return urlWithIdPattern.test(url);
  }

  private formatNumbersInObject(obj: any): any {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];

          // Excluir campos que son IDs o contienen 'id' en el nombre
          if (typeof value === 'number' && !this.isIdField(key)) {
            // Formatear números directamente en el objeto
            obj[key] = value.toLocaleString('es-PE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          } else if (typeof value === 'object') {
            // Recursivamente formatear objetos anidados
            this.formatNumbersInObject(value);
          }
        }
      }
    }
    return obj;
  }

  private isIdField(fieldName: string): boolean {
    // Excluir campos que son IDs
    const lowerFieldName = fieldName.toLowerCase();
    return lowerFieldName === 'id' ||
      lowerFieldName.endsWith('_id') ||
      lowerFieldName.endsWith('id') ||
      lowerFieldName.includes('_id_') ||
      lowerFieldName === 'uuid' ||
      lowerFieldName === 'code';
  }

}