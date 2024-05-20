package com.example.jwttest.auth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.jwttest.email.EmailService;
import com.example.jwttest.exceptionHandling.exceptions.AccountVerificationException;
import com.example.jwttest.exceptionHandling.exceptions.UsedEmailException;
import com.example.jwttest.exceptionHandling.exceptions.UserAlreadyExistsException;
import com.example.jwttest.exceptionHandling.exceptions.UserNotFoundException;
import com.example.jwttest.models.Role;
import com.example.jwttest.models.SecurityUser;
import com.example.jwttest.models.User;
import com.example.jwttest.repo.RoleRepository;
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
    private final RoleRepository roleRepository;

    public Map<String, String> register(RegisterRequest request){

        //handle user already exists in db exception

        userRepo.findByUsername(request.getUsername()).ifPresent(user -> {
            throw new UserAlreadyExistsException("User already exists");
        });

        userRepo.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new UsedEmailException("Email already in use");
        });

        Map<String, String> responseData = new HashMap<>();
        responseData.put("message","Registration Successful! A confirmation link has been sent to your email. Please verify your email address to activate your account");
        return responseData;
        
    }

    public Map<String,String> sendConfirmationEmail(RegisterRequest request){
        //password encoder
        String encodedPassword=passwordEncoder.encode(request.getPassword());
        // Create extra claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("firstname", request.getFirstname());
        extraClaims.put("lastname", request.getLastname());

        //username is the subject
        extraClaims.put("username",request.getUsername());
        extraClaims.put("email",request.getEmail());
        extraClaims.put("password", encodedPassword);
        //extraClaims.put("role", "ROLE_USER");

        //Generate confirmation token
        String token=jwtService.generateToken(extraClaims,request.getUsername());
        
        String link = "http://localhost:4200/auth/confirm?token=" + token;
        //String message="Please click on the link below to confirm your email address";
        String message="Thank you for registering. Please click on the link below to activate your account";
        String reciever=request.getEmail();
        String name=request.getFirstname();
        emailService.sendHtmlEmail(reciever, name, link, message,"Activate now",
        "Confirm your email","User confirmation");

        //add email template 
        //emailService.send(request.getEmail(),"Please click on the link below to confirm your email address:\n"+link);
        //add email message parameter when sending
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message", "Confirmation email sent successfully");
        return responseData;

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){

        Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
       
        // Cast Authentication to User
        SecurityUser securityUser =  (SecurityUser)authentication.getPrincipal();
        System.out.println("security user authorities: "+securityUser.getAuthorities());
        //System.err.println("user principal: "+user.getUser());
        
        User user=securityUser.getUser();
        // Create extra claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userid", user.getId());
        extraClaims.put("firstname", user.getFirstname());
        extraClaims.put("lastname", user.getLastname());
        extraClaims.put("username", user.getUsername());
        //extraClaims.put("roles", user.getRoles());
        List<String> roleNames = user.getRoles().stream()
                                       .map(Role::getName) // Assuming Role class has getName() method
                                       .collect(Collectors.toList());

        extraClaims.put("roles", roleNames);

        //Generate user tokens
        String jwtToken=jwtService.generateToken(extraClaims,user.getEmail());
        String refreshToken=jwtService.generateRefreshToken(extraClaims,user.getEmail());
        //return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).build();
        return new AuthenticationResponse(jwtToken,refreshToken);
    }

    public AuthenticationResponse refreshToken(RefreshRequest request)  {
        
        final String refreshToken;
        final String email;
        //final String userRole;

        refreshToken=request.getRefreshToken();
        Claims claims=jwtService.extractRefreshClaims(refreshToken);
        email=(String)claims.getSubject();
        //userRole=(String)claims.get("roles");

        //make db query in case an update happened 

        User user=userRepo.findByEmail(email).orElseThrow(()->new JwtException("Invalid JWT"));

        // Create extra claims with user role
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userid", user.getId());
        extraClaims.put("firstname", user.getFirstname());
        extraClaims.put("lastname", user.getLastname());
        extraClaims.put("username", user.getUsername());
        extraClaims.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));


        //the validity is checked during parsing
       
        String accessToken=jwtService.generateToken(extraClaims,email);
        return new AuthenticationResponse(accessToken, refreshToken);
         
        //the parsing will throw the exceptions
        //when the refresh token is expired the user is logged out

    }

    public Map<String, String> confirmUser(String token){
        
        //extract user info from confirmation token save user to db
        Claims userInfo=jwtService.extractAllClaims(token);

        User user=new User(userInfo);
        //check if user is already in db
        userRepo.findByUsername(user.getUsername()).ifPresent(unconfirmedUser -> {
            throw new AccountVerificationException("User already verified account");
        });

        Role userRole=roleRepository.findByName("ROLE_USER").orElseThrow();
        List<Role> userRoles=List.of(userRole);
        user.setRoles(userRoles);

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

    public Map<String, String> forgetPassword(String email) {
        //check user existance from email
        User user=userRepo.findByEmail(email).orElseThrow(()->new UserNotFoundException("User not found"));
        //send reset link with jwt
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message","Password reset link was sent successfully.\n Please check your email");
        //Generate confirmation tokens //with duration set access to 15 minutes

        
        String name=user.getFirstname();
        //emailService.sendHtmlEmail(reciever, name, link, message);


        String token=jwtService.generateToken(email);
        String link = "http://localhost:4200/auth/reset-password?token="+token;
        String message="Please click on the link below to reset your password";
        //emailService.send(email, "Please click on the link below to confirm your email address:\n"+link);
        emailService.sendHtmlEmail(email, name, link, message,"Reset now",
        "Forgot your password","Password reset");
        return responseData;
    }

    public Map<String, String> resetPassword(String token,String password){
        String email=jwtService.extractUsername(token);
        userRepo.findByEmail(email).ifPresentOrElse(existingUser -> {
                    existingUser.setPassword(passwordEncoder.encode(password));
                    userRepo.save(existingUser);
                }, 
                () -> {
                    throw new UserNotFoundException("User not found");
                });
        
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message","password was reset successfully");
        return responseData;
    }


    
}
