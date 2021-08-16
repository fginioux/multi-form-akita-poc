import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _fName = '_fName';

  data: any = {};
  
  constructor(
    private _fManager: AkitaNgFormsManager,
    private _fBuilder: FormBuilder) {}

  ngAfterViewInit(): void {
    this._fManager.selectControl(this._fName)?.subscribe(v => {
      console.log(v);
    });
  }
}
