
package com.daybuilder.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daybuilder.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
