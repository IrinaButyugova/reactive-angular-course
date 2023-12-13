import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import { CoursesStore } from '../services/courses.store';
import { CourseState } from '../feature/feature.state'
import { Action, createSelector, NgxsOnInit, Selector, State, StateContext, Select } from '@ngxs/store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  @Select(CourseState.coursesByCategory("BEGINNER"))
  beginnerCourses$: Observable<Course[]>;
  @Select(CourseState.coursesByCategory("ADVANCED"))
  advancedCourses$: Observable<Course[]>;

  reloadCourses(){
  }
}




