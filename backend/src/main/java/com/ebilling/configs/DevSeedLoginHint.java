package com.ebilling.configs;

import com.ebilling.repositories.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Logs fixed dev login IDs after Liquibase seed (see db/changelog).
 */
@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class DevSeedLoginHint implements ApplicationRunner {

    public static final String SEED_ADMIN_USER_ID = "USR1000001";
    public static final String SEED_EMPLOYEE_ID = "EMP1000001";
    public static final String SEED_CUSTOMER_ID = "CST1000001";
    public static final String SEED_CUSTOMER_ID_2 = "CST1000002";

    private final UserRepository userRepository;

    @Override
    public void run (ApplicationArguments args) {
        if (!userRepository.existsById (SEED_ADMIN_USER_ID)) {
            log.warn ("""
                    
                    ========== DEV SEED DATA MISSING ==========
                    Expected admin user {} was not found.
                    
                    Your DB may pre-date Liquibase seeds (e.g. old bootstrap IDs).
                    Fresh reset (recommended):
                      docker compose down -v && docker compose up -d
                    Then restart the backend (profile: local).
                    ===========================================
                    """, SEED_ADMIN_USER_ID);
            return;
        }
        log.warn ("""
                
                ========== DEV SEED DATA (Liquibase) ==========
                Sign in at http://localhost:5173/login (OTP in server log).
                
                1) ADMIN     -> {}
                2) EMPLOYEE  -> {}
                3) CUSTOMER  -> {}  (alt: {})
                
                Pay bills (UPI): {} / PIN {}
                (Receiver UPI must match BILLING_RECEIVER_UPI_ID in .env)
                
                ==============================================
                """,
                SEED_ADMIN_USER_ID,
                SEED_EMPLOYEE_ID,
                SEED_CUSTOMER_ID,
                SEED_CUSTOMER_ID_2,
                DevPaymentSeed.DEV_SENDER_UPI_ID,
                DevPaymentSeed.DEV_SENDER_PIN);
    }
}
