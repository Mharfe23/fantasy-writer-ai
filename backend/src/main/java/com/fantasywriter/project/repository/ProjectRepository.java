package com.fantasywriter.project.repository;

import com.fantasywriter.project.entity.Project;
import com.fantasywriter.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByUser(User user);
} 