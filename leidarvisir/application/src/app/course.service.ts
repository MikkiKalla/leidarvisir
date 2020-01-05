import { Injectable } from '@angular/core';
import{WebRequestService} from "./web-request.service"

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private webReqService: WebRequestService) { }

  createCourse(field_name: string) {
    //TEST:::send a web request to create course
    return this.webReqService.post("courses", {field_name})
  }
  getCourses() {
    return this.webReqService.get('courses');
  }

  getBookmarkedCourses (userId, courseId) {
    return
  }
}
