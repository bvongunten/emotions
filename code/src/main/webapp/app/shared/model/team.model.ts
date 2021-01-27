import { IUser } from 'app/core/user/user.model';

export interface ITeam {
  id?: number;
  name?: string;
  slogan?: string;
  region?: string;
  imageContentType?: string;
  image?: any;
  users?: IUser[];
}

export class Team implements ITeam {
  constructor(
    public id?: number,
    public name?: string,
    public slogan?: string,
    public region?: string,
    public imageContentType?: string,
    public image?: any,
    public users?: IUser[]
  ) {}
}
