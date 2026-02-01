package com.FreeLanceHub.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FreeLanceHub.Dao.JobDao;
import com.FreeLanceHub.Dto.JobDto;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.JobStatus;
import com.FreeLanceHub.Service.JobService;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobDao jobDao;

    @Autowired
    private com.FreeLanceHub.Dao.UserDao userDao;

    @Override
    public JobDto saveJob(Job job) {
        if (job.getClient() != null && job.getClient().getId() != null) {
            com.FreeLanceHub.Entity.User client = userDao.getUserById(job.getClient().getId());
            if (client != null) {
                job.setClient(client);
            } else {
                throw new RuntimeException("Client User not found with ID: " + job.getClient().getId());
            }
        } else {
            throw new RuntimeException("Job must have a Client ID");
        }
        Job savedJob = jobDao.saveJob(job);
        return mapToDto(savedJob);
    }

    @Override
    public JobDto updateJob(Long jobId, JobDto jobDto) {
        Job existingJob = jobDao.getJobById(jobId);
        if (existingJob == null) {
            throw new RuntimeException("Job not found with ID: " + jobId);
        }

        // Validate ownership - only allow update if user is the job creator
        // Note: In a real app, you'd get the current user from SecurityContext
        // For now, we'll check if the client ID matches
        if (jobDto.getClientId() != null && existingJob.getClient() != null) {
            if (!existingJob.getClient().getId().equals(jobDto.getClientId())) {
                throw new RuntimeException("Unauthorized: You can only edit jobs you created");
            }
        }

        jobDao.updateJob(jobId, jobDto);
        Job updatedJob = jobDao.getJobById(jobId);
        return mapToDto(updatedJob);
    }

    @Override
    public void deleteJob(Long jobId, Long currentUserId) {
        Job existingJob = jobDao.getJobById(jobId);
        if (existingJob == null) {
            throw new RuntimeException("Job not found with ID: " + jobId);
        }

        // Validate ownership - only allow deletion if user is the job creator
        if (existingJob.getClient() == null || !existingJob.getClient().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized: You can only delete jobs you created");
        }

        jobDao.deleteJob(jobId);
    }

    @Override
    public JobDto getJobById(Long jobId) {
        return mapToDto(jobDao.getJobById(jobId));
    }

    @Override
    public List<JobDto> getJobsByStatus(JobStatus status) {
        return jobDao.getJobsByStatus(status)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<JobDto> getJobsByClient(Long clientId) {
        return jobDao.findByClientId(clientId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<JobDto> getJobsByFreelancer(Long freelancerId) {
        return jobDao.findByAssignedFreelancerId(freelancerId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<JobDto> searchJobs(String keyword) {
        return jobDao.searchJobs(keyword)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<JobDto> searchJobsAdvanced(String keyword, String title, String description, List<String> skills,
            Double minBudget,
            Double maxBudget, String duration) {
        return jobDao.searchJobsAdvanced(
                com.FreeLanceHub.Specification.JobSpecification.filterJobs(keyword, title, description, skills,
                        minBudget,
                        maxBudget, duration))
                .stream().map(this::mapToDto).toList();
    }

    // ------------------ MAPPER ------------------
    private JobDto mapToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setBudget(job.getBudget());
        dto.setStatus(job.getStatus());
        dto.setSkills(job.getSkills());
        dto.setDuration(job.getDuration());
        dto.setVisibility(job.getVisibility());
        dto.setBudgetType(job.getBudgetType());
        dto.setBudgetMin(job.getBudgetMin());
        dto.setBudgetMax(job.getBudgetMax());

        // Include client ID for ownership validation
        if (job.getClient() != null) {
            dto.setClientId(job.getClient().getId());
            dto.setClientName(job.getClient().getName());
        }

        // Include assigned freelancer info
        if (job.getAssignedFreelancer() != null) {
            dto.setAssignedFreelancerId(job.getAssignedFreelancer().getId());
            dto.setAssignedFreelancerName(job.getAssignedFreelancer().getName());
        }

        return dto;
    }
}
