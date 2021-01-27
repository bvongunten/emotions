import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMoodMeasurement } from 'app/shared/model/mood-measurement.model';

@Component({
  selector: 'jhi-mood-measurement-detail',
  templateUrl: './mood-measurement-detail.component.html',
})
export class MoodMeasurementDetailComponent implements OnInit {
  moodMeasurement: IMoodMeasurement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodMeasurement }) => (this.moodMeasurement = moodMeasurement));
  }

  previousState(): void {
    window.history.back();
  }
}
