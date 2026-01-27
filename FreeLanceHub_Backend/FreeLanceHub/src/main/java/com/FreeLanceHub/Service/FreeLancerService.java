package com.FreeLanceHub.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.FreeLanceHub.Dto.FreeLancerProfileDto;
import com.FreeLanceHub.Dto.JobDto;
import com.FreeLanceHub.Dto.ProposalDto;
import com.FreeLanceHub.Entity.FreeLancerProfile;
import com.FreeLanceHub.Entity.JobStatus;
import com.FreeLanceHub.Entity.Proposal;

import jakarta.validation.Valid;

@Service
public interface FreeLancerService {

	public List<JobDto> browseJobs();

	Proposal submitProposal(Long freelancerId, ProposalDto request);

	public List<JobDto> getAssignedJobs(Long freelancerId);

	public void updateJobStatus(Long freelancerId, Long jobId, JobStatus status);

	public FreeLancerProfile saveOrUpdateProfile(Long freelancerId, FreeLancerProfileDto profileDto);
	
	public FreeLancerProfile getProfile(Long freelancerId);

	public List<FreeLancerProfile> searchFreelancersBySkills(String skills);

	public List<FreeLancerProfile> searchFreelancersAdvanced(String skills, Double maxHourlyRate, Integer minExperience);
}
