import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validator, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormManager {
  upsert(name: any, f: any, opts: any): void {}

  getControl(name: string): any {}

  selectControl(name: any, path?: any): Observable<any> {
    return of(null);
  }

  selectValid(name: any, path?: any): Observable<any> {
    return of(null);
  }
}

export abstract class MultiformAbstract {
  protected _multi!: string;
  protected _fName!: string; 

  fGroup!: FormGroup;

  constructor(protected _fBuilder: FormBuilder, protected _fManager: FormManager) {}

  get multi(): FormArray | null | undefined {
    return this.fGroup.get(this._multi) as FormArray || null;
  }

  init(lengthValidator?: ValidatorFn): void {
    const lengthValidators = lengthValidator ? [lengthValidator] : [];
    this.fGroup = this._fBuilder.group({
      [this._multi]: this._fBuilder.array([this._arrFactory()], lengthValidators)
    });

    const value = this._fManager.getControl(this._fName)?.value;
    if (value) {
      this.fGroup.patchValue({...value});
    }

    this._fManager.upsert(this._fName, this.fGroup, {
      arrControlFactory: {[this._multi]: () => this._arrFactory()}
    });
  }

  delete(index: number): void {
    this.multi?.removeAt(index);
  }

  protected _arrFactory(value: string = '', validation: ValidatorFn | ValidatorFn[] = []): FormControl {
    return new FormControl(value, validation);
  }
}

export class MultiForm extends MultiformAbstract {
  protected _multi = 'multi';
  protected _fName = 'fName';

  protected _arrFactory(): FormControl {
    return new FormControl('', [Validators.required]);
  }
}
