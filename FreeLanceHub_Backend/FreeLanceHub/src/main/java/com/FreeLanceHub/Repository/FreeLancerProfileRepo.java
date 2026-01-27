package com.FreeLanceHub.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.FreeLanceHub.Entity.FreeLancerProfile;

@Repository
public interface FreeLancerProfileRepo extends JpaRepository<FreeLancerProfile, Long>, JpaSpecificationExecutor<FreeLancerProfile> {

    Optional<FreeLancerProfile> findByFreelancerId(Long freelancerId);

    List<FreeLancerProfile> findBySkillsContainingIgnoreCase(String skills);
}