import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import {map, catchError, tap, shareReplay} from "rxjs/operators"
import { Course, sortCoursesBySeqNo } from "../model/course";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from '../services/loading.service';
import { MessageService } from '../messages/message.service';

@Injectable({
    providedIn: "root"
})
export class CoursesStore{

    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(private http: HttpClient,
        private loadingService: LoadingService,
        private messageService: MessageService
        ){
            this.loadAllCourses();
        }

    private loadAllCourses(){
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
        .pipe(
            map(response => response["payload"]),
            catchError(err => {
                const message = "Could not load courses";
                this.messageService.showErrors(message);
                console.log(message, err);
                return throwError(err);
            }),
            tap(courses => this.subject.next(courses))
        )

        this.loadingService.showLoaderUntilCompleted(loadCourses$)
        .subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any>{
        const courses = this.subject.getValue();
        const index = courses.findIndex(course => course.id == courseId);
        const newCourse : Course = {
            ...courses[index],
            ...changes
        };
        const newCourses : Course[] = courses.slice(0);
        newCourses[index] = newCourse;
        this.subject.next(newCourses);

        return this.http.put(`api/courses/${courseId}`, changes)
        .pipe(
            catchError(err => {
                const message = "Could not save course";
                this.messageService.showErrors(message);
                console.log(message, err);
                return throwError(err);
            }),
            shareReplay()
        );
    }

    filterByCategory(category: string): Observable<Course[]>{
        return this.courses$
        .pipe(
            map(courses => courses.filter(course => course.category == category)
            .sort(sortCoursesBySeqNo))
        );
    }
}