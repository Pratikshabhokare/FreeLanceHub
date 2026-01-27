package com.FreeLanceHub.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.FreeLanceHub.Dto.UserDto;
import com.FreeLanceHub.Entity.User;

@Service
public interface UserService {

	public List<UserDto> getAllUser();

	public User getUserByUserName(String userName);

	public User getUserByEmail(String email);

	public void updateUserStatus(Long userId, boolean enabled);

	public UserDto saveUser(UserDto dto);
	
	public UserDto updateUser(Long id, UserDto dto);
}
