import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IMoodMeasurement {
  id?: number;
  mood?: number;
  message?: string;
  date?: Moment;
  user?: IUser;
}

export class MoodMeasurement implements IMoodMeasurement {
  constructor(public id?: number, public mood?: number, public message?: string, public date?: Moment, public user?: IUser) {}
}
