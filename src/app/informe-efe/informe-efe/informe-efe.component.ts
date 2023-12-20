import { Component } from '@angular/core';
import { InformeService } from '../informe.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-informe-efe',
  templateUrl: './informe-efe.component.html',
  styleUrls: ['./informe-efe.component.scss']
})
export class InformeEfeComponent {

  constructor(private servicio : InformeService){}

  service = this.servicio
  dataInputs = new FormGroup({
    textAreaTest : new FormControl()
  })
  
}
