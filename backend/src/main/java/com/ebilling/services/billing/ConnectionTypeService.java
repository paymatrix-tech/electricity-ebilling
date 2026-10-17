package com.ebilling.services.billing;

import com.ebilling.dtos.billing.ConnectionTypeRequest;
import com.ebilling.dtos.billing.ConnectionTypeResponse;
import com.ebilling.dtos.common.PaginationRequest;
import com.ebilling.dtos.common.PaginationResponse;
import com.ebilling.exceptions.BadRequestException;
import com.ebilling.exceptions.ResourceNotFoundException;
import com.ebilling.models.billing.ConnectionType;
import com.ebilling.repositories.billing.ConnectionTypeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConnectionTypeService {

    private final ConnectionTypeRepository connectionTypeRepository;
    private final ModelMapper modelMapper;

    // Create a new ConnectionType
    public ConnectionTypeResponse createConnectionType (ConnectionTypeRequest connectionTypeRequest) {
        if (connectionTypeRequest.getTypeName () == null || connectionTypeRequest.getTypeName ().isEmpty ()) {
            throw new BadRequestException ("Type name is mandatory.");
        }

        ConnectionType connectionType = modelMapper.map (connectionTypeRequest, ConnectionType.class);
        ConnectionType savedConnectionType = connectionTypeRepository.save (connectionType);
        return modelMapper.map (savedConnectionType, ConnectionTypeResponse.class);
    }

    // Read ConnectionType by ID
    public ConnectionTypeResponse getConnectionTypeById (String id) {
        ConnectionType connectionType = connectionTypeRepository.findById (id)
                .orElseThrow (() -> new ResourceNotFoundException ("ConnectionType not found with ID: " + id));
        return modelMapper.map (connectionType, ConnectionTypeResponse.class);
    }

    // Update ConnectionType details
    public ConnectionTypeResponse updateConnectionType (String id, ConnectionTypeRequest connectionTypeRequest) {
        ConnectionType connectionType = connectionTypeRepository.findById (id)
                .orElseThrow (() -> new ResourceNotFoundException ("ConnectionType not found with ID: " + id));

        // Update fields if they are present in the request
        if (connectionTypeRequest.getTypeName () != null) {
            connectionType.setTypeName (connectionTypeRequest.getTypeName ());
        }
        if (connectionTypeRequest.getDescription () != null) {
            connectionType.setDescription (connectionTypeRequest.getDescription ());
        }

        ConnectionType updatedConnectionType = connectionTypeRepository.save (connectionType);
        return modelMapper.map (updatedConnectionType, ConnectionTypeResponse.class);
    }

    // Delete ConnectionType by ID
    public void deleteConnectionType (String id) {
        ConnectionType connectionType = connectionTypeRepository.findById (id)
                .orElseThrow (() -> new ResourceNotFoundException ("ConnectionType not found with ID: " + id));
        connectionTypeRepository.delete (connectionType);
    }

    // Search ConnectionTypes with Pagination
    public PaginationResponse<ConnectionTypeResponse> searchConnectionTypesWithPagination (PaginationRequest paginationRequest) {
        Pageable pageable = PageRequest.of (paginationRequest.getPage (), paginationRequest.getSize ());
        Page<ConnectionType> connectionTypePage = connectionTypeRepository.findAll (pageable);

        List<ConnectionTypeResponse> connectionTypeResponses = connectionTypePage.getContent ().stream ()
                .map (connectionType -> modelMapper.map (connectionType, ConnectionTypeResponse.class))
                .toList ();

        return PaginationResponse.<ConnectionTypeResponse>builder ()
                .content (connectionTypeResponses)
                .totalPages (connectionTypePage.getTotalPages ())
                .totalElements (connectionTypePage.getTotalElements ())
                .size (connectionTypePage.getSize ())
                .number (connectionTypePage.getNumber ())
                .build ();
    }
}
