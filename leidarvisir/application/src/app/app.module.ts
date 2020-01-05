import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { InterestTestComponent } from './interest-test/interest-test.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SavedCoursesComponent } from './saved-courses/saved-courses.component';
import { CourseCardComponent } from './course-card/course-card.component';
import {  HttpClientModule } from '@angular/common/http';
import { CourseOverviewComponent } from './course-overview/course-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ComparisonComponent,
    CourseDetailComponent,
    InterestTestComponent,
    UserProfileComponent,
    SavedCoursesComponent,
    CourseCardComponent,
    CourseOverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
