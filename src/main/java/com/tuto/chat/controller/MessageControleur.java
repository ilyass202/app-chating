package com.tuto.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.tuto.chat.Model.ChatModel;

@Controller

public class MessageControleur {
    
    @MessageMapping("chat/Message")
    @SendTo("/topic/public")
    public ChatModel chatMethode(@Payload ChatModel chat){
        System.out.println("message recu" + chat.getContent());
        return chat ;
    }

    //method to get the username
    @MessageMapping("chat/user")
    @SendTo("/topic/public")
    public ChatModel chatUser(@Payload ChatModel chat , SimpMessageHeaderAccessor header){
        header.getSessionAttributes().put("username" , chat.getSender());
        return chat;
    }
}
