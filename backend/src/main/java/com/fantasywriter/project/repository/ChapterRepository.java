package com.fantasywriter.project.repository;

import com.fantasywriter.project.entity.Chapter;
import com.fantasywriter.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, UUID> {
    List<Chapter> findByProject(Project project);
    List<Chapter> findByProjectOrderByOrderAsc(Project project);
} 