import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
  courses: any[];
  
  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.courseService.getCourses().subscribe((courses: any[])=>{
      this.courses = courses;
      console.log(courses);
    })
  }
  
}
