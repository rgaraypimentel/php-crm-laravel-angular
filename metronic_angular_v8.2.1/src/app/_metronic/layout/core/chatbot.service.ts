import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
  // Reemplaza esta URL con la URL de tu webhook de n8n
    private readonly N8N_WEBHOOK_URL = 'https://ronifiis.app.n8n.cloud/webhook/f730405c-d5a9-4e36-8162-956f50394478/chat';
    
    constructor(private http: HttpClient) { }

    sendMessage(chatInput: string): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    const body = {
        chatInput: chatInput,
        timestamp: new Date().toISOString(),
        // Puedes agregar más campos según lo que necesite tu flujo de n8n
        userId: this.generateUserId(),
        sessionId: this.getSessionId()
    };

    return this.http.post(this.N8N_WEBHOOK_URL, body, { headers });
}

    private generateUserId(): string {
    // Genera un ID único para el usuario (puedes usar tu lógica de autenticación)
    let userId = localStorage.getItem('chatbot_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatbot_user_id', userId);
    }
    return userId;
    }

    private getSessionId(): string {
    // Genera un ID único para la sesión
    let sessionId = sessionStorage.getItem('chatbot_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        sessionStorage.setItem('chatbot_session_id', sessionId);
    }
    return sessionId;
    }

}