package com.FreeLanceHub.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
 
@Entity
@Table(name = "free_lancer_profile")
public class FreeLancerProfile extends BaseEntity {
    @OneToOne
    private User freelancer;
    private String skills;
    private Integer experience;
    private Double hourlyRate;
    private String bio;
    private String title; // e.g. "Full Stack Developer"

	public FreeLancerProfile() {
		super();
		// TODO Auto-generated constructor stub
	}
	public FreeLancerProfile(User freelancer, String skills, Integer experience, Double hourlyRate, String bio, String title) {
		super();
		this.freelancer = freelancer;
		this.skills = skills;
		this.experience = experience;
		this.hourlyRate = hourlyRate;
		this.bio = bio;
		this.title = title;
	}
	public User getFreelancer() {
		return freelancer;
	}
	public void setFreelancer(User freelancer) {
		this.freelancer = freelancer;
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
		return "FreeLancerProfile [freelancer=" + freelancer + ", skills=" + skills + ", experience=" + experience
				+ ", hourlyRate=" + hourlyRate + ", bio=" + bio + ", title=" + title + "]";
	}
	 
    
    
}