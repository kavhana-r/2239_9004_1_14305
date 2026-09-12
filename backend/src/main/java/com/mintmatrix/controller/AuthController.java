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
