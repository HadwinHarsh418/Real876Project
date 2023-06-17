import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileDetailsComponent } from './user-profile-details/user-profile-details.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {path:'',component:UserComponent},
  {path:'profile',component:UserProfileDetailsComponent},
  {path:'profile/:id',component:UserProfileDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
