import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MultiForm } from '../multi-form';

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
    protected _fBuilder: FormBuilder) {
      super(_fBuilder, _fManager);
    }

  ngOnInit(): void {
    this.init();
  }

  edit(i: number): void {
    console.log(`Edit: ${i}`);
  }
}
