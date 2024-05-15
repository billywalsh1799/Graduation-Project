package com.example.jwttest.models;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import io.jsonwebtoken.Claims;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
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
    //private String role;

    //role list
   /*  @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "document_id") 
    private List<Role> roles = new ArrayList<>();
 */

    //manytomany roles

    /* @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id") 
    private List<Role> roles= new ArrayList<>(); */


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="users_roles",
    joinColumns = @JoinColumn(name="user_id"),
    inverseJoinColumns = @JoinColumn(name="role_id"))
    private List<Role> roles= new ArrayList<>();


    
    @Column(nullable = false, columnDefinition = "boolean default true") // Add default value
    private boolean enabled;

    public User(String firstname, String lastname, String username, String email, String password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public User(Claims userInfo){
        this.firstname=(String)userInfo.get("firstname");
        this.lastname=(String)userInfo.get("lastname");
        this.username=(String)userInfo.get("username");
        this.email=(String)userInfo.get("email");
        this.password=(String)userInfo.get("password");
        //create the user then add the role
        

    }

}
