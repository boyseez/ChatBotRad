package it.peoplefirs.chatboot.service;

import it.peoplefirs.chatboot.model.User;
import it.peoplefirs.chatboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Flux<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Mono<User> findUserById(String id) {
        return userRepository.findById(id);
    }
}
