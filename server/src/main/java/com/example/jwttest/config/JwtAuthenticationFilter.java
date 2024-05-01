package com.example.jwttest.config;

import java.io.IOException;


import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import com.example.jwttest.services.JpaUserDetailsService;
import com.example.jwttest.services.JwtService;


import io.jsonwebtoken.ExpiredJwtException;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Component @RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    //private final UserDetailsService userDetailsService;
    private final JpaUserDetailsService jpaUserDetailsService;
    

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("hello from jwt filter");
       final String authHeader=request.getHeader("Authorization");
       final String jwt;
       final String username;
        
       String requestURI = request.getRequestURI();
       System.out.println("request url: "+requestURI);
       if (requestURI.startsWith("/api/auth/")) {
        // Skip the filter for "/api/auth/**" endpoints
        filterChain.doFilter(request, response);
        return;
    }
    
             
        jwt=authHeader.substring(7);
        System.out.println("token expired before");
        try {
            username=jwtService.extractUsername(jwt);
            //Expiredjwtexceptoin
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("JWT expired");

            return;
        }

        //remove the loadingusername just check the signature db query in refresh method only
        
        if (username!=null && SecurityContextHolder.getContext().getAuthentication()==null){

            //UserDetails userDetails=this.userDetailsService.loadUserByUsername(username);
            UserDetails userDetails=this.jpaUserDetailsService.loadUserByUsername(username);
            
            if (jwtService.isTokenValid(jwt, userDetails)){
                UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(userDetails,
                null,userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            else{
                System.out.println("invalid filter");
            }
           
        }
        
        filterChain.doFilter(request, response);
    }  
}
