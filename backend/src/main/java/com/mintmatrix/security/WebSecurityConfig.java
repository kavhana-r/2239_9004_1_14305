package com.mintmatrix.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public WebSecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {

        return authenticationConfiguration
                .getAuthenticationManager();
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =====================================================
                // CSRF
                // =====================================================

                .csrf(csrf -> csrf.disable())

                // =====================================================
                // CORS
                // =====================================================

                .cors(cors -> {
                })

                // =====================================================
                // SESSION
                // =====================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =====================================================
                // AUTHORIZATION
                // =====================================================

                .authorizeHttpRequests(auth -> auth

                        // =================================================
                        // PUBLIC ENDPOINTS
                        // =================================================

                        .requestMatchers(
                                "/api/auth/**",
                                "/api/currencies/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/error"
                        ).permitAll()

                        // =================================================
                        // OPTIONS
                        // =================================================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // =================================================
                        // TRANSACTIONS
                        // =================================================

                        .requestMatchers(
                                "/api/transactions/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )

                        // =================================================
                        // GOALS
                        // =================================================

                        .requestMatchers(
                                "/api/goals/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )

                        // =================================================
                        // BUDGETS
                        // =================================================

                        .requestMatchers(
                                "/api/budgets/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )

                        // =================================================
                        // CATEGORIES - GET
                        // USER + ADMIN
                        // =================================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/categories/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )

                        // =================================================
                        // CATEGORIES - POST
                        // ADMIN ONLY
                        // =================================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        // =================================================
                        // CATEGORIES - PUT
                        // ADMIN ONLY
                        // =================================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        // =================================================
                        // CATEGORIES - DELETE
                        // ADMIN ONLY
                        // =================================================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        // =================================================
                        // DASHBOARD
                        // =================================================

                        .requestMatchers(
                                "/api/dashboard/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )

                        // =================================================
                        // ADMIN
                        // =================================================

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // =================================================
                        // EVERYTHING ELSE
                        // =================================================

                        .anyRequest().authenticated()
                )

                // =====================================================
                // JWT FILTER
                // =====================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // =====================================================
                // EXCEPTION HANDLING
                // =====================================================

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint(
                                (request, response, authException) -> {

                                    response.setStatus(401);

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            """
                                            {
                                              "message":"Authentication required",
                                              "error":"Unauthorized"
                                            }
                                            """
                                    );
                                }
                        )

                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {

                                    response.setStatus(403);

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            """
                                            {
                                              "message":"Access Denied",
                                              "error":"Forbidden"
                                            }
                                            """
                                    );
                                }
                        )
                );

        return http.build();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        /*
         * IMPORTANT:
         * Do NOT put Markdown here.
         */

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}