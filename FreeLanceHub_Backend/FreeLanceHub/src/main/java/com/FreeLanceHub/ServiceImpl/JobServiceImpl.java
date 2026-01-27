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
        jobDao.saveJob(job);
        return mapToDto(job);
    }

    @Override
    public JobDto updateJob(Long jobId, JobDto jobDto) {
        jobDao.updateJob(jobId, jobDto);
        Job updatedJob = jobDao.getJobById(jobId);
        return mapToDto(updatedJob);
    }

    @Override
    public void deleteJob(Long jobId) {
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
    public List<JobDto> searchJobs(String keyword) {
        return jobDao.searchJobs(keyword)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<JobDto> searchJobsAdvanced(String title, String description, List<String> skills, Double minBudget, Double maxBudget, String duration) {
        return jobDao.searchJobsAdvanced(
                com.FreeLanceHub.Specification.JobSpecification.filterJobs(title, description, skills, minBudget, maxBudget, duration)
        ).stream().map(this::mapToDto).toList();
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
        return dto;
    }
}
