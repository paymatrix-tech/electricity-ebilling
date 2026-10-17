package com.ebilling.configs;

import com.ebilling.response.CustomApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class SecurityJsonHandlers implements AuthenticationEntryPoint, AccessDeniedHandler {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper ();

    @Override
    public void commence (
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        write (response, HttpStatus.UNAUTHORIZED, "Authentication required. Sign in with OTP and send a valid Bearer token.");
    }

    @Override
    public void handle (
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {
        write (response, HttpStatus.FORBIDDEN, "You do not have permission to access this resource.");
    }

    private void write (HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus (status.value ());
        response.setCharacterEncoding (StandardCharsets.UTF_8.name ());
        response.setContentType (MediaType.APPLICATION_JSON_VALUE);
        OBJECT_MAPPER.writeValue (
                response.getWriter (),
                CustomApiResponse.error (message, status.value ())
        );
    }
}
