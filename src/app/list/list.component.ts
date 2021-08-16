import { Component, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MultiForm } from '../multi-form';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  request(data: any): void {
    console.log(`Calculation for ${JSON.stringify(data)}`);
  }
}

@UntilDestroy()
@Component({
  selector: 'app-list',
  template: `
    <div>
      <h5>Shopping Cart List</h5>
      <div [formGroup]="fGroup">
        <ng-container formArrayName="multi">
        <div *ngFor="let ctrl of multi?.controls; index as i;">
          {{ ctrl.value }} <button (click)="delete(i)">delete</button>
        </div>
        </ng-container>
      </div>

      <a routerLink="/form">Form.</a>
    </div>
  `
})
export class ListComponent extends MultiForm {
  constructor(
    protected _fManager: AkitaNgFormsManager,
    protected _fBuilder: FormBuilder,
    private _calculationService: CalculationService) {
      super(_fBuilder, _fManager);
    }

  ngOnInit(): void {
    this.init();

    this._fManager
      .selectControl(this._fName, this._multi)
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(v => {
        this._calculationService.request(v);
      });
  }

  edit(i: number): void {
    console.log(`Edit: ${i}`);
  }
}
