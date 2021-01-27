import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmotionsSharedModule } from 'app/shared/shared.module';
import { MoodMeasurementComponent } from './mood-measurement.component';
import { MoodMeasurementDetailComponent } from './mood-measurement-detail.component';
import { MoodMeasurementUpdateComponent } from './mood-measurement-update.component';
import { MoodMeasurementDeleteDialogComponent } from './mood-measurement-delete-dialog.component';
import { moodMeasurementRoute } from './mood-measurement.route';

@NgModule({
  imports: [EmotionsSharedModule, RouterModule.forChild(moodMeasurementRoute)],
  declarations: [
    MoodMeasurementComponent,
    MoodMeasurementDetailComponent,
    MoodMeasurementUpdateComponent,
    MoodMeasurementDeleteDialogComponent,
  ],
  entryComponents: [MoodMeasurementDeleteDialogComponent],
})
export class EmotionsMoodMeasurementModule {}
