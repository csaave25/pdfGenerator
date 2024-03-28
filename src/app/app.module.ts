import { ApplicationConfig, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InformeEfeComponent } from './informe-efe/informe-efe/informe-efe.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule, RouterOutlet, Routes, provideRouter } from '@angular/router';
import { InformeA2mgComponent } from './informe-a2mg/informe-a2mg/informe-a2mg.component';
import { ReporteSismosComponent } from './reportes/reporte-sismo/reporte-sismos/reporte-sismos.component';
import { ReporteTronaduraComponent } from './reportes/reporte-tronadura/reporte-tronadura/reporte-tronadura.component';
import { ReporteCMDICComponent } from './reportes/reporte-CMDIC/reporte-cmdic/reporte-cmdic.component';
import { EventoComponent } from './reportes/reporte-evento/evento/evento.component';
import { TurnosDiariosComponent } from './reportes/reporte-turnos/turnos-diarios/turnos-diarios.component';
import { ChecklistComponent } from './reportes/reporte-checklist/checklist/checklist.component';
import { EstadosDelServicioComponent } from './reportes/reporte-estado/estados-del-servicio/estados-del-servicio.component';



const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'efe', component: InformeEfeComponent },
  { path: 'a2mg', component: InformeA2mgComponent },
  { path: 'sismos', component: ReporteSismosComponent },
  { path: 'tronadura', component: ReporteTronaduraComponent },
  { path: 'cmdic', component: ReporteCMDICComponent },
  // { path: 'alertas', component: AlertasDeSeguridadComponent },
  { path: 'eventos', component: EventoComponent },
  { path: 'turnos', component: TurnosDiariosComponent },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'estados', component: EstadosDelServicioComponent },


];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};


@NgModule({
  declarations: [
    AppComponent,
    InformeEfeComponent,
    MenuComponent,
    InformeA2mgComponent,
    ReporteSismosComponent,
    ReporteTronaduraComponent,
    ReporteCMDICComponent,
    EventoComponent,
    TurnosDiariosComponent,
    ChecklistComponent,
    EstadosDelServicioComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    RouterOutlet,
    ReactiveFormsModule,
    BrowserModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    NoopAnimationsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
