import { TestBed } from '@angular/core/testing';

import { NumberFormatInterceptor } from './number-format.interceptor';

describe('NumberFormatInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NumberFormatInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: NumberFormatInterceptor = TestBed.inject(NumberFormatInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
