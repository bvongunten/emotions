package ch.nostromo.emotions.web.rest;

import ch.nostromo.emotions.domain.MoodMeasurement;
import ch.nostromo.emotions.domain.Team;
import ch.nostromo.emotions.domain.User;
import ch.nostromo.emotions.repository.MoodMeasurementRepository;
import ch.nostromo.emotions.repository.TeamRepository;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link Team}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PublicResource {

    private final Logger log = LoggerFactory.getLogger(PublicResource.class);

    private final TeamRepository teamRepository;

    private final MoodMeasurementRepository moodMeasurementRepository;

    private final MoodMeasurementResource moodMeasurementResource;
    private final TeamResource teamResource;

    public PublicResource(TeamRepository teamRepository, MoodMeasurementRepository moodMeasurementRepository, MoodMeasurementResource moodMeasurementResource, TeamResource teamResource) {
        this.teamRepository = teamRepository;
        this.moodMeasurementRepository = moodMeasurementRepository;
        this.moodMeasurementResource = moodMeasurementResource;
        this.teamResource  = teamResource;
    }

    /**
     * {@code GET  /teams} : get all the teams.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teams in body.
     */
    @GetMapping("/publicmoodboards")
    public List<Team> getPublicMoodBoards(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Teams");
        return teamResource.getAllTeams(eagerload);
    }

    @GetMapping("/publicmoodboard/{id}")
    public List<MoodMeasurement> getPublicMoodBoard(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to get latest MoodMeasurement by team id : {}", id);
        return moodMeasurementResource.getLastMoodMeasurementByTeamId(id);
    }


    @GetMapping("/publicteam/{id}")
    public ResponseEntity<Team> getPublicTeam(@PathVariable Long id) {
        log.debug("REST request to get Team : {}", id);
        return teamResource.getTeam(id);
    }

}
