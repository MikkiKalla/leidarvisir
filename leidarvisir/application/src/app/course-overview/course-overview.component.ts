import { Component, OnInit,Input } from '@angular/core';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {
  courses: any[];
  
  constructor(private courseService: CourseService) { }

  ngOnInit() {
    // this.courseService.getCourses().subscribe((courses: any[])=>{
    //   this.courses = courses;
    //   console.log(courses);
    // })
  }

}
