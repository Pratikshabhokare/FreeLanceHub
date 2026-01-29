package com.FreeLanceHub.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.FreeLanceHub.Entity.Role;
import com.FreeLanceHub.Entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

	@Modifying
	@Query(value = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", nativeQuery = true)
	int updateUser(String name, String email, Role role, Long id);

	User findByUserName(String userName);

	@Query(value = "SELECT * FROM users WHERE email = ?", nativeQuery = true)
	User findUserByEmail(String email);

	@Modifying
	@Query(value = "UPDATE users SET enabled = ? WHERE id = ?", nativeQuery = true)
	int updateUserStatus(Long id, boolean enabled);

	@Query(value = "select * from users", nativeQuery = true)
	List<User> getAllUser();

	java.util.Optional<User> findByEmail(String email);

	java.util.Optional<User> findByResetToken(String token);
}
