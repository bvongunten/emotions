package ch.nostromo.emotions.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A MoodMeasurement.
 */
@Entity
@Table(name = "mood_measurement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class MoodMeasurement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Max(value = 99)
    @Column(name = "mood", nullable = false)
    private Integer mood;

    @Column(name = "message")
    private String message;

    @Column(name = "date")
    private Instant date;

    @ManyToOne
    @JsonIgnoreProperties(value = "moodMeasurements", allowSetters = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMood() {
        return mood;
    }

    public MoodMeasurement mood(Integer mood) {
        this.mood = mood;
        return this;
    }

    public void setMood(Integer mood) {
        this.mood = mood;
    }

    public String getMessage() {
        return message;
    }

    public MoodMeasurement message(String message) {
        this.message = message;
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getDate() {
        return date;
    }

    public MoodMeasurement date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public MoodMeasurement user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MoodMeasurement)) {
            return false;
        }
        return id != null && id.equals(((MoodMeasurement) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MoodMeasurement{" +
            "id=" + getId() +
            ", mood=" + getMood() +
            ", message='" + getMessage() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
