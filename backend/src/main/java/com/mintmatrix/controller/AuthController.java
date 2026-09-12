// package com.mintmatrix.controller;

// import com.mintmatrix.dto.JwtResponse;
// import com.mintmatrix.dto.LoginRequest;
// import com.mintmatrix.dto.RegisterRequest;
// import com.mintmatrix.model.User;
// import com.mintmatrix.repository.UserRepository;
// import com.mintmatrix.security.JwtTokenProvider;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {


//     private final AuthenticationManager authenticationManager;

//     private final JwtTokenProvider tokenProvider;

//     private final UserRepository userRepository;

//     private final PasswordEncoder passwordEncoder;



//     public AuthController(
//             AuthenticationManager authenticationManager,
//             JwtTokenProvider tokenProvider,
//             UserRepository userRepository,
//             PasswordEncoder passwordEncoder) {

//         this.authenticationManager = authenticationManager;
//         this.tokenProvider = tokenProvider;
//         this.userRepository = userRepository;
//         this.passwordEncoder = passwordEncoder;
//     }



//     @PostMapping("/login")
//     public ResponseEntity<?> login(
//             @RequestBody LoginRequest loginRequest) {


//         Authentication authentication =
//                 authenticationManager.authenticate(
//                         new UsernamePasswordAuthenticationToken(
//                                 loginRequest.getUsername(),
//                                 loginRequest.getPassword()
//                         )
//                 );


//         SecurityContextHolder.getContext()
//                 .setAuthentication(authentication);



//         String jwt =
//                 tokenProvider.generateToken(authentication);



//         User user =
//                 userRepository.findByUsername(
//                         loginRequest.getUsername()
//                 ).orElseThrow();



//         return ResponseEntity.ok(
//                 new JwtResponse(
//                         jwt,
//                         user.getUsername(),
//                         user.getRole()
//                 )
//         );
//     }




//     @PostMapping("/register")
//     public ResponseEntity<?> register(
//             @RequestBody RegisterRequest registerRequest) {


//         if (userRepository
//                 .findByUsername(
//                         registerRequest.getUsername()
//                 )
//                 .isPresent()) {

//             return ResponseEntity
//                     .badRequest()
//                     .body("Username already taken");
//         }



//         User user = new User();

//         user.setUsername(
//                 registerRequest.getUsername()
//         );

//         user.setPassword(
//                 passwordEncoder.encode(
//                         registerRequest.getPassword()
//                 )
//         );


//         if (registerRequest.getRole() != null) {

//             user.setRole(
//                     registerRequest.getRole()
//             );

//         } else {

//             user.setRole("ROLE_USER");
//         }



//         user.setPreferredCurrency(
//                 registerRequest.getPreferredCurrency()
//         );


//         userRepository.save(user);



//         return ResponseEntity.ok(
//                 "User registered successfully"
//         );
//     }
// }
package com.mintmatrix.controller;

import com.mintmatrix.dto.JwtResponse;
import com.mintmatrix.dto.LoginRequest;
import com.mintmatrix.dto.RegisterRequest;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.UserRepository;
import com.mintmatrix.security.JwtTokenProvider;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final AuthenticationManager authenticationManager;

    private final JwtTokenProvider tokenProvider;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;



    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {


        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getUsername(),
                                loginRequest.getPassword()
                        )
                );


        SecurityContextHolder.getContext()
                .setAuthentication(authentication);



        String jwt =
                tokenProvider.generateToken(authentication);



        User user =
                userRepository.findByUsername(
                        loginRequest.getUsername()
                ).orElseThrow();



        return ResponseEntity.ok(
                new JwtResponse(
                        jwt,
                        user.getUsername(),
                        user.getRole()
                )
        );
    }




    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest registerRequest) {

        if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Username is required");
        }

        String password = registerRequest.getPassword();
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Password is required");
        }

        if (password.length() < 8 ||
                !password.matches(".*[A-Z].*") ||
                !password.matches(".*[a-z].*") ||
                !password.matches(".*[0-9].*") ||
                !password.matches(".*[^a-zA-Z0-9].*")) {
            return ResponseEntity
                    .badRequest()
                    .body("Password must be strong: at least 8 characters, including uppercase, lowercase, number, and special character.");
        }

        if (userRepository
                .findByUsername(
                        registerRequest.getUsername().trim()
                )
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("Username already taken");
        }



        User user = new User();

        user.setUsername(
                registerRequest.getUsername()
        );

        user.setPassword(
                passwordEncoder.encode(
                        registerRequest.getPassword()
                )
        );


        if (registerRequest.getRole() != null) {

            user.setRole(
                    registerRequest.getRole()
            );

        } else {

            user.setRole("ROLE_USER");
        }



        user.setPreferredCurrency(
                registerRequest.getPreferredCurrency() != null && !registerRequest.getPreferredCurrency().trim().isEmpty()
                        ? registerRequest.getPreferredCurrency()
                        : "USD"
        );


        userRepository.save(user);



        return ResponseEntity.ok(
                "User registered successfully"
        );
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request) {

        String username = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            username = authentication.getName();
        } else if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            username = request.getUsername().trim();
        }

        if (username == null) {
            return ResponseEntity.status(401).body("Authentication required or username must be provided");
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found: " + username);
        }

        if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Current password is required");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        String newPassword = request.getNewPassword();
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("New password is required");
        }

        if (newPassword.length() < 8 ||
                !newPassword.matches(".*[A-Z].*") ||
                !newPassword.matches(".*[a-z].*") ||
                !newPassword.matches(".*[0-9].*") ||
                !newPassword.matches(".*[^a-zA-Z0-9].*")) {
            return ResponseEntity
                    .badRequest()
                    .body("Password must be strong: at least 8 characters, including uppercase, lowercase, number, and special character.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        private String username;
        private String currentPassword;
        private String newPassword;
    }
}