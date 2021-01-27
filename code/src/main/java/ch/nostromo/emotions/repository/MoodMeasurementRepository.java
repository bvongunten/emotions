package ch.nostromo.emotions.repository;

import ch.nostromo.emotions.domain.MoodMeasurement;

import ch.nostromo.emotions.domain.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the MoodMeasurement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoodMeasurementRepository extends JpaRepository<MoodMeasurement, Long> {

    @Query("select moodMeasurement from MoodMeasurement moodMeasurement where moodMeasurement.user.login = ?#{principal.username}")
    List<MoodMeasurement> findByUserIsCurrentUser();

    Optional<MoodMeasurement> findTopByUserOrderByIdDesc(User user);

    List<MoodMeasurement> findByUserOrderByIdDesc(User user);


}
