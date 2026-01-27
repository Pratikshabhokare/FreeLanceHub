package com.FreeLanceHub.DaoImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.FreeLanceHub.Dao.UserDao;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.UserRepo;

import jakarta.transaction.Transactional;

@Repository
@Transactional
public class UserDaoImpl implements UserDao {

	@Autowired
	private UserRepo userRepo;

	@Override
	public User saveUser(User user) {
		User userdb=userRepo.save(user);
		 
		return userdb;
	}

	@Override
	public boolean updateUser(Long id, User user) {
		User userDb = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		userDb.setName(user.getName());
		userDb.setEmail(user.getEmail());
		userDb.setRole(user.getRole());

		// Dirty checking will update DB
		return true;
	}

	@Override
	public boolean deleteUser(Long userId) {
		if (!userRepo.existsById(userId)) {
			return false;
		}
		userRepo.deleteById(userId);
		return true;
	}

	@Override
	public List<User> getAllUser() {
		return userRepo.getAllUser();
	}

	@Override
	public User getUserByUserName(String userName) {
		return userRepo.findUserByUserName(userName);
	}

	@Override
	public User getUserByEmail(String email) {
		return userRepo.findUserByEmail(email);
	}

	@Override
	public void updateUserStatus(Long userId, boolean enabled) {
		if (!userRepo.existsById(userId)) {
			throw new RuntimeException("User not found");
		}
		userRepo.updateUserStatus(userId, enabled);
	}

	@Override
	public User getUserById(Long id) {
		return userRepo.findById(id).orElse(null);
	}
}
