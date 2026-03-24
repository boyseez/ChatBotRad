package it.peoplefirs.chatboot;

import org.springframework.boot.SpringApplication;

public class TestChatBootApplication {

    public static void main(String[] args) {
        SpringApplication.from(ChatBootApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
