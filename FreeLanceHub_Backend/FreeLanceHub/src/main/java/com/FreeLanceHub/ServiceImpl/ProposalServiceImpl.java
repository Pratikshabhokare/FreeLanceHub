package com.FreeLanceHub.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FreeLanceHub.Dto.ProposalDto;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.Proposal;
import com.FreeLanceHub.Entity.ProposalStatus;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.JobRepo;
import com.FreeLanceHub.Repository.ProposalRepo;
import com.FreeLanceHub.Repository.UserRepo;
import com.FreeLanceHub.Service.ProposalService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProposalServiceImpl implements ProposalService {
	
	@Autowired
	private ProposalRepo proposalRepo;

	@Autowired
	private JobRepo jobRepo;

	@Autowired
	private UserRepo userRepo;

    @Autowired
    private com.FreeLanceHub.Service.NotificationService notificationService;

	@Override
	public Proposal submitProposal(Long freelancerId, ProposalDto proposalDto) {
		
		Job job = jobRepo.findById(proposalDto.getJobId())
				.orElseThrow(() -> new RuntimeException("Job not found"));

		User freelancer = userRepo.findById(freelancerId)
				.orElseThrow(() -> new RuntimeException("Freelancer not found"));

		// Check if freelancer has already submitted a proposal for this job
		if (proposalRepo.existsByJobIdAndFreelancerId(job.getId(), freelancer.getId())) {
			throw new RuntimeException("You have already submitted a proposal for this job");
		}

		Proposal proposal = new Proposal();
		proposal.setJob(job);
		proposal.setFreelancer(freelancer);
		proposal.setBidAmount(proposalDto.getBidAmount());
		proposal.setMessage(proposalDto.getMessage());
		proposal.setStatus(ProposalStatus.PENDING);

		Proposal savedProposal = proposalRepo.save(proposal);

        // Notify client
        notificationService.createNotification(
            job.getClient(), 
            "New proposal received for job: " + job.getTitle() + " from " + freelancer.getName(), 
            com.FreeLanceHub.Entity.NotificationType.PROPOSAL_SUBMITTED
        );

        return savedProposal;
	}

	@Override
	public List<Proposal> getProposalsByJob(Long jobId) {
		Job job = jobRepo.findById(jobId)
				.orElseThrow(() -> new RuntimeException("Job not found"));
		return proposalRepo.findByJobId(job.getId());
	}

	@Override
	public Proposal getProposalById(Long proposalId) {
		return proposalRepo.findById(proposalId)
				.orElseThrow(() -> new RuntimeException("Proposal not found"));
	}

	@Override
	public void updateProposalStatus(Long proposalId, ProposalStatus status) {
		Proposal proposal = proposalRepo.findById(proposalId)
				.orElseThrow(() -> new RuntimeException("Proposal not found"));
		proposal.setStatus(status);
		proposalRepo.save(proposal);

        // If Accepted, assign freelancer to job and update job status
        if (status == ProposalStatus.ACCEPTED) {
            Job job = proposal.getJob();
            // Verify job is still open
            if (job.getStatus() != com.FreeLanceHub.Entity.JobStatus.OPEN) {
                throw new RuntimeException("Job is not open for assignment.");
            }
            job.setAssignedFreelancer(proposal.getFreelancer());
            job.setStatus(com.FreeLanceHub.Entity.JobStatus.IN_PROGRESS);
            jobRepo.save(job);
        }

        // Notify freelancer
        com.FreeLanceHub.Entity.NotificationType type = status == ProposalStatus.ACCEPTED ? 
            com.FreeLanceHub.Entity.NotificationType.PROPOSAL_ACCEPTED : 
            com.FreeLanceHub.Entity.NotificationType.PROPOSAL_SUBMITTED; // Fallback or new type?
        
        // Use general message for status change
        notificationService.createNotification(
            proposal.getFreelancer(), 
            "Your proposal for job '" + proposal.getJob().getTitle() + "' was " + status, 
            type
        );
	}

	@Override
	public List<Proposal> getProposalsByFreelancer(Long freelancerId) {
		return proposalRepo.findByFreelancerId(freelancerId);
	}

}
