import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMoodMeasurement } from 'app/shared/model/mood-measurement.model';
import { MoodMeasurementService } from './mood-measurement.service';

@Component({
  templateUrl: './mood-measurement-delete-dialog.component.html',
})
export class MoodMeasurementDeleteDialogComponent {
  moodMeasurement?: IMoodMeasurement;

  constructor(
    protected moodMeasurementService: MoodMeasurementService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moodMeasurementService.delete(id).subscribe(() => {
      this.eventManager.broadcast('moodMeasurementListModification');
      this.activeModal.close();
    });
  }
}
