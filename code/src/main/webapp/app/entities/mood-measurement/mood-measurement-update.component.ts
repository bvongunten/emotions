import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IMoodMeasurement, MoodMeasurement } from 'app/shared/model/mood-measurement.model';
import { MoodMeasurementService } from './mood-measurement.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-mood-measurement-update',
  templateUrl: './mood-measurement-update.component.html',
})
export class MoodMeasurementUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    mood: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
    message: [],
    date: [],
    user: [],
  });

  constructor(
    protected moodMeasurementService: MoodMeasurementService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodMeasurement }) => {
      if (!moodMeasurement.id) {
        const today = moment().startOf('day');
        moodMeasurement.date = today;
      }

      this.updateForm(moodMeasurement);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    });
  }

  updateForm(moodMeasurement: IMoodMeasurement): void {
    this.editForm.patchValue({
      id: moodMeasurement.id,
      mood: moodMeasurement.mood,
      message: moodMeasurement.message,
      date: moodMeasurement.date ? moodMeasurement.date.format(DATE_TIME_FORMAT) : null,
      user: moodMeasurement.user,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const moodMeasurement = this.createFromForm();
    if (moodMeasurement.id !== undefined) {
      this.subscribeToSaveResponse(this.moodMeasurementService.update(moodMeasurement));
    } else {
      this.subscribeToSaveResponse(this.moodMeasurementService.create(moodMeasurement));
    }
  }

  private createFromForm(): IMoodMeasurement {
    return {
      ...new MoodMeasurement(),
      id: this.editForm.get(['id'])!.value,
      mood: this.editForm.get(['mood'])!.value,
      message: this.editForm.get(['message'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      user: this.editForm.get(['user'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoodMeasurement>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}
