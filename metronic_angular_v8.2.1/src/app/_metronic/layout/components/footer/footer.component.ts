import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChatbotService } from '../../core/chatbot.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() appFooterContainerCSSClass: string = '';

  currentDateStr: string = new Date().getFullYear().toString();
  
  // Variables para el chat
  isChatOpen: boolean = false;
  messages: Array<{text: string, isUser: boolean, timestamp: Date}> = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  
  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef) {
    // Mensaje de bienvenida
    this.messages.push({
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    });
  }
  
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }
  
  closeChat(): void {
    this.isChatOpen = false;
  }
  
  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) return;
    
    // Agregar mensaje del usuario
    this.messages.push({
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    });
    
    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();
    
    // Enviar mensaje al bot de n8n
    this.chatbotService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.messages.push({
          text: response.respuesta || response.text || 'Lo siento, no pude procesar tu mensaje.',
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.messages.push({
          text: 'Lo siento, ocurrió un error. Por favor, intenta nuevamente.',
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
    
    this.scrollToBottom();
  }
  
  onInputChange(event: any): void {
    this.currentMessage = event.target.value;
  }
  
  onKeyPress(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  
  private scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }
}
