import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {Course} from "../model/course";
import {map, shareReplay} from "rxjs/operators"

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    constructor(private http: HttpClient){

    }

    loadAllCourses() : Observable<Course[]>{
        return this.http.get<Course[]>("api/courses")
        .pipe(
            map(res => res["payload"]),
            shareReplay()
            );
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any>{
        return this.http.put(`api/courses/${courseId}`, changes)
        .pipe(
            shareReplay()
        );
    }

    searchLessons(search: string){
        return this.http.get<Course[]>("api/lessons",
        {
            params: {
                filter: search,
                pageSize: "100"
            }
        })
        .pipe(
            map(res => res["payload"]),
            shareReplay()
            );
    }

    loadCourseById(courseId: number){
        return this.http.get<Course>(`api/courses/${courseId}`)
        .pipe(
            shareReplay()
            ); 
    }

    loadCourseLessons(courseId: number) {
        return this.http.get<Course[]>("api/lessons",
        {
            params: {
                pageSize: "1000",
                courseId: courseId.toString()
            }
        })
        .pipe(
            map(res => res["payload"]),
            shareReplay()
            );
    }
}