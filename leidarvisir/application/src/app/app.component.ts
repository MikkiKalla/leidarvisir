import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'leidarvisir';
  constructor(private courseService:CourseService){}

  ngOnInit(){

  }
  createNewCourse(){
    this.courseService.createCourse("Testing").subscribe((response: any)=>{
      console.log(response);
    })
  }

}
