import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CourseOverviewComponent } from './course-overview/course-overview.component';

const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full',  },
  {path: "courses", component: CourseOverviewComponent},
  {path: "user/:id", component: UserProfileComponent},
  {path: "courses/:id ", component: CourseDetailComponent},
  {path: "signup", component: SignupComponent},
  {path: "login", component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
