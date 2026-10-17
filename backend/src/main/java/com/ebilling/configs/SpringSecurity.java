package com.ebilling.configs;

import com.ebilling.filters.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SpringSecurity {

    @Autowired
    private JwtRequestFilter jwtFilter;

    @Autowired
    private SecurityJsonHandlers securityJsonHandlers;

    @Value("${app.cors.allowed-origins:*}")
    private String corsAllowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception {
        List<String> origins = List.of (corsAllowedOrigins.split (","));
        boolean allowAllOrigins = origins.size () == 1 && "*".equals (origins.get (0).trim ());

        return http.
                cors (cors -> cors.configurationSource (request -> {
                    CorsConfiguration config = new CorsConfiguration ();
                    if (allowAllOrigins) {
                        config.setAllowedOriginPatterns (List.of ("*"));
                    } else {
                        config.setAllowedOrigins (origins.stream ().map (String::trim).filter (s -> !s.isEmpty ()).toList ());
                    }
                    config.setAllowedMethods (List.of ("*"));
                    config.setAllowedHeaders (List.of ("*"));
                    return config;
                })).
                authorizeHttpRequests (request -> request
                        .requestMatchers ("/auth/otp/**", "/api-docs/**").permitAll ()
                        .requestMatchers ("/api/auth/customers/**").hasAnyRole ("ADMIN", "CUSTOMER", "EMPLOYEE")
                        .requestMatchers ("/api/auth/employees/**").hasAnyRole ("ADMIN", "EMPLOYEE")
                        .anyRequest ().authenticated ())
                .exceptionHandling (ex -> ex
                        .authenticationEntryPoint (securityJsonHandlers)
                        .accessDeniedHandler (securityJsonHandlers))
                .csrf (AbstractHttpConfigurer::disable)
                .sessionManagement (session -> session
                        .sessionCreationPolicy (SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore (jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build ();
    }

    @Bean
    public AuthenticationManager authenticationManager (AuthenticationConfiguration auth) throws Exception {
        return auth.getAuthenticationManager ();
    }
}