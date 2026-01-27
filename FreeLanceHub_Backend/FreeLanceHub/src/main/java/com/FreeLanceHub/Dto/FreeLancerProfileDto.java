package com.FreeLanceHub.Dto;

import com.FreeLanceHub.Entity.BaseEntity;
import com.FreeLanceHub.Entity.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FreeLancerProfileDto extends BaseEntity {

	@NotBlank(message = "Skills cannot be empty")
	private String skills; // e.g. "Java, Spring Boot, React"

	@NotNull(message = "Experience is required")
	@Positive(message = "Experience must be greater than 0")
	private Integer experience; // years of experience

	@NotNull(message = "Hourly rate is required")
	@Positive(message = "Hourly rate must be positive")
	private Double hourlyRate;

	@NotBlank(message = "Bio cannot be empty")
	private String bio;

	private String title; // e.g. "Full Stack Developer"


	public FreeLancerProfileDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FreeLancerProfileDto(User freelancer, String skills, Integer experience, Double hourlyRate, String bio) {
		super();

		this.skills = skills;
		this.experience = experience;
		this.hourlyRate = hourlyRate;
		this.bio = bio;
	}

	public String getSkills() {
		return skills;
	}

	public void setSkills(String skills) {
		this.skills = skills;
	}

	public Integer getExperience() {
		return experience;
	}

	public void setExperience(Integer experience) {
		this.experience = experience;
	}

	public Double getHourlyRate() {
		return hourlyRate;
	}

	public void setHourlyRate(Double hourlyRate) {
		this.hourlyRate = hourlyRate;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Override
	public String toString() {
		return "FreeLancerProfile [skills=" + skills + ", experience=" + experience + ", hourlyRate=" + hourlyRate
				+ ", bio=" + bio + ", title=" + title + "]";
	}

}
