package com.example.jwttest.models;
import io.jsonwebtoken.Claims;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data   @NoArgsConstructor @AllArgsConstructor @Table(name="USERS")

public class User  {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String password;
    private String role;

    //role list
    
    @Column(nullable = false, columnDefinition = "boolean default true") // Add default value
    private boolean enabled;

    public User(String firstname, String lastname, String username, String email, String password, String role, boolean enabled) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
    }

    public User(Claims userInfo){
        this.firstname=(String)userInfo.get("firstname");
        this.lastname=(String)userInfo.get("lastname");
        this.username=(String)userInfo.get("username");
        this.email=(String)userInfo.get("email");
        this.password=(String)userInfo.get("password");
        this.role="ROLE_USER";

    }

}
