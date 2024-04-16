package com.example.jwttest.email.token;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.jwttest.exceptionHandling.exceptions.AccountVerificationException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConfirmationTokenService {
    private final ConfirmationTokenRepository confirmationTokenRepository;

    public void saveToken(ConfirmationToken token) {
        confirmationTokenRepository.save(token);
    }

    public Optional<ConfirmationToken> getToken(String token) {
        return confirmationTokenRepository.findByToken(token);
    }

    public void markTokenAsUsed(String token){
        Optional<ConfirmationToken> optionalToken = confirmationTokenRepository.findByToken(token);
        
        if (optionalToken.isPresent()) {
            ConfirmationToken confirmationToken = optionalToken.get();
            confirmationToken.setUsed(true);
            confirmationTokenRepository.save(confirmationToken);
        } else {
            // Token not found, handle accordingly (e.g., throw an exception or log an error)
            throw new AccountVerificationException("confirmation token not found");

        }

    }
    
}
