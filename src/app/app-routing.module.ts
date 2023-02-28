import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCrudTableComponent } from '../../../../../Documents/GitHub/hackathon-angular/src/app/components/user-crud-table/user-crud-table.component';

const routes: Routes = [
  { path: 'user-crud-table', component: UserCrudTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
