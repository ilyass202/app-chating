package com.tuto.chat.Model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatModel {
    
    private String content;
    private String sender;
    private Status status;
    

}
