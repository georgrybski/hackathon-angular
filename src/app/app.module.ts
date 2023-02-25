import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserlService } from './services/userl.service';
import { TableModule } from 'primeng/table';
import { UserCrudTableComponent } from './components/user-crud-table/user-crud-table.component';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { UserDeletionService } from './services/user-deletion.service';
import { UserUpdateService } from './services/user-update.service';
import { DropdownModule } from 'primeng/dropdown';
import { ColorPickerModule } from 'primeng/colorpicker';


@NgModule({
  declarations: [
    AppComponent,
    UserCrudTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    MenubarModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    InputNumberModule,
    InputTextModule,
    RadioButtonModule,
    ToolbarModule,
    ToastModule,
    CalendarModule,
    DropdownModule,
    ColorPickerModule
  ],
  providers: [
    UserlService,
    UserDeletionService,
    UserUpdateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
