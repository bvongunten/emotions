import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {JhiDataUtils} from 'ng-jhipster';

import {Team} from 'app/shared/model/team.model';
import {HttpResponse} from "@angular/common/http";
import {IMoodMeasurement, MoodMeasurement} from "app/shared/model/mood-measurement.model";
import {User} from "app/core/user/user.model";
import {Observable} from "rxjs";
import {PublicService} from "app/entities/public/public.service";
import {MoodMeasurementService} from "app/entities/mood-measurement/mood-measurement.service";

@Component({
  selector: 'jhi-team-detail',
  templateUrl: './team-moodboard.component.html',
})
export class TeamMoodBoardComponent implements OnInit {
  team: Team | null = null;
  moodMeasurements: MoodMeasurement[] | null = null;

  constructor(protected publicService: PublicService, protected moodMeasurementService: MoodMeasurementService, protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({team}) => (this.team = team));
    this.loadAll();
  }

  loadAll(): void {
    if (this.team != null) {
      this.publicService.getPublicBoard(this.team.id).subscribe((res: HttpResponse<MoodMeasurement[]>) => {
        this.moodMeasurements = res.body || []
      });
    }
  }

  userName(user?: User): string {
    let result = '';
    if (user != null) {
      if (user.firstName != null && user.lastName != null) {
        result += user.firstName + ' ' + user.lastName;
      }

      result += ' (' + user.login + ')';

    }
    return result;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }

  setMood(user?: User, mood?: number): void {
    const moodMeasurement = new MoodMeasurement();
    moodMeasurement.user = user;
    moodMeasurement.message = 'Set on mood board.';
    moodMeasurement.mood = mood;
    this.subscribeToSaveResponse(this.moodMeasurementService.create(moodMeasurement));
  }


  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoodMeasurement>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.loadAll();
  }

  protected onSaveError(): void {
    this.loadAll();
  }


}
