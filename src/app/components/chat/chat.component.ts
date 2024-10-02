import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client'; // Importez le client Socket.IO

interface ChatMessage {
  user: string;
  message: string;
  timestamp: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  private socket: any; // Socket.IO instance

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.socket = io('http://localhost:3000'); // Connectez-vous au serveur
  
    this.socket.on('receiveMessage', (message: ChatMessage) => {
      console.log('Received message:', message); // Log message received
      this.messages.push(message); // Ajoutez le message reçu à la liste
    });
  }
  
  sendMessage(): void {
    if (this.newMessage.trim()) {
      const userName = this.authService.getUserName(); // Récupérez le nom de l'utilisateur
      const timestamp = new Date().toLocaleTimeString();
      const message: ChatMessage = {
        user: userName,
        message: this.newMessage,
        timestamp: timestamp
      };
  
      console.log('Sending message:', message); // Log message sending
      this.socket.emit('sendMessage', message); // Émettez le message au serveur
      this.newMessage = '';
    }
  }

  getColor(user: string): string {
    const hash = [...user].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360; // Obtenir une couleur basée sur le nom
    return `hsl(${hue}, 70%, 50%)`; // Couleur en HSL
  }
  
  ngOnDestroy(): void {
    this.socket.disconnect(); // Déconnectez-vous lorsque le composant est détruit
  }
}
