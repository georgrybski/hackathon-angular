import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hackathon-angular';
  items: MenuItem[];

  constructor(private primengConfig: PrimeNGConfig) {}


  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.items = [{
      label: 'Users',
      items: [{
          label: 'User Management System',
          icon: 'pi pi-users',
          routerLink: 'user-crud-table'
        }
      ]
    }
    ];
  }
}
