package it.peoplefirs.chatboot.controller;


import it.peoplefirs.chatboot.model.User;
import it.peoplefirs.chatboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/hello")
    public Mono<String> hello() {
        return Mono.just("Hello, world! hellldsadsal");
    }

    @GetMapping
    public Flux<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping(value = "/streamUsers", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<User> streamUsers() {
        return userService.findAllUsers()
                .delayElements(Duration.ofSeconds(1));
    }
}
