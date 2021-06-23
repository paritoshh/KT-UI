import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @ViewChild('closeButton') closebutton;


  constructor() { }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    this.closebutton.nativeElement.click();
  }

}
