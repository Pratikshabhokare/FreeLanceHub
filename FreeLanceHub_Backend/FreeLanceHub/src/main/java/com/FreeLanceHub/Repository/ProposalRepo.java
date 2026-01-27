package com.FreeLanceHub.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.FreeLanceHub.Entity.Proposal;

@Repository
public interface ProposalRepo extends JpaRepository<Proposal, Long> {

	List<Proposal> findByJobId(Long jobId);

	boolean existsByJobIdAndFreelancerId(Long jobId, Long freelancerId);
	
	List<Proposal> findByFreelancerId(Long freelancerId);

}