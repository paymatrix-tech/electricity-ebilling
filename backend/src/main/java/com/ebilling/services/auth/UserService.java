package com.ebilling.services.auth;

import com.ebilling.dtos.auth.UserRequest;
import com.ebilling.dtos.auth.UserResponse;
import com.ebilling.dtos.auth.UserSearchRequest;
import com.ebilling.dtos.common.PaginationRequest;
import com.ebilling.dtos.common.PaginationResponse;
import com.ebilling.exceptions.BadRequestException;
import com.ebilling.exceptions.ResourceNotFoundException;
import com.ebilling.models.auth.User;
import com.ebilling.repositories.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // Create a new user
    public UserResponse createUser (UserRequest userRequest) {
        if (userRequest.getEmail () == null || userRequest.getEmail ().isEmpty ()) {
            throw new BadRequestException ("Email is mandatory.");
        }

        User user = modelMapper.map (userRequest, User.class);
        User savedUser = userRepository.save (user);
        return modelMapper.map (savedUser, UserResponse.class);
    }

    // Read user by ID
    public UserResponse getUserById (String id) {
        User user = userRepository.findById (id)
                .orElseThrow (() -> new ResourceNotFoundException ("User not found with ID: " + id));
        return modelMapper.map (user, UserResponse.class);
    }

    // Update user details
    public UserResponse updateUser (String id, UserRequest userRequest) {
        User user = userRepository.findById (id)
                .orElseThrow (() -> new ResourceNotFoundException ("User not found with ID: " + id));

        // Update fields if they are present in the request
        if (userRequest.getFirstName () != null) {
            user.setFirstName (userRequest.getFirstName ());
        }
        if (userRequest.getLastName () != null) {
            user.setLastName (userRequest.getLastName ());
        }
        if (userRequest.getEmail () != null) {
            user.setEmail (userRequest.getEmail ());
        }
        if (userRequest.getPhoneNumber () != null) {
            user.setPhoneNumber (userRequest.getPhoneNumber ());
        }

        User updatedUser = userRepository.save (user);
        return modelMapper.map (updatedUser, UserResponse.class);
    }

    // Delete user by ID
    public void deleteUser (String id) {
        User user = userRepository.findById (id)
                .orElseThrow (() -> new ResourceNotFoundException ("User not found with ID: " + id));
        userRepository.delete (user);
    }

    public PaginationResponse<UserResponse> searchUsersWithPagination (
            UserSearchRequest searchRequest, PaginationRequest paginationRequest) {

        Pageable pageable = PageRequest.of (
                paginationRequest.getPage (),
                paginationRequest.getSize ()
        );

        Page<User> userPage = userRepository.searchUsers (
                searchRequest.getId (),
                searchRequest.getEmail (),
                searchRequest.getPhoneNumber (),
                searchRequest.getIsAdmin (),
                searchRequest.getFirstName (),
                searchRequest.getLastName (),
                pageable
        );

        List<UserResponse> userResponses = userPage.getContent ().stream ()
                .map (user -> modelMapper.map (user, UserResponse.class))
                .toList ();

        return PaginationResponse.<UserResponse>builder ()
                .content (userResponses)
                .totalPages (userPage.getTotalPages ())
                .totalElements (userPage.getTotalElements ())
                .size (userPage.getSize ())
                .number (userPage.getNumber ())
                .build ();
    }
}
