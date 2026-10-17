package com.ebilling.repositories.payment;

import com.ebilling.models.payment.DebitCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DebitCardRepository extends JpaRepository<DebitCard, String> {
    Optional<DebitCard> findByNumber (String number);
}

