import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EmotionsTestModule } from '../../../test.module';
import { MoodMeasurementUpdateComponent } from 'app/entities/mood-measurement/mood-measurement-update.component';
import { MoodMeasurementService } from 'app/entities/mood-measurement/mood-measurement.service';
import { MoodMeasurement } from 'app/shared/model/mood-measurement.model';

describe('Component Tests', () => {
  describe('MoodMeasurement Management Update Component', () => {
    let comp: MoodMeasurementUpdateComponent;
    let fixture: ComponentFixture<MoodMeasurementUpdateComponent>;
    let service: MoodMeasurementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmotionsTestModule],
        declarations: [MoodMeasurementUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(MoodMeasurementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MoodMeasurementUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MoodMeasurementService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new MoodMeasurement(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new MoodMeasurement();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
