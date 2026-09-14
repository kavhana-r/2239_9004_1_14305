// package com.mintmatrix.security;


// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// import org.springframework.security.config.http.SessionCreationPolicy;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


// @Configuration
// @EnableWebSecurity
// @EnableMethodSecurity
// public class WebSecurityConfig {


//     private final JwtAuthenticationFilter jwtAuthenticationFilter;


//     public WebSecurityConfig(
//             JwtAuthenticationFilter jwtAuthenticationFilter) {

//         this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//     }



//     @Bean
//     public BCryptPasswordEncoder passwordEncoder() {

//         return new BCryptPasswordEncoder();
//     }



//     @Bean
//     public AuthenticationManager authenticationManager(
//             AuthenticationConfiguration authenticationConfiguration)
//             throws Exception {

//         return authenticationConfiguration.getAuthenticationManager();
//     }



//     @Bean
//     public SecurityFilterChain filterChain(
//             HttpSecurity http) throws Exception {


//         http

//             // Disable CSRF for JWT
//             .csrf(csrf -> csrf.disable())


//             // Enable CORS
//             .cors(cors -> {})


//             // Stateless session
//             .sessionManagement(session ->
//                     session.sessionCreationPolicy(
//                             SessionCreationPolicy.STATELESS
//                     )
//             )


//             // URL Authorization
//             .authorizeHttpRequests(auth -> auth

//                     .requestMatchers(
//                             "/api/auth/**",
//                             "/api/currencies/**",
//                             "/swagger-ui/**",
//                             "/swagger-ui.html",
//                             "/v3/api-docs/**",
//                             "/error"
//                     ).permitAll()


//                     .anyRequest().authenticated()
//             )


//             // JWT Filter
//             .addFilterBefore(
//                     jwtAuthenticationFilter,
//                     UsernamePasswordAuthenticationFilter.class
//             )


//             // 401 and 403 handling
//             .exceptionHandling(exception -> exception

//                     // No JWT token
//                     .authenticationEntryPoint(
//                             (request, response, ex) -> {

//                                 response.setStatus(401);
//                                 response.setContentType(
//                                         "application/json"
//                                 );

//                                 response.getWriter().write(
//                                         """
//                                         {
//                                           "message":"Authentication required",
//                                           "error":"Unauthorized"
//                                         }
//                                         """
//                                 );
//                             }
//                     )


//                     // JWT exists but role not allowed
//                     .accessDeniedHandler(
//                             (request, response, ex) -> {

//                                 response.setStatus(403);
//                                 response.setContentType(
//                                         "application/json"
//                                 );

//                                 response.getWriter().write(
//                                         """
//                                         {
//                                           "message":"Access Denied",
//                                           "error":"Forbidden"
//                                         }
//                                         """
//                                 );
//                             }
//                     )
//             );


//         return http.build();
//     }
// }

// 

package com.mintmatrix.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


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
    public SecurityFilterChain securityFilterChain(
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

                    // Allow browser CORS preflight requests
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/goals",
                            "/api/goals/**"
                    ).hasAnyRole("USER", "ADMIN")

                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/goals",
                            "/api/goals/**"
                    ).hasRole("ADMIN")

                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/goals",
                            "/api/goals/**"
                    ).hasRole("ADMIN")

                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/goals",
                            "/api/goals/**"
                    ).hasRole("ADMIN")

                    .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")

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
                                          "error":"Forbidden"
                                        }
                                        """
                                );
                            }
                    )
            );


        return http.build();
    }


    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:3000")
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