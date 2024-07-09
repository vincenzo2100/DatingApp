import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'The dating app';
  users :any;

  constructor(private http: HttpClient){

  }

  ngOnInit() {
   this.getUsers();
  }

  getUsers() {
    this.http.get('http://localhost:5034/api/users').subscribe({
      next: response => this.users = response,
      error: error => console.log(error)
    })
  }
}
