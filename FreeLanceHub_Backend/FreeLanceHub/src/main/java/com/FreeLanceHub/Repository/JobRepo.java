package com.FreeLanceHub.Repository;

import java.util.List;

import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepo extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    List<Job> findByStatus(JobStatus status);
    
    List<Job> findByClientId(Long clientId);

    List<Job> findByAssignedFreelancerId(Long freelancerId);

    List<Job> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String titleKeyword,
            String descriptionKeyword
    );
}