package com.swasthyasetu.entity;

import com.swasthyasetu.entity.enums.QueueTokenStatus;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "queue_tokens", indexes = {
        @Index(name = "idx_token_facility", columnList = "facilityId"),
        @Index(name = "idx_token_date", columnList = "queueDate"),
        @Index(name = "idx_token_status", columnList = "status")
})
public class QueueToken {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String appointmentId;

    @Column(nullable = false, length = 64)
    private String facilityId;

    @Column(nullable = false, length = 32)
    private String tokenNumber;

    @Column(nullable = false)
    private LocalDate queueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private QueueTokenStatus status = QueueTokenStatus.WAITING;

    private Integer estimatedWaitMinutes = 15;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getFacilityId() { return facilityId; }
    public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public LocalDate getQueueDate() { return queueDate; }
    public void setQueueDate(LocalDate queueDate) { this.queueDate = queueDate; }

    public QueueTokenStatus getStatus() { return status; }
    public void setStatus(QueueTokenStatus status) { this.status = status; }

    public Integer getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }
}
