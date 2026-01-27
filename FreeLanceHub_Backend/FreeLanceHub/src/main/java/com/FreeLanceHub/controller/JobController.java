package com.FreeLanceHub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FreeLanceHub.Dto.JobDto;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.JobStatus;
import com.FreeLanceHub.Service.JobService;

@RestController
@RequestMapping("/job")
public class JobController {

	@Autowired
	private JobService jobService;

	// 🔹 Create Job
	@PostMapping("/save")
	public JobDto saveJob(@RequestBody Job job) {
		return jobService.saveJob(job);
	}

	// 🔹 Update Job
	@PutMapping("/update/{jobId}")
	public JobDto updateJob(@PathVariable Long jobId, @RequestBody JobDto jobDto) {
		return jobService.updateJob(jobId, jobDto);
	}

	// 🔹 Delete Job
	@DeleteMapping("/delete/{jobId}")
	public String deleteJob(@PathVariable Long jobId) {
		jobService.deleteJob(jobId);
		return "Job deleted successfully";
	}

	// 🔹 Get Job by ID
	@GetMapping("/{jobId}")
	public JobDto getJobById(@PathVariable Long jobId) {
		return jobService.getJobById(jobId);
	}

	// 🔹 Get Jobs by Status
	@GetMapping("/status/{status}")
	public List<JobDto> getJobsByStatus(@PathVariable JobStatus status) {
		return jobService.getJobsByStatus(status);
	}

    // 🔹 Get Jobs by Client ID
    @GetMapping("/client/{clientId}")
    public List<JobDto> getJobsByClient(@PathVariable Long clientId) {
        return jobService.getJobsByClient(clientId);
    }

	// 🔹 Search Jobs (Simple & Advanced)
	@GetMapping("/search")
	public List<JobDto> searchJobs(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String title,
			@RequestParam(required = false) String description,
			@RequestParam(required = false) List<String> skills,
			@RequestParam(required = false) Double minBudget,
			@RequestParam(required = false) Double maxBudget,
			@RequestParam(required = false) String duration
	) {
		if (keyword != null && !keyword.isEmpty()) {
			 return jobService.searchJobs(keyword);
		}
		return jobService.searchJobsAdvanced(title, description, skills, minBudget, maxBudget, duration);
	}
}
