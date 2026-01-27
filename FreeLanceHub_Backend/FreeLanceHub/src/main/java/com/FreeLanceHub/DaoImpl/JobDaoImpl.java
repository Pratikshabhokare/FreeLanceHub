package com.FreeLanceHub.DaoImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.FreeLanceHub.Dao.JobDao;
import com.FreeLanceHub.Dto.JobDto;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.JobStatus;
import com.FreeLanceHub.Repository.JobRepo;

@Repository
public class JobDaoImpl implements JobDao {

	@Autowired
	private JobRepo jobRepo;

	@Override
	public Boolean saveJob(Job job) {
		if (job == null)
			return false;
		jobRepo.save(job);
		return true;
	}

	@Override
	public Boolean updateJob(Long jobId, JobDto jobDto) {
		Job job = jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

		job.setTitle(jobDto.getTitle());
		job.setDescription(jobDto.getDescription());
		job.setBudget(jobDto.getBudget());
		job.setStatus(jobDto.getStatus());

		jobRepo.save(job);
		return true;
	}

	@Override
	public Boolean deleteJob(Long jobId) {
		if (!jobRepo.existsById(jobId))
			throw new RuntimeException("Job not found");

		jobRepo.deleteById(jobId);
		return true;
	}

	@Override
	public Job getJobById(Long jobId) {
		return jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
	}

	@Override
	public List<Job> getJobsByStatus(JobStatus status) {
		return jobRepo.findByStatus(status);
	}

    @Override
    public List<Job> findByClientId(Long clientId) {
        return jobRepo.findByClientId(clientId);
    }

	@Override
	public List<Job> searchJobs(String keyword) {
		return jobRepo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
	}

	@Override
	public List<Job> searchJobsAdvanced(org.springframework.data.jpa.domain.Specification<Job> spec) {
		return jobRepo.findAll(spec);
	}
}
