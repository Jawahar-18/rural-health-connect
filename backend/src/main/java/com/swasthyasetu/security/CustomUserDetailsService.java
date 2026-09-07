package com.swasthyasetu.security;

import com.swasthyasetu.entity.User;
import com.swasthyasetu.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrPhone) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(usernameOrPhone)
                .or(() -> userRepository.findByPhone(usernameOrPhone))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or phone: " + usernameOrPhone));

        return new CustomUserDetails(user);
    }
}
