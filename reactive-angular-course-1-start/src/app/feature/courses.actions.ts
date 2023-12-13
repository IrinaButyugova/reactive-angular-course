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

  export class Save {
    static readonly type = '[Courses] Save';

    constructor(public courseId: string, public changes: Partial<Course>) {}
  }

  export class SaveSuccess {
    static readonly type = '[Courses] Save Success';
  }

  export class SaveFailure {
    static readonly type = '[Post] Save Failure';
  
    constructor(public readonly error: unknown) {}
  }