package be.pxl.services.domain;

import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    private Long id;
    private String title;
    private String content;

}
