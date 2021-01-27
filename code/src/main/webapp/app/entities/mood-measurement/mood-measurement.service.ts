import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IMoodMeasurement } from 'app/shared/model/mood-measurement.model';

type EntityResponseType = HttpResponse<IMoodMeasurement>;
type EntityArrayResponseType = HttpResponse<IMoodMeasurement[]>;

@Injectable({ providedIn: 'root' })
export class MoodMeasurementService {
  public resourceUrl = SERVER_API_URL + 'api/mood-measurements';

  constructor(protected http: HttpClient) {}

  create(moodMeasurement: IMoodMeasurement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodMeasurement);
    return this.http
      .post<IMoodMeasurement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(moodMeasurement: IMoodMeasurement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodMeasurement);
    return this.http
      .put<IMoodMeasurement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMoodMeasurement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMoodMeasurement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryLastByTeam(id?: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<IMoodMeasurement[]>(`${this.resourceUrl}/team/latest/${id}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(moodMeasurement: IMoodMeasurement): IMoodMeasurement {
    const copy: IMoodMeasurement = Object.assign({}, moodMeasurement, {
      date: moodMeasurement.date && moodMeasurement.date.isValid() ? moodMeasurement.date.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? moment(res.body.date) : undefined;
    }
    return res;
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
