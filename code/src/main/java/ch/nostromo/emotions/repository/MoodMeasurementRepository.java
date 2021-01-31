package ch.nostromo.emotions.repository;

import ch.nostromo.emotions.domain.MoodMeasurement;

import ch.nostromo.emotions.domain.User;
import ch.nostromo.emotions.domain.Team;
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
    
    @Query("select m1 from Team team join team.users u join MoodMeasurement m1 on u = m1.user left join MoodMeasurement m2 on m1.user = m2.user AND m1.id < m2.id where m2 is null and team = ?1")
    List<MoodMeasurement> findTopByTeam(Team team);

    Optional<MoodMeasurement> findTopByUserOrderByIdDesc(User user);

    List<MoodMeasurement> findByUserOrderByIdDesc(User user);


}
