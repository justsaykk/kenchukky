package com.kenchukky.server.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

@Service
public class AuthService {
    
    public Optional<FirebaseToken> verifyToken(String token) {
        try {
            FirebaseToken firebaseToken = FirebaseAuth.getInstance().verifyIdToken(token.replace("Bearer ", ""));
            return Optional.of(firebaseToken);
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
}
