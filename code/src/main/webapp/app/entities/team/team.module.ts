import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmotionsSharedModule } from 'app/shared/shared.module';
import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamMoodBoardComponent } from './team-moodboard.component';
import { TeamUpdateComponent } from './team-update.component';
import { TeamDeleteDialogComponent } from './team-delete-dialog.component';
import { teamRoute } from './team.route';

@NgModule({
  imports: [EmotionsSharedModule, RouterModule.forChild(teamRoute)],
  declarations: [TeamComponent, TeamDetailComponent, TeamMoodBoardComponent, TeamUpdateComponent, TeamDeleteDialogComponent],
  entryComponents: [TeamDeleteDialogComponent],
})
export class EmotionsTeamModule {}
