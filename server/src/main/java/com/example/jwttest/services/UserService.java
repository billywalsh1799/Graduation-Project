package com.example.jwttest.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.jwttest.exceptionHandling.exceptions.UserAlreadyExistsException;
import com.example.jwttest.exceptionHandling.exceptions.UserNotFoundException;
import com.example.jwttest.exceptionHandling.exceptions.WrongPasswordException;
import com.example.jwttest.models.PasswordResetRequest;
import com.example.jwttest.models.ProfileUpdateRequest;
import com.example.jwttest.models.User;
import com.example.jwttest.models.UserDto;
import com.example.jwttest.repo.UserRepository;
import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserDto getUser(String email){    
        User user=userRepo.findByEmail(email).orElseThrow(()->new UserNotFoundException("User not found"));
        return new UserDto(user.getId(),user.getFirstname(),
                           user.getLastname(),user.getUsername(),user.getEmail(),
                           user.getRole(),user.isEnabled());

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
                    .map(user -> new UserDto(user.getId(),user.getFirstname(),user.getLastname()
                    ,user.getUsername(), user.getEmail(), user.getRole(),user.isEnabled()))
                    .collect(Collectors.toList());
    }

   /*  public void enableUser(Long userId) {
        User user =userRepo.findById(userId).orElseThrow(()-> new UserNotFoundException("user with id: "+userId+"not found"));                          
        user.setEnabled(true);
        userRepo.save(user);
    }
    public void disableUser(Long userId) {
        User user =userRepo.findById(userId).orElseThrow(()-> new UserNotFoundException("user with id: "+userId+"not found"));                          
        user.setEnabled(false);
        userRepo.save(user);
    } */





    public UserDto updateUser(Long userId, String role, boolean enabled) {
        User user = userRepo.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setRole(role);
        user.setEnabled(enabled);
        User updatedUser= userRepo.save(user);
        return new UserDto(updatedUser.getId(),updatedUser.getFirstname(),
                           updatedUser.getLastname(),updatedUser.getUsername(),updatedUser.getEmail(),
                           updatedUser.getRole(),updatedUser.isEnabled());
       
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

        return new UserDto(updatedUser.getId(),updatedUser.getFirstname(),
            updatedUser.getLastname(),updatedUser.getUsername(),updatedUser.getEmail(),
            updatedUser.getRole(),updatedUser.isEnabled());

    }


    public Map<String, String> resetUserPassword(PasswordResetRequest request){
        //useremail
        //forgot encoding
        System.out.println("password reset request");
        User user=userRepo.findByEmail(request.getEmail()).orElseThrow(()->new UserNotFoundException("User not found"));
    /*     if(user.getUsername()!=request.getCurrentPassword()){
            throw new WrongPasswordException("Wrong password");
        } */
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

    /* public void deleteUser(String username){
        userRepo.deleteByUsername(username);

    } */
    /* @Transactional
    public void deleteUser(String username) {
        Query query = entityManager.createQuery("DELETE FROM User u WHERE u.username = :username");
        query.setParameter("username", username);
        int rowsAffected = query.executeUpdate();

        if (rowsAffected == 0) {
            // User does not exist
            System.out.println("User with username '" + username + "' does not exist.");
            throw new UserNotFoundException("User with username '" + username + "' does not exist.");
            // You can throw an exception here, or handle it as needed
        } else {
            // Deletion successful
            System.out.println("User with username '" + username + "' has been deleted.");
        }
    
    } */


    public void deleteUserId(Long id) {
        userRepo.deleteById(id);
       
    }
    
        /* public void deleteUser(String username) {
        try {
            entityManager.createQuery("DELETE FROM User u WHERE u.username = :username")
                         .setParameter("username", username)
                         .executeUpdate();
        } catch (EntityNotFoundException ex) {
            // Handle the case where the user does not exist
            // For example, log the error or return an appropriate response
            System.out.println("User with username '" + username + "' does not exist.");
            throw new UserNotFoundException("User with username '" + username + "' does not exist.");
            
            // Alternatively, you can rethrow the exception to propagate it to the caller
            // throw ex;
        }
    
    } */
    

}
