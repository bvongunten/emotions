import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMoodMeasurement, MoodMeasurement } from 'app/shared/model/mood-measurement.model';
import { MoodMeasurementService } from './mood-measurement.service';
import { MoodMeasurementComponent } from './mood-measurement.component';
import { MoodMeasurementDetailComponent } from './mood-measurement-detail.component';
import { MoodMeasurementUpdateComponent } from './mood-measurement-update.component';

@Injectable({ providedIn: 'root' })
export class MoodMeasurementResolve implements Resolve<IMoodMeasurement> {
  constructor(private service: MoodMeasurementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMoodMeasurement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((moodMeasurement: HttpResponse<MoodMeasurement>) => {
          if (moodMeasurement.body) {
            return of(moodMeasurement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MoodMeasurement());
  }
}

export const moodMeasurementRoute: Routes = [
  {
    path: '',
    component: MoodMeasurementComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'emotionsApp.moodMeasurement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MoodMeasurementDetailComponent,
    resolve: {
      moodMeasurement: MoodMeasurementResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'emotionsApp.moodMeasurement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MoodMeasurementUpdateComponent,
    resolve: {
      moodMeasurement: MoodMeasurementResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'emotionsApp.moodMeasurement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MoodMeasurementUpdateComponent,
    resolve: {
      moodMeasurement: MoodMeasurementResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'emotionsApp.moodMeasurement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
