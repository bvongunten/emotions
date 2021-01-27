package ch.nostromo.emotions.web.rest;

import ch.nostromo.emotions.EmotionsApp;
import ch.nostromo.emotions.domain.MoodMeasurement;
import ch.nostromo.emotions.repository.MoodMeasurementRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link MoodMeasurementResource} REST controller.
 */
@SpringBootTest(classes = EmotionsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class MoodMeasurementResourceIT {

    private static final Integer DEFAULT_MOOD = 0;
    private static final Integer UPDATED_MOOD = 1;

    private static final String DEFAULT_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private MoodMeasurementRepository moodMeasurementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMoodMeasurementMockMvc;

    private MoodMeasurement moodMeasurement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodMeasurement createEntity(EntityManager em) {
        MoodMeasurement moodMeasurement = new MoodMeasurement()
            .mood(DEFAULT_MOOD)
            .message(DEFAULT_MESSAGE)
            .date(DEFAULT_DATE);
        return moodMeasurement;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoodMeasurement createUpdatedEntity(EntityManager em) {
        MoodMeasurement moodMeasurement = new MoodMeasurement()
            .mood(UPDATED_MOOD)
            .message(UPDATED_MESSAGE)
            .date(UPDATED_DATE);
        return moodMeasurement;
    }

    @BeforeEach
    public void initTest() {
        moodMeasurement = createEntity(em);
    }

    @Test
    @Transactional
    public void createMoodMeasurement() throws Exception {
        int databaseSizeBeforeCreate = moodMeasurementRepository.findAll().size();
        // Create the MoodMeasurement
        restMoodMeasurementMockMvc.perform(post("/api/mood-measurements")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(moodMeasurement)))
            .andExpect(status().isCreated());

        // Validate the MoodMeasurement in the database
        List<MoodMeasurement> moodMeasurementList = moodMeasurementRepository.findAll();
        assertThat(moodMeasurementList).hasSize(databaseSizeBeforeCreate + 1);
        MoodMeasurement testMoodMeasurement = moodMeasurementList.get(moodMeasurementList.size() - 1);
        assertThat(testMoodMeasurement.getMood()).isEqualTo(DEFAULT_MOOD);
        assertThat(testMoodMeasurement.getMessage()).isEqualTo(DEFAULT_MESSAGE);
        assertThat(testMoodMeasurement.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createMoodMeasurementWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = moodMeasurementRepository.findAll().size();

        // Create the MoodMeasurement with an existing ID
        moodMeasurement.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoodMeasurementMockMvc.perform(post("/api/mood-measurements")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(moodMeasurement)))
            .andExpect(status().isBadRequest());

        // Validate the MoodMeasurement in the database
        List<MoodMeasurement> moodMeasurementList = moodMeasurementRepository.findAll();
        assertThat(moodMeasurementList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkMoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = moodMeasurementRepository.findAll().size();
        // set the field null
        moodMeasurement.setMood(null);

        // Create the MoodMeasurement, which fails.


        restMoodMeasurementMockMvc.perform(post("/api/mood-measurements")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(moodMeasurement)))
            .andExpect(status().isBadRequest());

        List<MoodMeasurement> moodMeasurementList = moodMeasurementRepository.findAll();
        assertThat(moodMeasurementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMoodMeasurements() throws Exception {
        // Initialize the database
        moodMeasurementRepository.saveAndFlush(moodMeasurement);

        // Get all the moodMeasurementList
        restMoodMeasurementMockMvc.perform(get("/api/mood-measurements?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moodMeasurement.getId().intValue())))
            .andExpect(jsonPath("$.[*].mood").value(hasItem(DEFAULT_MOOD)))
            .andExpect(jsonPath("$.[*].message").value(hasItem(DEFAULT_MESSAGE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getMoodMeasurement() throws Exception {
        // Initialize the database
        moodMeasurementRepository.saveAndFlush(moodMeasurement);

        // Get the moodMeasurement
        restMoodMeasurementMockMvc.perform(get("/api/mood-measurements/{id}", moodMeasurement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(moodMeasurement.getId().intValue()))
            .andExpect(jsonPath("$.mood").value(DEFAULT_MOOD))
            .andExpect(jsonPath("$.message").value(DEFAULT_MESSAGE))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingMoodMeasurement() throws Exception {
        // Get the moodMeasurement
        restMoodMeasurementMockMvc.perform(get("/api/mood-measurements/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMoodMeasurement() throws Exception {
        // Initialize the database
        moodMeasurementRepository.saveAndFlush(moodMeasurement);

        int databaseSizeBeforeUpdate = moodMeasurementRepository.findAll().size();

        // Update the moodMeasurement
        MoodMeasurement updatedMoodMeasurement = moodMeasurementRepository.findById(moodMeasurement.getId()).get();
        // Disconnect from session so that the updates on updatedMoodMeasurement are not directly saved in db
        em.detach(updatedMoodMeasurement);
        updatedMoodMeasurement
            .mood(UPDATED_MOOD)
            .message(UPDATED_MESSAGE)
            .date(UPDATED_DATE);

        restMoodMeasurementMockMvc.perform(put("/api/mood-measurements")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedMoodMeasurement)))
            .andExpect(status().isOk());

        // Validate the MoodMeasurement in the database
        List<MoodMeasurement> moodMeasurementList = moodMeasurementRepository.findAll();
        assertThat(moodMeasurementList).hasSize(databaseSizeBeforeUpdate);
        MoodMeasurement testMoodMeasurement = moodMeasurementList.get(moodMeasurementList.size() - 1);
        assertThat(testMoodMeasurement.getMood()).isEqualTo(UPDATED_MOOD);
        assertThat(testMoodMeasurement.getMessage()).isEqualTo(UPDATED_MESSAGE);
        assertThat(testMoodMeasurement.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingMoodMeasurement() throws Exception {
        int databaseSizeBeforeUpdate = moodMeasurementRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoodMeasurementMockMvc.perform(put("/api/mood-measurements")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(moodMeasurement)))
            .andExpect(status().isBadRequest());

        // Validate the MoodMeasurement in the database
        List<MoodMeasurement> moodMeasurementList = moodMeasurementRepository.findAll();
        assertThat(moodMeasurementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMoodMeasurement() throws Exception {
        // Initialize the database
        moodMeasurementRepository.saveAndFlush(moodMeasurement);

        int databaseSizeBeforeDelete = moodMeasurementRepository.findAll().size();

        // Delete the moodMeasurement
        restMoodMeasurementMockMvc.perform(delete("/api/mood-measurements/{id}", moodMeasurement.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MoodMeasurement> moodMeasurementList = moodMeasurementRepository.findAll();
        assertThat(moodMeasurementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
