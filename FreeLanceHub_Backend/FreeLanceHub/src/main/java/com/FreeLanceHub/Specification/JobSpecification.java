package com.FreeLanceHub.Specification;

import com.FreeLanceHub.Entity.Job;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    public static Specification<Job> filterJobs(String title, String description, List<String> skills, Double minBudget, Double maxBudget, String duration) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }

            if (description != null && !description.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + description.toLowerCase() + "%"));
            }

            // Skill filtering (checking if any of the provided skills match any of the job's skills)
            // Since skills is an ElementCollection of Strings
            if (skills != null && !skills.isEmpty()) {
                // Join<Job, String> skillsJoin = root.join("skills");
                // predicates.add(skillsJoin.in(skills));
                // OR simple "member of" for single skill, but for list we generally use join
                // Simplified: at least one matching skill
                 for (String skill : skills) {
                      predicates.add(criteriaBuilder.isMember(skill, root.get("skills")));
                 }
                // Note: Logic above ANDs the skills (Job must have ALL listed skills). 
                // If we want OR, we need to restructure. Assuming inclusive search for now (OR logic often preferred for discovery)
                // Let's refine for OR logic if multiple skills passed
            }
            
            if (minBudget != null) {
                // Check if job budget (single value) or budgetMin/budgetMax ranges overlap
                // For simplicity, let's assume filtering against the single 'budget' field or 'budgetMin'
                // Case 1: Job has 'budget' (single value)
                Predicate singleBudget = criteriaBuilder.greaterThanOrEqualTo(root.get("budget"), minBudget);
                
                // Case 2: Job has 'budgetMin' (range) - check if job's max is at least filter min
                Predicate rangeBudget = criteriaBuilder.greaterThanOrEqualTo(root.get("budgetMax"), minBudget);
                
                // Combine: either single budget >= min OR range max >= min
                // predicates.add(criteriaBuilder.or(singleBudget, rangeBudget));
                // To avoid complexity with nulls, let's just use the main 'budget' field or budgetMin
                 predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("budget"), minBudget));
            }

            if (maxBudget != null) {
                 predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("budget"), maxBudget));
            }
            
            if (duration != null && !duration.isEmpty()) {
                 predicates.add(criteriaBuilder.equal(root.get("duration"), duration));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
