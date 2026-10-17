package com.ebilling.configs;

import com.ebilling.exceptions.MailExceptionSupport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.lang.reflect.Method;
import java.util.concurrent.Executor;

@Slf4j
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Bean(name = "emailTaskExecutor")
    public Executor emailTaskExecutor () {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor ();
        executor.setCorePoolSize (2);
        executor.setMaxPoolSize (4);
        executor.setQueueCapacity (100);
        executor.setThreadNamePrefix ("Email-");
        executor.setWaitForTasksToCompleteOnShutdown (true);
        executor.setAwaitTerminationSeconds (30);
        executor.initialize ();
        return executor;
    }

    @Bean(name = "fileLoadingTaskExecutor")
    public Executor fileLoadingTaskExecutor () {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor ();
        executor.setCorePoolSize (2);
        executor.setMaxPoolSize (4);
        executor.setQueueCapacity (50);
        executor.setThreadNamePrefix ("File-");
        executor.setWaitForTasksToCompleteOnShutdown (true);
        executor.setAwaitTerminationSeconds (30);
        executor.initialize ();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler () {
        return (Throwable throwable, Method method, Object... params) -> {
            if (MailExceptionSupport.isMailRelated (throwable)) {
                String recipient = params.length > 0 ? String.valueOf (params[0]) : null;
                MailExceptionSupport.logDeliveryFailure (recipient, method.getName (), throwable);
                return;
            }
            log.error ("Async task {} failed: {}", method.getName (), throwable.getMessage ());
            log.debug ("Async task failure", throwable);
        };
    }
}
