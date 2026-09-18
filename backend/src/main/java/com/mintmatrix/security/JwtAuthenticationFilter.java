package com.mintmatrix.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
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

            String jwt = getJwtFromRequest(request);

            if (jwt != null && tokenProvider.validateToken(jwt)) {

                String username =
                        tokenProvider.getUsernameFromJWT(jwt);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                Collection<? extends GrantedAuthority> authorities =
                        userDetails.getAuthorities();

                List<GrantedAuthority> normalizedAuthorities =
                        new ArrayList<>();

                for (GrantedAuthority authority : authorities) {

                    if (authority == null) {
                        continue;
                    }

                    String role = authority.getAuthority();

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

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                normalizedAuthorities
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception exception) {

            System.out.println(
                    "JWT authentication failed: "
                            + exception.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

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