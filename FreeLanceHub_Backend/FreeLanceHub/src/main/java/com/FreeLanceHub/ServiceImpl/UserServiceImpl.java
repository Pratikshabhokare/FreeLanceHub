package com.FreeLanceHub.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FreeLanceHub.Dao.UserDao;
import com.FreeLanceHub.Dto.UserDto;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Service.UserService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;

	@Override
	public List<UserDto> getAllUser() {
		return userDao.getAllUser().stream().map(this::mapToDto).toList();
	}

	@Override
	public User getUserByUserName(String userName) {
		return userDao.getUserByUserName(userName);
	}

	@Override
	public User getUserByEmail(String email) {
		return userDao.getUserByEmail(email);
	}

	@Override
	public void updateUserStatus(Long userId, boolean enabled) {
		userDao.updateUserStatus(userId, enabled);
	}

	@Override
	public UserDto saveUser(UserDto dto) {
		  User user = new User();
	        user.setUserName(dto.getUserName());
	        user.setName(dto.getName());
	        user.setEmail(dto.getEmail());
	        user.setPassword(dto.getPassword()); // encode later
	        user.setRole(dto.getRole());
	        user.setEnabled(true);

	        User saved = userDao.saveUser(user);
	        return mapToDto(saved);
	}

	@Override
	public UserDto updateUser(Long id, UserDto dto) {
		User existing = userDao.getUserById(id);
		if (existing != null) {
			if (dto.getName() != null) existing.setName(dto.getName());
			if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
			// Only basic info update allowed here. Password/Role handled separately if needed.
			userDao.updateUser(id, existing);
			return mapToDto(existing);
		}
		throw new RuntimeException("User not found with id: " + id);
	}

	// ---------- helper ----------
	private UserDto mapToDto(User user) {
	    UserDto dto = new UserDto();
	    dto.setUserName(user.getUserName());
	    dto.setName(user.getName());
	    dto.setEmail(user.getEmail());
	    dto.setRole(user.getRole());
	    dto.setEnabled(user.isEnabled());
	    return dto;
	}
}
