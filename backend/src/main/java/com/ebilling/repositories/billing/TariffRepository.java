package com.ebilling.repositories.billing;

import com.ebilling.models.billing.ConnectionType;
import com.ebilling.models.billing.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TariffRepository extends JpaRepository<Tariff, String> {
    List<Tariff> findByConnectionType (ConnectionType connectionType);
}
