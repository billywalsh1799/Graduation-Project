package com.example.jwttest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwttest.models.Role;

public interface RoleRepository extends JpaRepository<Role,Long> {
    List<Role> findAll();
}
