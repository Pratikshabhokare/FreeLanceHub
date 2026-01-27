package com.FreeLanceHub.Dto;

import com.FreeLanceHub.Entity.BaseEntity;
import com.FreeLanceHub.Entity.JobStatus;

public class JobDto extends BaseEntity {

	private Long id;
	private String title;
	private String description;
	private Double budget;
	private JobStatus status;
	private String clientName;
	
    private java.util.List<String> skills;
    private String duration;
    private String visibility;
    private String budgetType;
    private Double budgetMin;
    private Double budgetMax;

	public JobDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	public JobDto(Long id, String title, String description, Double budget, JobStatus status, String clientName) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.budget = budget;
		this.status = status;
		this.clientName = clientName;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public String getClientName() {
		return clientName;
	}
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

    public java.util.List<String> getSkills() {
        return skills;
    }

    public void setSkills(java.util.List<String> skills) {
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
		return "JobDto [id=" + id + ", title=" + title + ", description=" + description + ", budget=" + budget
				+ ", status=" + status + ", clientName=" + clientName + "]";
	}
}