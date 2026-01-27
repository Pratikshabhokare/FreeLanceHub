package com.FreeLanceHub.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FreeLanceHub.Dto.FreeLancerProfileDto;
import com.FreeLanceHub.Dto.ProposalDto;
import com.FreeLanceHub.Entity.FreeLancerProfile;
import com.FreeLanceHub.Entity.JobStatus;
import com.FreeLanceHub.Service.FreeLancerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/freelancer")
public class FreeLancerProfileController {

    @Autowired
    private FreeLancerService freelancerService;

    /* -------------------- Save or Update Freelancer Profile -------------------- */
    @PostMapping("/{freelancerId}/profile")
    public ResponseEntity<FreeLancerProfile> saveOrUpdateProfile(
            @PathVariable Long freelancerId,
            @Valid @RequestBody FreeLancerProfileDto profileDto) {

        FreeLancerProfile profile = freelancerService.saveOrUpdateProfile(freelancerId, profileDto);
        return ResponseEntity.ok(profile);
    }

    /* -------------------- Get Freelancer Profile -------------------- */
    @GetMapping("/{freelancerId}/profile")
    public ResponseEntity<FreeLancerProfile> getProfile(@PathVariable Long freelancerId) {
        FreeLancerProfile profile = freelancerService.getProfile(freelancerId);
        return ResponseEntity.ok(profile);
    }

    /* -------------------- Browse Freelancers by Skills (Simple & Advanced) -------------------- */
    @GetMapping("/search")
    public ResponseEntity<List<FreeLancerProfile>> searchFreelancers(
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) Double maxHourlyRate,
            @RequestParam(required = false) Integer minExperience) {

        if ((skills != null && !skills.isEmpty()) && maxHourlyRate == null && minExperience == null) {
             // Simple search fallback
             return ResponseEntity.ok(freelancerService.searchFreelancersBySkills(skills));
        }
        return ResponseEntity.ok(freelancerService.searchFreelancersAdvanced(skills, maxHourlyRate, minExperience));
    }

    /* -------------------- Get Freelancer Assigned Jobs -------------------- */
    @GetMapping("/{freelancerId}/jobs")
    public ResponseEntity<?> getAssignedJobs(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(freelancerService.getAssignedJobs(freelancerId));
    }

    /* -------------------- Browse Open Jobs -------------------- */
    @GetMapping("/jobs")
    public ResponseEntity<?> browseJobs() {
        return ResponseEntity.ok(freelancerService.browseJobs());//check
    }

    /* -------------------- Submit Proposal for a Job -------------------- */
    @PostMapping("/{freelancerId}/proposals")
    public ResponseEntity<?> submitProposal(
            @PathVariable Long freelancerId,
            @Valid @RequestBody ProposalDto proposalDto) {

        return ResponseEntity.ok(freelancerService.submitProposal(freelancerId, proposalDto));//check
    }

    /* -------------------- Update Job Status -------------------- */
    @PutMapping("/{freelancerId}/jobs/{jobId}/status")
    public ResponseEntity<?> updateJobStatus(
            @PathVariable Long freelancerId,
            @PathVariable Long jobId,
            @RequestParam JobStatus status) {

        freelancerService.updateJobStatus(freelancerId, jobId, status);
        return ResponseEntity.ok("Job status updated successfully");//check
    }
}
