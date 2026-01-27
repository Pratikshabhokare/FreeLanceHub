package com.FreeLanceHub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FreeLanceHub.Dto.UserDto;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

	private final UserService userSer;

	public UserController(UserService userSer) {
		this.userSer = userSer;
	}

	// ---------------- GET ALL USERS ----------------
	@GetMapping
	public List<UserDto> getAllUser() {
		return userSer.getAllUser();
	}

	// ---------------- GET BY USERNAME ----------------
	@GetMapping("/by-username")
	public User getUserByUserName(@RequestParam String userName) {
		return userSer.getUserByUserName(userName);
	}

	// ---------------- GET BY EMAIL ----------------
	@GetMapping("/by-email")
	public User getUserByEmail(@RequestParam String email) {
		return userSer.getUserByEmail(email);
	}

	// ---------------- UPDATE STATUS ----------------
	@PutMapping("/{userId}/status")
	public void updateUserStatus(@PathVariable Long userId, @RequestParam boolean enabled) {

		userSer.updateUserStatus(userId, enabled);
	}

	// ---------------- SAVE USER ----------------
	@PostMapping("/saveUser")
	public boolean saveUser(@RequestBody UserDto dto) {
		UserDto user=userSer.saveUser(dto);
		if (user != null) {
			return true;
		}
		return false;
	}

	// ---------------- UPDATE USER ----------------
	@PutMapping("/update/{id}")
	public UserDto updateUser(@PathVariable Long id, @RequestBody UserDto dto) {
		return userSer.updateUser(id, dto);
	}

	// ---------------- LOGIN ----------------
	@PostMapping("/login")
	public User login(@RequestParam String email, @RequestParam String password) {
		User user = userSer.getUserByEmail(email);
		if (user != null && user.getPassword().equals(password)) {
			return user;
		}
		throw new RuntimeException("Invalid credentials");
	}
}
