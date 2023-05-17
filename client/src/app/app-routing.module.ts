import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { PointsHistoryComponent } from './components/points-history.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'points/history', component: PointsHistoryComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
