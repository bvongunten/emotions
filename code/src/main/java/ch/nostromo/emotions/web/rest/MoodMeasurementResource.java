package ch.nostromo.emotions.web.rest;

import ch.nostromo.emotions.domain.MoodMeasurement;
import ch.nostromo.emotions.domain.Team;
import ch.nostromo.emotions.domain.User;
import ch.nostromo.emotions.repository.MoodMeasurementRepository;
import ch.nostromo.emotions.repository.TeamRepository;
import ch.nostromo.emotions.repository.UserRepository;
import ch.nostromo.emotions.security.AuthoritiesConstants;
import ch.nostromo.emotions.security.SecurityUtils;
import ch.nostromo.emotions.service.UserService;
import ch.nostromo.emotions.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link ch.nostromo.emotions.domain.MoodMeasurement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MoodMeasurementResource {

    private final Logger log = LoggerFactory.getLogger(MoodMeasurementResource.class);

    private static final String ENTITY_NAME = "moodMeasurement";

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TeamRepository teamRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MoodMeasurementRepository moodMeasurementRepository;

    public MoodMeasurementResource(MoodMeasurementRepository moodMeasurementRepository) {
        this.moodMeasurementRepository = moodMeasurementRepository;
    }

    /**
     * {@code POST  /mood-measurements} : Create a new moodMeasurement.
     *
     * @param moodMeasurement the moodMeasurement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new moodMeasurement, or with status {@code 400 (Bad Request)} if the moodMeasurement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mood-measurements")
    public ResponseEntity<MoodMeasurement> createMoodMeasurement(@Valid @RequestBody MoodMeasurement moodMeasurement) throws URISyntaxException {
        log.debug("REST request to save MoodMeasurement : {}", moodMeasurement);
        if (moodMeasurement.getId() != null) {
            throw new BadRequestAlertException("A new moodMeasurement cannot already have an ID", ENTITY_NAME, "idexists");
        }

        if (moodMeasurement.getDate() == null) {
            moodMeasurement.setDate(new Date().toInstant());
        }

        User loggedInUser = userService.getUserWithAuthorities().get();

        if (moodMeasurement.getUser() == null) {
            moodMeasurement.setUser(loggedInUser);
        } else {
            boolean isAdmin = SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN);
            if (!isAdmin && !loggedInUser.equals(moodMeasurement.getUser())) {
                throw new BadCredentialsException("Incorrect user: " + moodMeasurement.getUser());

            }
        }

        MoodMeasurement result = moodMeasurementRepository.save(moodMeasurement);
        return ResponseEntity.created(new URI("/api/mood-measurements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mood-measurements} : Updates an existing moodMeasurement.
     *
     * @param moodMeasurement the moodMeasurement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moodMeasurement,
     * or with status {@code 400 (Bad Request)} if the moodMeasurement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the moodMeasurement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mood-measurements")
    public ResponseEntity<MoodMeasurement> updateMoodMeasurement(@Valid @RequestBody MoodMeasurement moodMeasurement) throws URISyntaxException {
        log.debug("REST request to update MoodMeasurement : {}", moodMeasurement);
        if (moodMeasurement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MoodMeasurement result = moodMeasurementRepository.save(moodMeasurement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, moodMeasurement.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /mood-measurements} : get all the moodMeasurements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of moodMeasurements in body.
     */
    @GetMapping("/mood-measurements")
    public List<MoodMeasurement> getAllMoodMeasurements() {
        log.debug("REST request to get all MoodMeasurements");
        return moodMeasurementRepository.findAll();
    }

    /**
     * {@code GET  /mood-measurements/:id} : get the "id" moodMeasurement.
     *
     * @param id the id of the moodMeasurement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the moodMeasurement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mood-measurements/{id}")
    public ResponseEntity<MoodMeasurement> getMoodMeasurement(@PathVariable Long id) {
        log.debug("REST request to get MoodMeasurement : {}", id);
        Optional<MoodMeasurement> moodMeasurement = moodMeasurementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(moodMeasurement);
    }

    /**
     * {@code DELETE  /mood-measurements/:id} : delete the "id" moodMeasurement.
     *
     * @param id the id of the moodMeasurement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mood-measurements/{id}")
    public ResponseEntity<Void> deleteMoodMeasurement(@PathVariable Long id) {
        log.debug("REST request to delete MoodMeasurement : {}", id);
        moodMeasurementRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/mood-measurements/user/latest/{id}")
    public ResponseEntity<MoodMeasurement> getLastMoodMeasurementByUserId(@PathVariable Long id) {
        log.debug("REST request to get latest MoodMeasurement by user id : {}", id);
        User user = userRepository.findById(id).get();
        Optional<MoodMeasurement> moodMeasurement = moodMeasurementRepository.findTopByUserOrderByIdDesc(user);
        return ResponseUtil.wrapOrNotFound(moodMeasurement);
    }

    @GetMapping("/mood-measurements/user/{id}")
    public List<MoodMeasurement> getMoodMeasurementsByUserId(@PathVariable Long id) {
        log.debug("REST request to get all MoodMeasurement by user id : {}", id);

        User user = userRepository.findById(id).get();
        return moodMeasurementRepository.findByUserOrderByIdDesc(user);
    }

    @GetMapping("/mood-measurements/team/latest/{id}")
    public List<MoodMeasurement> getLastMoodMeasurementByTeamId(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to get latest MoodMeasurement by team id : {}", id);

        List<MoodMeasurement> result = new ArrayList<>();

        Team team = teamRepository.findById(id).get();
        for (User user : team.getUsers()) {

            Optional<MoodMeasurement> moodMeasurementOptional = moodMeasurementRepository.findTopByUserOrderByIdDesc(user);
            MoodMeasurement moodMeasurement = null;

            if (moodMeasurementOptional.isPresent()) {
                moodMeasurement = moodMeasurementOptional.get();
            } else {
                MoodMeasurement measurementToInsert = new MoodMeasurement();
                measurementToInsert.setUser(user);
                measurementToInsert.setMood(50);
                measurementToInsert.setMessage("Created on first mood board view.");
                measurementToInsert.setDate(new Date().toInstant());

                moodMeasurement = moodMeasurementRepository.save(measurementToInsert);
            }


            result.add(moodMeasurement);
        }

        return result;
    }



}
