package com.FreeLanceHub.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.util.List;

@Entity
public class Job extends BaseEntity {

	 @ManyToOne
	    private User client;

	    @ManyToOne
	    @JoinColumn(name = "assigned_freelancer_id")
	    private User assignedFreelancer; // <--- Add this

	    private String title;
	    private String description;
	    private Double budget;

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private JobStatus status;

        @ElementCollection
        private List<String> skills;

        private String duration;
        private String visibility;
        private String budgetType;
        private Double budgetMin;
        private Double budgetMax;

		public Job() {
			super();
			// TODO Auto-generated constructor stub
		}

		public Job(User client, User assignedFreelancer, String title, String description, Double budget,
				JobStatus status) {
			super();
			this.client = client;
			this.assignedFreelancer = assignedFreelancer;
			this.title = title;
			this.description = description;
			this.budget = budget;
			this.status = status;
		}

		public User getClient() {
			return client;
		}

		public void setClient(User client) {
			this.client = client;
		}

		public User getAssignedFreelancer() {
			return assignedFreelancer;
		}

		public void setAssignedFreelancer(User assignedFreelancer) {
			this.assignedFreelancer = assignedFreelancer;
		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public Double getBudget() {
			return budget;
		}

		public void setBudget(Double budget) {
			this.budget = budget;
		}

		public JobStatus getStatus() {
			return status;
		}

		public void setStatus(JobStatus status) {
			this.status = status;
		}

        public List<String> getSkills() {
            return skills;
        }

        public void setSkills(List<String> skills) {
            this.skills = skills;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getVisibility() {
            return visibility;
        }

        public void setVisibility(String visibility) {
            this.visibility = visibility;
        }
        
        public String getBudgetType() {
            return budgetType;
        }

        public void setBudgetType(String budgetType) {
            this.budgetType = budgetType;
        }

        public Double getBudgetMin() {
            return budgetMin;
        }

        public void setBudgetMin(Double budgetMin) {
            this.budgetMin = budgetMin;
        }

        public Double getBudgetMax() {
            return budgetMax;
        }

        public void setBudgetMax(Double budgetMax) {
            this.budgetMax = budgetMax;
        }

		@Override
		public String toString() {
			return "Job [client=" + client + ", assignedFreelancer=" + assignedFreelancer + ", title=" + title
					+ ", description=" + description + ", budget=" + budget + ", status=" + status + "]";
		}
	    
	 
	
}