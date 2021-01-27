import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EmotionsTestModule } from '../../../test.module';
import { MoodMeasurementComponent } from 'app/entities/mood-measurement/mood-measurement.component';
import { MoodMeasurementService } from 'app/entities/mood-measurement/mood-measurement.service';
import { MoodMeasurement } from 'app/shared/model/mood-measurement.model';

describe('Component Tests', () => {
  describe('MoodMeasurement Management Component', () => {
    let comp: MoodMeasurementComponent;
    let fixture: ComponentFixture<MoodMeasurementComponent>;
    let service: MoodMeasurementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmotionsTestModule],
        declarations: [MoodMeasurementComponent],
      })
        .overrideTemplate(MoodMeasurementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MoodMeasurementComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MoodMeasurementService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new MoodMeasurement(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.moodMeasurements && comp.moodMeasurements[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
