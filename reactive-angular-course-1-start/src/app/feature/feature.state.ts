import { Injectable } from '@angular/core';
import { Action, createSelector, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { catchError, map } from 'rxjs/operators';
import {Course, sortCoursesBySeqNo} from '../model/course';
import * as CourseActions from './feature.actions';
import { CoursesService } from '../services/courses.service';
import {Observable} from 'rxjs';

export interface CourseStateModel{
    readonly courses: Course[];
}

export const initialCourseState: CourseStateModel = {
    courses: []
  };

  @State<CourseStateModel>({
    name: 'posts',
    defaults: initialCourseState,
  })
  @Injectable()
    export class CourseState implements NgxsOnInit {
   
  @Selector()
  static courses(state: CourseStateModel) {
    return state.courses;
  }

  static coursesByCategory(category: string){
    return createSelector([CourseState], (state: CourseStateModel) => {
        return state.courses
        .filter((course) => course.category == category)
        .sort(sortCoursesBySeqNo)
    }) 
  }

  constructor(private readonly coursesService: CoursesService) {}

  ngxsOnInit(ctx: StateContext<CourseStateModel>): void {
    ctx.dispatch(new CourseActions.Load());
  }

  @Action(CourseActions.Load)
  load(ctx: StateContext<CourseStateModel>){
    return this.coursesService.loadAllCourses()
    .pipe(
        map((allCourses) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                courses: allCourses
              });
      
              return ctx.dispatch(new CourseActions.LoadSuccess(allCourses))
        }),
        catchError((error: unknown) => ctx.dispatch(new CourseActions.LoadFailure(error)))
    )
  }

  @Action(CourseActions.Save)
  save(ctx: StateContext<CourseStateModel>, {courseId, changes}: CourseActions.Save){
    return this.coursesService.saveCourse(courseId, changes)
    .pipe(
      map(() => {
        const state = ctx.getState();
        const index = state.courses.findIndex(course => course.id == courseId);
        const newCourse : Course = {
            ...state.courses[index],
            ...changes
        };
        const newCourses : Course[] = state.courses.slice(0);
        newCourses[index] = newCourse;

        ctx.setState({
          ...state,
          courses: newCourses
        });

        return ctx.dispatch(new CourseActions.SaveSuccess)
      }),
      catchError((error: unknown) => ctx.dispatch(new CourseActions.SaveFailure(error)))
    )
  }
}