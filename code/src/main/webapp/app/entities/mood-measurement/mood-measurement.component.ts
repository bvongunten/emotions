import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMoodMeasurement } from 'app/shared/model/mood-measurement.model';
import { MoodMeasurementService } from './mood-measurement.service';
import { MoodMeasurementDeleteDialogComponent } from './mood-measurement-delete-dialog.component';

@Component({
  selector: 'jhi-mood-measurement',
  templateUrl: './mood-measurement.component.html',
})
export class MoodMeasurementComponent implements OnInit, OnDestroy {
  moodMeasurements?: IMoodMeasurement[];
  eventSubscriber?: Subscription;

  constructor(
    protected moodMeasurementService: MoodMeasurementService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.moodMeasurementService.query().subscribe((res: HttpResponse<IMoodMeasurement[]>) => (this.moodMeasurements = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInMoodMeasurements();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IMoodMeasurement): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInMoodMeasurements(): void {
    this.eventSubscriber = this.eventManager.subscribe('moodMeasurementListModification', () => this.loadAll());
  }

  delete(moodMeasurement: IMoodMeasurement): void {
    const modalRef = this.modalService.open(MoodMeasurementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.moodMeasurement = moodMeasurement;
  }
}
