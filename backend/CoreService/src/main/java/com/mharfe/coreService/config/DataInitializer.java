package com.mharfe.coreService.config;

import com.mharfe.coreService.model.book.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import java.util.Arrays;
import java.util.UUID;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(MongoTemplate mongoTemplate) {
        return args -> {
            // Insert test data for books
            Book book1 = new Book(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"), "The Great Adventure", "A thrilling journey through unknown lands.");
            Book book2 = new Book(UUID.fromString("550e8400-e29b-41d4-a716-446655440001"), "Mystery of the Old House", "A mysterious tale of an old house with secrets.");
            mongoTemplate.insertAll(Arrays.asList(book1, book2));

            // Insert test data for chapters
            Chapter chapter1 = new Chapter("The Beginning", 1, book1);
            Chapter chapter2 = new Chapter("The Journey", 2, book1);
            Chapter chapter3 = new Chapter("The Discovery", 1, book2);
            mongoTemplate.insertAll(Arrays.asList(chapter1, chapter2, chapter3));

            // Insert test data for pages
            Page page1 = new Page("The story begins on a stormy night...", 1, chapter1);
            Page page2 = new Page("As they ventured deeper into the forest...", 2, chapter1);
            Page page3 = new Page("The old house stood silent and imposing...", 1, chapter2);
            Page page4 = new Page("A hidden door revealed a secret passage...", 1, chapter3);
            mongoTemplate.insertAll(Arrays.asList(page1, page2, page3, page4));

            // Insert test data for book summaries
            BookSummary summary1 = new BookSummary("A thrilling adventure that takes you through unknown lands.", book1.getId(), book1);
            BookSummary summary2 = new BookSummary("A mysterious tale of an old house with secrets.", book2.getId(), book2);
            mongoTemplate.insertAll(Arrays.asList(summary1, summary2));

            // Insert test data for chapter summaries
            ChapSummary chapsummary1 = new ChapSummary("The beginning of an epic journey.", chapter1);
            ChapSummary chapsummary2 = new ChapSummary("The journey through the unknown.", chapter2);
            ChapSummary chapsummary3 = new ChapSummary("The discovery of hidden secrets.", chapter3);
            mongoTemplate.insertAll(Arrays.asList(chapsummary1, chapsummary2, chapsummary3));

            // Insert test data for audio books
            AudioBook audiobook1 = new AudioBook("/path/to/audio1.mp3", book1.getId(), book1);
            AudioBook audiobook2 = new AudioBook("/path/to/audio2.mp3", book2.getId(), book2);
            mongoTemplate.insertAll(Arrays.asList(audiobook1, audiobook2));

            // Insert test data for chapter audios
            ChapAudio chapaudio1 = new ChapAudio("/path/to/chapter1audio.mp3", "voice1", chapter1.getId(), chapter1);
            ChapAudio chapaudio2 = new ChapAudio("/path/to/chapter2audio.mp3", "voice2", chapter2.getId(), chapter2);
            ChapAudio chapaudio3 = new ChapAudio("/path/to/chapter3audio.mp3", "voice3", chapter3.getId(), chapter3);
            mongoTemplate.insertAll(Arrays.asList(chapaudio1, chapaudio2, chapaudio3));

            // Insert test data for image prompts
            ImagePrompt prompt1 = new ImagePrompt("A stormy night scene", "/path/to/image1.jpg", page1);
            ImagePrompt prompt2 = new ImagePrompt("A dense forest scene", "/path/to/image2.jpg", page2);
            ImagePrompt prompt3 = new ImagePrompt("An old house scene", "/path/to/image3.jpg", page3);
            ImagePrompt prompt4 = new ImagePrompt("A secret passage scene", "/path/to/image4.jpg", page4);
            mongoTemplate.insertAll(Arrays.asList(prompt1, prompt2, prompt3, prompt4));
        };
    }
} 