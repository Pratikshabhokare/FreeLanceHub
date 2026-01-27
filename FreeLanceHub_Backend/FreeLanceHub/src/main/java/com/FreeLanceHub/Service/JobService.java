package com.FreeLanceHub.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.FreeLanceHub.Dto.JobDto;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.JobStatus;

@Service
public interface JobService {
	
	public JobDto saveJob(Job job);

	// Update an existing job
	public JobDto updateJob(Long jobId, JobDto jobDto);

	// Delete a job by ID
	public void deleteJob(Long jobId);

	// Get a job by ID
	public JobDto getJobById(Long jobId);

	// Get all jobs with a specific status
	public List<JobDto> getJobsByStatus(JobStatus status);

    // Get jobs by Client ID
    public List<JobDto> getJobsByClient(Long clientId);

	// Search jobs by title/description (Simple)
	public List<JobDto> searchJobs(String keyword);

	// Advanced Search
	public List<JobDto> searchJobsAdvanced(String title, String description, List<String> skills, Double minBudget, Double maxBudget, String duration);
}
