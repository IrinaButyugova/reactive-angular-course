import { Injectable } from '@angular/core';
import { Action, createSelector, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { catchError, map } from 'rxjs/operators';
import {Course, sortCoursesBySeqNo} from '../model/course';
import * as CourseActions from './feature.actions';
import { CoursesService } from '../services/courses.service';
import {Observable} from 'rxjs';

export interface CourseStateModel{
    readonly loaded: boolean;
    readonly courses: Course[];
}

export const initialCourseState: CourseStateModel = {
    loaded: false,
    courses: []
  };

  @State<CourseStateModel>({
    name: 'posts',
    defaults: initialCourseState,
  })
  @Injectable()
    export class CourseState implements NgxsOnInit {
    @Selector()
    static loaded(state: CourseStateModel): boolean {
    return state.loaded;
  }

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
}