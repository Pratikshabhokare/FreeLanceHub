package com.FreeLanceHub.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FreeLanceHub.Dto.FreeLancerProfileDto;
import com.FreeLanceHub.Dto.JobDto;
import com.FreeLanceHub.Dto.JobMapper;
import com.FreeLanceHub.Dto.ProposalDto;
import com.FreeLanceHub.Entity.FreeLancerProfile;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.JobStatus;
import com.FreeLanceHub.Entity.Proposal;
import com.FreeLanceHub.Entity.ProposalStatus;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.FreeLancerProfileRepo;
import com.FreeLanceHub.Repository.JobRepo;
import com.FreeLanceHub.Repository.ProposalRepo;
import com.FreeLanceHub.Repository.UserRepo;
import com.FreeLanceHub.Service.FreeLancerService;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Service
@Transactional
public class FreeLancerServiceImpl implements FreeLancerService {

	@Autowired
	private JobRepo jobRepository;

	@Autowired
	private ProposalRepo proposalRepository;

	@Autowired
	private UserRepo userRepository;

	@Autowired
	private FreeLancerProfileRepo profileRepository;

	/* -------------------- Browse Jobs -------------------- */
	@Override
	public List<JobDto> browseJobs() {

		List<Job> jobs = jobRepository.findByStatus(JobStatus.OPEN);

		return jobs.stream().map(JobMapper::toDto).collect(Collectors.toList());
	}

	/* -------------------- Submit Proposal -------------------- */
	@Override
	public Proposal submitProposal(Long freelancerId, ProposalDto request) {

		User freelancer = userRepository.findById(freelancerId)
				.orElseThrow(() -> new RuntimeException("Freelancer not found"));

		Job job = jobRepository.findById(request.getJobId()).orElseThrow(() -> new RuntimeException("Job not found"));

		// Prevent duplicate proposal
		if (proposalRepository.existsByJobIdAndFreelancerId(job.getId(), freelancerId)) {
			throw new RuntimeException("Proposal already submitted");
		}

		Proposal proposal = new Proposal();
		proposal.setJob(job);
		proposal.setFreelancer(freelancer);
		proposal.setBidAmount(request.getBidAmount());
		proposal.setMessage(request.getMessage());
		proposal.setStatus(ProposalStatus.PENDING);

		return proposalRepository.save(proposal);
	}

	/* -------------------- Assigned Jobs -------------------- */
	@Override
	public List<JobDto> getAssignedJobs(Long freelancerId) {

		List<Job> jobs = jobRepository.findByAssignedFreelancerId(freelancerId);

		return jobs.stream().map(JobMapper::toDto).collect(Collectors.toList());
	}

	/* -------------------- Update Job Status -------------------- */
	@Override
	public void updateJobStatus(Long freelancerId, Long jobId, JobStatus status) {

		Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

		if (!job.getAssignedFreelancer().getId().equals(freelancerId)) {
			throw new RuntimeException("Unauthorized action");
		}

		job.setStatus(status);
		jobRepository.save(job);
	}

	/* -------------------- Freelancer Profile -------------------- */
	@Override
	public FreeLancerProfile saveOrUpdateProfile(Long freelancerId, FreeLancerProfileDto request) {

		User freelancer = userRepository.findById(freelancerId)
				.orElseThrow(() -> new RuntimeException("Freelancer not found"));

		FreeLancerProfile profile = profileRepository.findByFreelancerId(freelancerId).orElse(new FreeLancerProfile());

		profile.setFreelancer(freelancer);
		profile.setSkills(request.getSkills());
		profile.setExperience(request.getExperience());
		profile.setHourlyRate(request.getHourlyRate());
		profile.setBio(request.getBio());
		profile.setTitle(request.getTitle());

		return profileRepository.save(profile);
	}

	@Override
	public FreeLancerProfile getProfile(Long freelancerId) {
		return profileRepository.findByFreelancerId(freelancerId).orElse(null);
	}

	/* -------------------- Search Freelancers -------------------- */
	@Override
	public List<FreeLancerProfile> searchFreelancersBySkills(String skills) {
		return profileRepository.findBySkillsContainingIgnoreCase(skills);
	}

	@Override
	public List<FreeLancerProfile> searchFreelancersAdvanced(String skills, Double maxHourlyRate, Integer minExperience) {
		return profileRepository.findAll(
				com.FreeLanceHub.Specification.FreelancerSpecification.filterFreelancers(skills, maxHourlyRate, minExperience)
		);
	}
}
