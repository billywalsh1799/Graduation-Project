package com.example.jwttest.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.jwttest.dtos.PasswordResetRequest;
import com.example.jwttest.dtos.ProfileUpdateRequest;
import com.example.jwttest.dtos.UserDto;
import com.example.jwttest.exceptionHandling.exceptions.UserAlreadyExistsException;
import com.example.jwttest.exceptionHandling.exceptions.UserNotFoundException;
import com.example.jwttest.exceptionHandling.exceptions.WrongPasswordException;
import com.example.jwttest.models.Role;
import com.example.jwttest.models.User;
import com.example.jwttest.repo.RoleRepository;
import com.example.jwttest.repo.UserRepository;
import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getUser(String email){    
        User user=userRepo.findByEmail(email).orElseThrow(()->new UserNotFoundException("User not found"));
        return new UserDto(user);

    }

    public User saveUser(User user){
        return userRepo.save(user);
    }
    
    public List<User> getAll(){
        return userRepo.findAll();
    }

    public List<UserDto> getUsers() {
        List<User> users = userRepo.findAll();
        return users.stream()
                    .map(UserDto::new)
                    .collect(Collectors.toList());
    }

    public UserDto updateUser(Long userId, List<String> roles, boolean enabled) {
        User user = userRepo.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        //user.setRoles(roles);
        List<Role> userRoles=roleRepository.findAllByNameIn(roles);
        user.setRoles(userRoles);
        user.setEnabled(enabled);
        User updatedUser= userRepo.save(user);
        return new UserDto(updatedUser);
    }

    public UserDto updateUserProfile(ProfileUpdateRequest request){

        //check username existance if username not empty string
        User user=userRepo.findByEmail(request.getEmail()).orElseThrow(()->new UserNotFoundException("User not found"));
        if(!user.getUsername().equals(request.getUsername())){
            //there has been a change in username check if it is used
            System.out.println("user: "+user+" requestusername: "+request);
            userRepo.findByUsername(request.getUsername()).ifPresent(existingUser -> {
                throw new UserAlreadyExistsException("Username is already in use");
            });
            user.setUsername(request.getUsername());
        }
        //no change in username
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        User updatedUser= userRepo.save(user);
        return new UserDto(updatedUser);
    }


    public Map<String, String> resetUserPassword(PasswordResetRequest request){
        
        System.out.println("password reset request");
        User user=userRepo.findByEmail(request.getEmail()).orElseThrow(()->new UserNotFoundException("User not found"));

        //check current password
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
            throw new WrongPasswordException("Wrong password");
        }

        //password encoder
        String encodedPassword=passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedPassword);
        userRepo.save(user);
        Map<String, String> responseData = new HashMap<>();
        responseData.put("message", "Password was reset successfully");
        return responseData;

    }

    public void deleteUserId(Long id) {
        userRepo.deleteById(id);
    }

    public Map<String, List<String>> getReviewers() {

        List<User> users = userRepo.findAll();
        List<String> reviewers= users.stream()
                                    .map(user ->user.getEmail())
                                    .collect(Collectors.toList());

        Map<String, List<String>> responseData = new HashMap<>();
        responseData.put("reviewers", reviewers);
        return responseData;
    }

    public Map<String, List<String>> getRoles(){
        Map<String, List<String>> responseData = new HashMap<>();
        List<String> roles=roleRepository.findAll().stream()
                                                    .map(Role::getName)
                                                    .collect(Collectors.toList());
        responseData.put("roles",roles );
        return responseData;
    }


}
