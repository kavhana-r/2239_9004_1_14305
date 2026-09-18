package com.mintmatrix.controller;

import com.mintmatrix.model.Category;
import com.mintmatrix.repository.CategoryRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(
            CategoryRepository categoryRepository
    ) {
        this.categoryRepository =
                categoryRepository;
    }

    // =========================================================
    // GET ALL
    // USER + ADMIN
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Category>>
    getAllCategories() {

        return ResponseEntity.ok(
                categoryRepository.findAll()
        );
    }

    // =========================================================
    // GET BY ID
    // USER + ADMIN
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Category>
    getCategoryById(
            @PathVariable Long id
    ) {

        return categoryRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =========================================================
    // POST
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category>
    createCategory(
            @RequestBody Category category
    ) {

        return ResponseEntity.ok(
                categoryRepository.save(
                        category
                )
        );
    }

    // =========================================================
    // PUT
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category>
    updateCategory(
            @PathVariable Long id,
            @RequestBody Category updatedCategory
    ) {

        return categoryRepository
                .findById(id)
                .map(existingCategory -> {

                    existingCategory.setName(
                            updatedCategory.getName()
                    );

                    existingCategory.setType(
                            updatedCategory.getType()
                    );

                    return ResponseEntity.ok(
                            categoryRepository.save(
                                    existingCategory
                            )
                    );
                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =========================================================
    // DELETE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>
    deleteCategory(
            @PathVariable Long id
    ) {

        if (!categoryRepository
                .existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        categoryRepository.deleteById(id);

        return ResponseEntity.ok(
                "Category deleted successfully"
        );
    }
}