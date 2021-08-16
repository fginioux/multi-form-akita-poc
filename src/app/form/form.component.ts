import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { MultiForm } from '../multi-form';

@UntilDestroy()
@Component({
  selector: 'app-form',
  template: `
    <div *ngIf="multi" [formGroup]="fGroup">
      <h3>Multi form.</h3>
      <div>
        Min items: {{ minLength }}<br />
        Max items: {{ maxLength }} 
      </div>

      <div>
        <h5>List of form.</h5>
        <ng-container formArrayName="multi">
          <div *ngFor="let ctrl of multi.controls; index as i;">
            <fieldset style="border: 0; padding: 0 0 10px 0;">
              <select [formControlName]="i">
                <option value="">Select Category</option>
                <option value="art/antiques">Art/Antiques</option>
                <option value="jewellery">Jewellery</option>
                <option value="clocks">Clocks</option>
                <option value="bikes">Bikes</option>
                <option value="weapons">Weapons</option>
              </select>
              <button style="margin-left: 5px;" (click)="delete(i)">delete</button>
            </fieldset>
          </div>
        </ng-container>
      </div>

      <div style="margin-top: 20px;">
        <button [disabled]="!(canAdd$ | async)" (click)="add()">Add new item in the list</button>
      </div>

      <div style="margin-top: 20px;">
        <a routerLink="/list" [class.disabled]="(isInvalid$ | async) ? true : null">Go To Next Step !</a>
      </div>
    </div>
  `
})
export class FormComponent extends MultiForm {
  maxLength = 4;
  minLength = 2;
  isInvalid$: BehaviorSubject<any> = new BehaviorSubject(false);
  canAdd$: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(
    protected _fManager: AkitaNgFormsManager,
    protected _fBuilder: FormBuilder) {
      super(_fBuilder, _fManager);
    }

  ngOnInit(): void {
    this.init(MultiFormMinLengthValidatorFactory(this.minLength));
  }

  ngAfterViewInit(): void {
    this._fManager
      .selectValid(this._fName)
      .pipe(untilDestroyed(this))
      .subscribe(v => {
        window.setTimeout(() => {
          this.isInvalid$.next(!v);
        });
    });

    this._fManager
      .selectControl(this._fName, this._multi)
      .pipe(untilDestroyed(this))
      .subscribe(v => {
        const validity = this.multi?.controls.every((ctrl) => ctrl.valid);
        window.setTimeout(() => {
          this.canAdd$.next(validity && !this.maxLengthReached);
        });
      });
  }

  add(): void {
    this.multi?.push(this._arrFactory());
  }

  get maxLengthReached(): boolean {
    return (this.multi?.length || 0) >= this.maxLength;
  }
}

export interface MultiFormValidatorFn extends ValidatorFn {
  (control: FormArray | AbstractControl): ValidationErrors | null;
}

const MultiFormMinLengthValidatorFactory = (minLength: number = 0): MultiFormValidatorFn => {
  if (!minLength) {
    return (ctrl: AbstractControl) => null;
  }

  return (ctrl: FormArray | AbstractControl): ValidationErrors | null => {
    if (ctrl instanceof FormArray) {
      if (ctrl.controls.length < minLength) {
        return {
          minLength: 'Multiform. element'
        };
      }
    }

    return null;
  }
};
