package com.FreeLanceHub.Specification;

import com.FreeLanceHub.Entity.FreeLancerProfile;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FreelancerSpecification {

    public static Specification<FreeLancerProfile> filterFreelancers(String skills, Double maxHourlyRate, Integer minExperience) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Skills is stored as a comma-separated String in DB (e.g. "Java, React, Spring")
            if (skills != null && !skills.isEmpty()) {
                 predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("skills")), "%" + skills.toLowerCase() + "%"));
            }

            if (maxHourlyRate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("hourlyRate"), maxHourlyRate));
            }

            if (minExperience != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("experience"), minExperience));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
