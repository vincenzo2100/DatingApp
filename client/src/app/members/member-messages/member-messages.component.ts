import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
@Input() username: string;
messages: Message[];

constructor(private messageService: MessageService) {}
  ngOnInit(): void {
    this.loadMessages();
  }

loadMessages()
{
  this.messageService.getMessageThread(this.username).subscribe(messages => {
    this.messages = messages;
  })
}
}
