package com.FreeLanceHub.Dao;

import java.util.List;

import com.FreeLanceHub.Dto.UserDto;
import com.FreeLanceHub.Entity.User;

public interface UserDao {

	public List<User> getAllUser();

	public User getUserByUserName(String userName);

	public User getUserByEmail(String email);

	public void updateUserStatus(Long userId, boolean enabled);

	public User saveUser(User user);

	public boolean updateUser(Long id, User user);

	public boolean deleteUser(Long userId);
	
	public User getUserById(Long id);
}
