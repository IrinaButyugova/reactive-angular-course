import {Course} from '../model/course';

  export class Load {
    static readonly type = '[Courses] Load';
  }

  export class LoadSuccess {
    static readonly type = '[Courses] Load Success';
  
    constructor(public readonly courses: Course[]) {}
  }

  export class LoadFailure {
    static readonly type = '[Post] Load Failure';
  
    constructor(public readonly error: unknown) {}
  }