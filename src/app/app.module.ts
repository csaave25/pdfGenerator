import { ApplicationConfig, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PdfComponent } from './pdf/pdf.component';
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
import { NewPDFComponent } from './new-pdf/new-pdf.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfTemplateComponent } from './pdf-template/pdf-template.component';
import { InformeMensualComponent } from './informe-mensual/informe-mensual.component';
import { InformeEfeComponent } from './informe-efe/informe-efe/informe-efe.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule, RouterOutlet, Routes, provideRouter } from '@angular/router';



const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'efe', component: InformeEfeComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};


@NgModule({
  declarations: [
    AppComponent,
    PdfComponent,
    NewPDFComponent,
    PdfTemplateComponent,
    InformeMensualComponent,
    InformeEfeComponent,
    MenuComponent
  ],
  imports: [
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
