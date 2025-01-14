package be.pxl.services.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfiguration {
    @Bean
    public Queue myQueue(){
        return new Queue("myQueue", false);
    }
    @Bean
    public Queue approvePostQueue(){
        return new Queue("approvePostQueue", false);
    }
    @Bean
    public Queue rejectPostQueue(){
        return new Queue("rejectPostQueue", false);
    }



}
