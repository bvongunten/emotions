import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from 'app/shared/util/request-util';
import { ITeam } from 'app/shared/model/team.model';
import {IMoodMeasurement} from "app/shared/model/mood-measurement.model";
import {map} from "rxjs/operators";
import * as moment from "moment";

type EntityArrayResponseType = HttpResponse<ITeam[]>;
type EntityResponseType = HttpResponse<ITeam>;

@Injectable({ providedIn: 'root' })
export class PublicService {

  constructor(protected http: HttpClient) {}

  getPublicBoards(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeam[]>('api/publicmoodboards', { params: options, observe: 'response' });
  }


  getPublicBoard(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<IMoodMeasurement[]>(`api/publicmoodboard/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getPublicTeam(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeam>(`api/publicteam/${id}`, { observe: 'response' });
  }


  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((moodMeasurement: IMoodMeasurement) => {
        moodMeasurement.date = moodMeasurement.date ? moment(moodMeasurement.date) : undefined;
      });
    }
    return res;
  }

}
