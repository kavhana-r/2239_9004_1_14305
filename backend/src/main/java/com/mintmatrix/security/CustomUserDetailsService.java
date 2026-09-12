// package com.mintmatrix.security;

// import com.mintmatrix.model.User;
// import com.mintmatrix.repository.UserRepository;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import java.util.Collections;

// @Service
// public class CustomUserDetailsService implements UserDetailsService {

//     private final UserRepository userRepository;
//     public CustomUserDetailsService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public UserDetails loadUserByUsername(String username)
//             throws UsernameNotFoundException {

//         User user = userRepository.findByUsername(username)
//                 .orElseThrow(() ->
//                         new UsernameNotFoundException(
//                                 "User not found with username: " + username
//                         )
//                 );

//         return new org.springframework.security.core.userdetails.User(
//                 user.getUsername(),
//                 user.getPassword(),
//                 Collections.singleton(
//                         new SimpleGrantedAuthority(user.getRole())
//                 )
//         );
//     }
// }
package com.mintmatrix.security;

import com.mintmatrix.model.User;
import com.mintmatrix.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with username: " + username
                        )
                );

        String role = user.getRole();
        if (role != null && !role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority(role != null ? role : "ROLE_USER")
                )
        );
    }
}