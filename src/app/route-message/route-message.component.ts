import { Component, OnInit } from '@angular/core';
import { RouteMessageService } from '../route-message.service';

@Component({
  selector: 'app-route-message',
  templateUrl: './route-message.component.html',
  styleUrls: ['./route-message.component.css']
})
export class RouteMessageComponent implements OnInit {

  currentMessage: string = '';


  constructor(private routeMessageService: RouteMessageService) { }

  ngOnInit(): void {
    this.currentMessage = this.routeMessageService.message;
  }

}
