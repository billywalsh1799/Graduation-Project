package com.example.jwttest.auth;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.jwttest.email.EmailService;
import com.example.jwttest.exceptionHandling.exceptions.AccountVerificationException;
import com.example.jwttest.exceptionHandling.exceptions.UsedEmailException;
import com.example.jwttest.exceptionHandling.exceptions.UserAlreadyExistsException;
import com.example.jwttest.models.User;
import com.example.jwttest.repo.UserRepository;
import com.example.jwttest.services.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

import org.springframework.security.core.Authentication;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    public Map<String, String> register(RegisterRequest request){

        //handle user already exists in db exception

        userRepo.findByUsername(request.getUsername()).ifPresent(user -> {
            throw new UserAlreadyExistsException("User already exists");
        });

        userRepo.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new UsedEmailException("Email already in use");
        });

        //password encoder
        String encodedPassword=passwordEncoder.encode(request.getPassword());

        User user=User.builder().username(request.getUsername()).firstname(request.getFirstname())
        .lastname(request.getLastname()).email(request.getEmail()).enabled(false)
        .password(encodedPassword).role("ROLE_USER").build();
        
        // Create extra claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("firstname", user.getFirstname());
        extraClaims.put("lastname", user.getLastname());

        //username is the subject
        extraClaims.put("username",user.getUsername());
        extraClaims.put("email",user.getEmail());
        extraClaims.put("password", user.getPassword());
        extraClaims.put("role", "ROLE_USER");
        //Generate confirmation tokens
        String token=jwtService.generateToken(extraClaims,user.getUsername());
        
        String link = "http://localhost:4200/auth/confirm?token=" + token;
        emailService.send(request.getEmail(), link);


        Map<String, String> responseData = new HashMap<>();
        responseData.put("message","Registration Successful! A confirmation link has been sent to your email. Please verify your email address to activate your account");
        return responseData;
        
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){

        Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
       
        // Cast Authentication to User
        User user = (User) authentication.getPrincipal();
        System.err.println("user principal: "+user);
        
        // Create extra claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("firstname", user.getFirstname());
        extraClaims.put("lastname", user.getLastname());
        extraClaims.put("username", user.getUsername());
        extraClaims.put("role", user.getRole());

        //Generate user tokens
        String jwtToken=jwtService.generateToken(extraClaims,user.getEmail());
        String refreshToken=jwtService.generateRefreshToken(extraClaims,user.getEmail());
        return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).build();
    }

    public AuthenticationResponse refreshToken(RefreshRequest request)  {
        
        final String refreshToken;
        final String email;
        final String userRole;

        refreshToken=request.getRefreshToken();
        Claims claims=jwtService.extractRefreshClaims(refreshToken);
        email=(String)claims.getSubject();
        userRole=(String)claims.get("role");

        //make db query in case an update happened 

        User user=userRepo.findByEmail(email).orElseThrow(()->new JwtException("Invalid JWT"));

        // Create extra claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("firstname", user.getFirstname());
        extraClaims.put("lastname", user.getLastname());
        extraClaims.put("username", user.getUsername());
        extraClaims.put("role", userRole);


        //the validity is checked during parsing
       
        String accessToken=jwtService.generateToken(extraClaims,email);
        AuthenticationResponse authResponse=AuthenticationResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
        return authResponse;
         
        //the parsing will throw the exceptions
        //when the refresh token is expired the user is logged out

    }

    public Map<String, String> confirmUser(String token){
        
        //extract user info from confirmation token save user to db
        Claims userInfo=jwtService.extractAllClaims(token);

        User user=User.builder().username((String)userInfo.get("username")).firstname((String)userInfo.get("firstname"))
        .lastname((String)userInfo.get("lastname")).email((String)userInfo.get("email")).enabled(false)
        .password((String)userInfo.get("password")).role("ROLE_USER").build();

        //check if user is already in db
        userRepo.findByUsername(user.getUsername()).ifPresent(unconfirmedUser -> {
            throw new AccountVerificationException("User already verified account");
        });

        
        userRepo.save(user);
        //tokens generated only after authentication and enabling by admin
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message", "Email Verification Successful!, your account is currently pending administrative approval.You will receive an email notification once your account has been activated");
        return responseData;
    }

    public Map<String, Object> isTokenValid(String token){
        return jwtService.validateToken(token);
        
    }

    public String isTokenRoleValid(String token){
        return jwtService.validateTokenByRole(token);
    }
    
}
