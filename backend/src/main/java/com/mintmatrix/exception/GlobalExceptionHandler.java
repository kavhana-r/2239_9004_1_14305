
// package com.mintmatrix.exception;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.AccessDeniedException;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// import java.util.HashMap;
// import java.util.Map;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

//     // 403 Forbidden
//     @ExceptionHandler(AccessDeniedException.class)
//     public ResponseEntity<Map<String, String>> handleAccessDenied(
//             AccessDeniedException ex) {

//         Map<String, String> response = new HashMap<>();
//         response.put("message", "Access Denied");
//         response.put("error", "Forbidden");

//         return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
//     }

//     // 404 Not Found
//     @ExceptionHandler(TransactionNotFoundException.class)
//     public ResponseEntity<Map<String, String>> handleTransactionNotFound(
//             TransactionNotFoundException ex) {

//         Map<String, String> response = new HashMap<>();
//         response.put("message", ex.getMessage());
//         response.put("error", "Not Found");

//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//     }

//     // 500 Internal Server Error
//     @ExceptionHandler(Exception.class)
//     public ResponseEntity<Map<String, String>> handleException(
//             Exception ex) {

//         Map<String, String> response = new HashMap<>();
//         response.put("message", ex.getMessage());
//         response.put("error", ex.getClass().getSimpleName());

//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                 .body(response);
//     }
// }
package com.mintmatrix.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@RestControllerAdvice
public class GlobalExceptionHandler {


    // General exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(
            Exception ex) {

        Map<String, String> response = new HashMap<>();

        response.put("message", ex.getMessage());
        response.put("error", ex.getClass().getSimpleName());

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    // 403 Forbidden
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(
            Exception ex) {

        Map<String, String> response = new HashMap<>();

        response.put("message", "Access Denied");
        response.put("error", "Forbidden");

        return new ResponseEntity<>(
                response,
                HttpStatus.FORBIDDEN
        );
    }
}
