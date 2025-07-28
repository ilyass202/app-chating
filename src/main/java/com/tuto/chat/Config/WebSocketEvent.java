package com.tuto.chat.Config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.tuto.chat.Model.ChatModel;
import com.tuto.chat.Model.Status;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEvent {
    private final SimpMessageSendingOperations message;


    @EventListener
    public void sessionDisconect(SessionDisconnectEvent event){
        
        StompHeaderAccessor header = StompHeaderAccessor.wrap(event.getMessage());
        String username =(String) header.getSessionAttributes().get("username");

        if(username != null){
            log.info("utilisateur est déconnecté : {}" , username);

            ChatModel chat = ChatModel.builder().status(Status.LEAVE).sender(username).build();
            message.convertAndSend("/topic/public", chat);
        }
      
        

    }

    }
