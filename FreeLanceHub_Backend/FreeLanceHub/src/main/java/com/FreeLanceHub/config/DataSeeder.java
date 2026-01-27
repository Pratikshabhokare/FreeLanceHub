import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Entity.Role;
import com.FreeLanceHub.Repository.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepo userRepo) {
        return args -> {
            if (userRepo.count() == 0) {
                User client = new User();
                client.setName("John Client");
                client.setUserName("john_client");
                client.setEmail("client@example.com");
                client.setPassword("password");
                client.setRole(Role.CLIENT);
                client.setEnabled(true);
                userRepo.save(client);

                User freelancer = new User();
                freelancer.setName("Jane Freelancer");
                freelancer.setUserName("jane_freelancer");
                freelancer.setEmail("freelancer@example.com");
                freelancer.setPassword("password");
                freelancer.setRole(Role.FREELANCER);
                freelancer.setEnabled(true);
                userRepo.save(freelancer);
                
                System.out.println("Database seeded with default users: client@example.com, freelancer@example.com");
            }
        };
    }
}
