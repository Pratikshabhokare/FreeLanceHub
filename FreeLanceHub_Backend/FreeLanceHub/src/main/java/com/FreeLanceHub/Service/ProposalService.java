package com.FreeLanceHub.Service;

import java.util.List;

import com.FreeLanceHub.Dto.ProposalDto;
import com.FreeLanceHub.Entity.Proposal;
import com.FreeLanceHub.Entity.ProposalStatus;

public interface ProposalService {
    Proposal submitProposal(Long freelancerId, ProposalDto proposalDto);

    List<Proposal> getProposalsByJob(Long jobId);

    Proposal getProposalById(Long proposalId);

    void updateProposalStatus(Long proposalId, ProposalStatus status);

    List<Proposal> getProposalsByFreelancer(Long freelancerId);

}
