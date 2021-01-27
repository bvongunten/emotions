package ch.nostromo.emotions.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import ch.nostromo.emotions.web.rest.TestUtil;

public class MoodMeasurementTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MoodMeasurement.class);
        MoodMeasurement moodMeasurement1 = new MoodMeasurement();
        moodMeasurement1.setId(1L);
        MoodMeasurement moodMeasurement2 = new MoodMeasurement();
        moodMeasurement2.setId(moodMeasurement1.getId());
        assertThat(moodMeasurement1).isEqualTo(moodMeasurement2);
        moodMeasurement2.setId(2L);
        assertThat(moodMeasurement1).isNotEqualTo(moodMeasurement2);
        moodMeasurement1.setId(null);
        assertThat(moodMeasurement1).isNotEqualTo(moodMeasurement2);
    }
}
