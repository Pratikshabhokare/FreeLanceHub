package com.FreeLanceHub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FreeLanceHub.Entity.Proposal;
import com.FreeLanceHub.Entity.ProposalStatus;
import com.FreeLanceHub.Service.ProposalService;

@RestController
@RequestMapping("/proposals")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    /* -------------------- Get Proposals by Job (For Client) -------------------- */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Proposal>> getProposalsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(proposalService.getProposalsByJob(jobId));
    }

    /* -------------------- Get Proposals by Freelancer (For Freelancer) -------------------- */
    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Proposal>> getProposalsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(proposalService.getProposalsByFreelancer(freelancerId));
    }

    /* -------------------- Submit Proposal -------------------- */
    @org.springframework.web.bind.annotation.PostMapping("/freelancer/{freelancerId}")
    public ResponseEntity<Proposal> submitProposal(@PathVariable Long freelancerId, @org.springframework.web.bind.annotation.RequestBody com.FreeLanceHub.Dto.ProposalDto proposalDto) {
        return ResponseEntity.ok(proposalService.submitProposal(freelancerId, proposalDto));
    }

    /* -------------------- Update Proposal Status (Accept/Reject/Withdraw) -------------------- */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam ProposalStatus status) {
        proposalService.updateProposalStatus(id, status);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Proposal status updated to " + status));
    }
}
