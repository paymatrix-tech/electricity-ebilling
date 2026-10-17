package com.ebilling.services.auth;

import com.ebilling.dtos.auth.*;
import com.ebilling.dtos.common.PaginationRequest;
import com.ebilling.dtos.common.PaginationResponse;
import com.ebilling.exceptions.BadRequestException;
import com.ebilling.exceptions.ResourceNotFoundException;
import com.ebilling.models.auth.Customer;
import com.ebilling.models.auth.Employee;
import com.ebilling.models.auth.User;
import com.ebilling.repositories.auth.EmployeeRepository;
import com.ebilling.repositories.auth.UserRepository;
import com.ebilling.services.notification.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final EmailService emailService;


    private static User getUser (UserCustomerRequest userCustomerRequest, Customer customer) {
        User user = customer.getUser ();
        if (userCustomerRequest.getEmail () != null) {
            user.setEmail (userCustomerRequest.getEmail ());
        }
        if (userCustomerRequest.getPhoneNumber () != null) {
            user.setPhoneNumber (userCustomerRequest.getPhoneNumber ());
        }
        if (userCustomerRequest.getFirstName () != null) {
            user.setFirstName (userCustomerRequest.getFirstName ());
        }
        if (userCustomerRequest.getLastName () != null) {
            user.setLastName (userCustomerRequest.getLastName ());
        }
        return user;
    }

    // Create a new Employee
    public UserEmployeeResponse createEmployee (EmployeeRequest employeeRequest) {
        if (employeeRequest.getUserId () == null || employeeRequest.getUserId ().isEmpty ()) {
            throw new BadRequestException ("User ID is mandatory.");
        }

        User user = userRepository.findById (employeeRequest.getUserId ())
                .orElseThrow (() -> new ResourceNotFoundException ("User not found with ID: " + employeeRequest.getUserId ()));

        Employee employee = modelMapper.map (employeeRequest, Employee.class);
        employee.setUser (user);

        Employee savedEmployee = employeeRepository.save (employee);

        return mapToUserEmployeeResponse (savedEmployee);
    }

    // Add Employee with user details
    public UserEmployeeResponse addEmployeeWithUserDetails (UserEmployeeRequest userEmployeeRequest) {
        validateUserEmployeeRequest (userEmployeeRequest);

        UserRequest userRequest = modelMapper.map (userEmployeeRequest, UserRequest.class);
        // Create user to get user ID
        UserResponse userResponse = userService.createUser (userRequest);

        String userId = userResponse.getId ();

        EmployeeRequest employeeRequest = new EmployeeRequest ();
        employeeRequest.setUserId (userId);
        employeeRequest.setDesignation (userEmployeeRequest.getDesignation ());
        employeeRequest.setSalary (userEmployeeRequest.getSalary ());


        // Directly return the response from createEmployee
        UserEmployeeResponse response = createEmployee (employeeRequest);
        emailService.sendEmail (response.getEmail (), "Welcome Email",
                "Welcome to Electricity eBilling. Your employee ID is: " + response.getEmployeeId (), true);
        return response;
    }


    public PaginationResponse<UserEmployeeResponse> searchEmployeesWithPagination (
            PaginationRequest paginationRequest,
            String firstName,
            String lastName,
            String email
    ) {
        Pageable pageable = PageRequest.of (paginationRequest.getPage (), paginationRequest.getSize ());
        Page<Employee> employeePage = employeeRepository.searchEmployeeWithUserDetails (firstName, lastName, email, pageable);

        List<UserEmployeeResponse> content = employeePage.getContent ().stream ()
                .map (this::mapToUserEmployeeResponse)
                .toList ();

        return PaginationResponse.<UserEmployeeResponse>builder ()
                .content (content)
                .totalPages (employeePage.getTotalPages ())
                .totalElements (employeePage.getTotalElements ())
                .size (employeePage.getSize ())
                .number (employeePage.getNumber ())
                .build ();
    }

    // Get Employee by ID
    public UserEmployeeResponse getEmployeeById (String employeeId) {
        Employee employee = employeeRepository.findById (employeeId)
                .orElseThrow (() -> new ResourceNotFoundException ("Employee not found with ID: " + employeeId));

        return mapToUserEmployeeResponse (employee);
    }

    // Update user and Employee details
    public UserEmployeeResponse updateUserEmployee (String employeeId, UserEmployeeRequest userEmployeeRequest) {
        // Find the employee by ID
        Employee employee = employeeRepository.findById (employeeId)
                .orElseThrow (() -> new ResourceNotFoundException ("Employee not found with ID: " + employeeId));

        User user = employee.getUser ();
        if (userEmployeeRequest.getFirstName () != null) {
            user.setFirstName (userEmployeeRequest.getFirstName ());
        }
        if (userEmployeeRequest.getLastName () != null) {
            user.setLastName (userEmployeeRequest.getLastName ());
        }
        if (userEmployeeRequest.getEmail () != null) {
            user.setEmail (userEmployeeRequest.getEmail ());
        }
        if (userEmployeeRequest.getPhoneNumber () != null) {
            user.setPhoneNumber (userEmployeeRequest.getPhoneNumber ());
        }

        userRepository.save (user); // Save updated user

        // Update employee details
        if (userEmployeeRequest.getDesignation () != null) {
            employee.setDesignation (userEmployeeRequest.getDesignation ());
        }

        Employee updatedEmployee = employeeRepository.save (employee); // Save updated employee

        return mapToUserEmployeeResponse (updatedEmployee);
    }

    // Delete customer
    public void deleteEmployee (String employeeId) {
        Employee employee = employeeRepository.findById (employeeId)
                .orElseThrow (() -> new ResourceNotFoundException ("Customer not found with ID: " + employeeId));

        if (employee.getUser ().getEmployee () == null) {
            userRepository.delete (employee.getUser ());
            employeeRepository.delete (employee);
        } else {
            User user = employee.getUser ();
            user.setEmployee (null);
            userRepository.save (user);
            employeeRepository.delete (employee);
        }
    }

    // Helper method to map Employee to UserEmployeeResponse
    private UserEmployeeResponse mapToUserEmployeeResponse (Employee employee) {
        User user = employee.getUser ();
        return UserEmployeeResponse.builder ()
                .userId (user.getId ())
                .employeeId (employee.getEmployeeId ())
                .firstName (user.getFirstName ())
                .lastName (user.getLastName ())
                .email (user.getEmail ())
                .phoneNumber (user.getPhoneNumber ())
                .designation (employee.getDesignation ())
                .salary (employee.getSalary ())
                .build ();
    }

    // Helper method to validate user customer request
    private void validateUserEmployeeRequest (UserEmployeeRequest userEmployeeRequest) {
        if (userEmployeeRequest.getPhoneNumber () == null || userEmployeeRequest.getPhoneNumber ().isEmpty ()) {
            throw new BadRequestException ("Phone number is mandatory.");
        }

        if (userEmployeeRequest.getEmail () == null || userEmployeeRequest.getEmail ().isEmpty ()) {
            throw new BadRequestException ("Email is mandatory.");
        }

        if (userEmployeeRequest.getFirstName () == null || userEmployeeRequest.getFirstName ().isEmpty ()) {
            throw new BadRequestException ("First name is mandatory.");
        }

        if (userEmployeeRequest.getLastName () == null || userEmployeeRequest.getLastName ().isEmpty ()) {
            throw new BadRequestException ("Last name is mandatory.");
        }
    }


}
