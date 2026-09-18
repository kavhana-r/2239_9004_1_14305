// // package com.mintmatrix.security;

// // import jakarta.servlet.FilterChain;
// // import jakarta.servlet.ServletException;
// // import jakarta.servlet.http.HttpServletRequest;
// // import jakarta.servlet.http.HttpServletResponse;

// // import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// // import org.springframework.security.core.context.SecurityContextHolder;
// // import org.springframework.security.core.userdetails.UserDetails;
// // import org.springframework.security.core.userdetails.UserDetailsService;

// // import org.springframework.stereotype.Component;
// // import org.springframework.web.filter.OncePerRequestFilter;

// // import java.io.IOException;

// // @Component
// // public class JwtAuthenticationFilter extends OncePerRequestFilter {

// //     private final JwtTokenProvider tokenProvider;

// //     private final UserDetailsService userDetailsService;


// //     public JwtAuthenticationFilter(
// //             JwtTokenProvider tokenProvider,
// //             UserDetailsService userDetailsService) {

// //         this.tokenProvider = tokenProvider;
// //         this.userDetailsService = userDetailsService;
// //     }


// //     @Override
// //     protected void doFilterInternal(
// //             HttpServletRequest request,
// //             HttpServletResponse response,
// //             FilterChain filterChain)
// //             throws ServletException, IOException {


// //         String jwt = getJwtFromRequest(request);


// //         if (jwt != null && tokenProvider.validateToken(jwt)) {

// //             String username = tokenProvider.getUsernameFromJWT(jwt);


// //             UserDetails userDetails =
// //                     userDetailsService.loadUserByUsername(username);


// //             UsernamePasswordAuthenticationToken authentication =
// //                     new UsernamePasswordAuthenticationToken(
// //                             userDetails,
// //                             null,
// //                             userDetails.getAuthorities()
// //                     );


// //             SecurityContextHolder.getContext()
// //                     .setAuthentication(authentication);
// //         }


// //         filterChain.doFilter(request, response);
// //     }


// //     private String getJwtFromRequest(HttpServletRequest request) {

// //         String bearerToken = request.getHeader("Authorization");


// //         if (bearerToken != null && bearerToken.startsWith("Bearer ")) {

// //             return bearerToken.substring(7);
// //         }

// //         return null;
// //     }
// // }
// package com.mintmatrix.security;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;

// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;

// @Component
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     private final JwtTokenProvider tokenProvider;

//     private final UserDetailsService userDetailsService;


//     public JwtAuthenticationFilter(
//             JwtTokenProvider tokenProvider,
//             UserDetailsService userDetailsService) {

//         this.tokenProvider = tokenProvider;
//         this.userDetailsService = userDetailsService;
//     }


//     @Override
//     protected void doFilterInternal(
//             HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain)
//             throws ServletException, IOException {


//         String jwt = getJwtFromRequest(request);


//         if (jwt != null && tokenProvider.validateToken(jwt)) {

//             String username = tokenProvider.getUsernameFromJWT(jwt);


//             UserDetails userDetails =
//                     userDetailsService.loadUserByUsername(username);


//             UsernamePasswordAuthenticationToken authentication =
//                     new UsernamePasswordAuthenticationToken(
//                             userDetails,
//                             null,
//                             userDetails.getAuthorities()
//                     );


//             SecurityContextHolder.getContext()
//                     .setAuthentication(authentication);
//         }


//         filterChain.doFilter(request, response);
//     }


//     private String getJwtFromRequest(HttpServletRequest request) {

//         String bearerToken = request.getHeader("Authorization");


//         if (bearerToken != null && bearerToken.startsWith("Bearer ")) {

//             return bearerToken.substring(7);
//         }

//         return null;
//     }
// }
package com.mintmatrix.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            UserDetailsService userDetailsService) {

        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        try {

            // =============================================
            // GET JWT TOKEN
            // =============================================

            String jwt = getJwtFromRequest(request);

            // =============================================
            // VALIDATE TOKEN
            // =============================================

            if (jwt != null && tokenProvider.validateToken(jwt)) {

                // =========================================
                // GET USERNAME FROM TOKEN
                // =========================================

                String username =
                        tokenProvider.getUsernameFromJWT(jwt);

                // =========================================
                // LOAD USER
                // =========================================

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(username);

                // =========================================
                // GET AUTHORITIES
                // =========================================

                Collection<org.springframework.security.core.GrantedAuthority>
                        authorities =
                        userDetails.getAuthorities();

                // =========================================
                // NORMALIZE ROLE
                //
                // ADMIN     -> ROLE_ADMIN
                // ROLE_ADMIN -> ROLE_ADMIN
                // USER      -> ROLE_USER
                // ROLE_USER -> ROLE_USER
                // =========================================

                List<org.springframework.security.core.GrantedAuthority>
                        normalizedAuthorities =
                        new ArrayList<>();

                for (org.springframework.security.core.GrantedAuthority authority
                        : authorities) {

                    if (authority == null) {
                        continue;
                    }

                    String role =
                            authority.getAuthority();

                    if (role == null || role.isBlank()) {
                        continue;
                    }

                    role = role.trim().toUpperCase();

                    if (!role.startsWith("ROLE_")) {
                        role = "ROLE_" + role;
                    }

                    normalizedAuthorities.add(
                            new SimpleGrantedAuthority(role)
                    );
                }

                // =========================================
                // DEBUG LOG
                // =========================================

                System.out.println(
                        "=========================================="
                );

                System.out.println(
                        "JWT USERNAME: " + username
                );

                System.out.println(
                        "JWT AUTHORITIES: "
                                + normalizedAuthorities
                );

                System.out.println(
                        "REQUEST: "
                                + request.getMethod()
                                + " "
                                + request.getRequestURI()
                );

                System.out.println(
                        "=========================================="
                );

                // =========================================
                // CREATE AUTHENTICATION
                // =========================================

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                normalizedAuthorities
                        );

                // =========================================
                // SET SECURITY CONTEXT
                // =========================================

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception exception) {

            System.out.println(
                    "JWT authentication failed: "
                            + exception.getMessage()
            );

            /*
             * Do not stop the request here.
             * Spring Security will handle the request
             * as unauthenticated.
             */
        }

        // =============================================
        // CONTINUE FILTER CHAIN
        // =============================================

        filterChain.doFilter(request, response);
    }

    // =================================================
    // GET JWT FROM AUTHORIZATION HEADER
    // =================================================

    private String getJwtFromRequest(
            HttpServletRequest request) {

        String bearerToken =
                request.getHeader("Authorization");

        if (bearerToken != null
                && bearerToken.startsWith("Bearer ")) {

            return bearerToken.substring(7).trim();
        }

        return null;
    }
}