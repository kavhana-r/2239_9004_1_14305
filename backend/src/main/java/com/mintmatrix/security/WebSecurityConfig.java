// 

package com.mintmatrix.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    public WebSecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }



    @Bean
    public BCryptPasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }



    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration)
            throws Exception {

        return authenticationConfiguration.getAuthenticationManager();
    }



    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {


        http

            // Disable CSRF for JWT
            .csrf(csrf -> csrf.disable())


            // Enable CORS
            .cors(cors -> {})


            // Stateless session
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )


            // URL Authorization
            .authorizeHttpRequests(auth -> auth

                    .requestMatchers(
                            "/api/auth/**",
                            "/api/currencies/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/v3/api-docs/**",
                            "/error"
                    ).permitAll()


                    .anyRequest().authenticated()
            )


            // JWT Filter
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            )


            // 401 and 403 handling
            .exceptionHandling(exception -> exception

                    // No JWT token
                    .authenticationEntryPoint(
                            (request, response, ex) -> {

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


                    // JWT exists but role not allowed
                    .accessDeniedHandler(
                            (request, response, ex) -> {

                                response.setStatus(403);
                                response.setContentType(
                                        "application/json"
                                );

                                response.getWriter().write(
                                        """
                                        {
                                          "message":"Access Denied",
                                        }
                                        """
                                );
                            }
                    )
            );


        return http.build();
    }
}