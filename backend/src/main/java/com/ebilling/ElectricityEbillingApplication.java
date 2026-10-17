package com.ebilling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.ebilling.models")
@EnableJpaRepositories("com.ebilling.repositories")
@EnableCaching
public class ElectricityEbillingApplication {

    public static void main (String[] args) {
        SpringApplication.run (ElectricityEbillingApplication.class, args);
    }
}
