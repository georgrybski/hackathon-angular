import { Component, OnInit } from '@angular/core';
import { UserViewData } from '../../models/user-view-data';
import { UserlService } from '../../services/userl.service';
import {ConfirmationService, MessageService, SelectItem } from 'primeng/api';


@Component({
  selector: 'app-user-crud-table',
  templateUrl: './user-crud-table.component.html',
    styleUrls: ['./user-crud-table.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class UserCrudTableComponent implements OnInit {

  users: UserViewData[];

  user: UserViewData;

  selectedUsers: UserViewData[];

  months: SelectItem[] = [
    {label: 'Select a Month', value: null},
    {label: 'January', value: 1},
    {label: 'February', value: 2},
    {label: 'March', value: 3},
    {label: 'April', value: 4},
    {label: 'May', value: 5},
    {label: 'June', value: 6},
    {label: 'July', value: 7},
    {label: 'August', value: 8},
    {label: 'September', value: 9},
    {label: 'October', value: 10},
    {label: 'November', value: 11},
    {label: 'December', value: 12}
  ];

  submitted: boolean;

  userDialog: boolean;

  isCreationForm: boolean;
  emailProviders: string[];

  constructor(private userRetrievalService: UserlService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.fetchUpdatedUsersInfo();
  }

  openNew(): void {
    this.user = {
      id: null,
      login: '',
      name: '',
      email: '',
      birthDate: new Date()
    };
    this.submitted = false;
    this.isCreationForm = true;
    this.userDialog = true;
  }

  showCreateUserDialog(): void {
    this.user = { id: null, name: '', login: '', email: '', birthDate: null };
    this.isCreationForm = true;
    this.submitted = false;
    this.userDialog = true;
  }

  showEditUserDialog(user: UserViewData): void {
    this.user = { ...user };
    this.isCreationForm = false;
    this.userDialog = true;
  }

  deleteSelectedUsers(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(val => !this.selectedUsers.includes(val));
        this.selectedUsers = null;
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
      }
    });
  }

  editUser(user: UserViewData): void {
    this.user = {...user};
    this.isCreationForm = false;
    this.userDialog = true;
  }

  deleteUser(product: UserViewData): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(val => val.id !== product.id);
        this.user = {
          id: 0,
          login: '',
          name: '',
          email: '',
          birthDate: new Date()
        };
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
      }
    });
  }

  hideDialog(): void {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser(): void {
    this.submitted = true;

    if (this.user.name.trim()) {
      if (this.user.id) {
        this.users[this.findIndexById(this.user.id)] = this.user;
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000});
      }
      else {
        this.user.id = this.createId();
        this.users.push(this.user);
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000});
      }

      this.users = [...this.users];
      this.userDialog = false;
      this.user = {
        id: 0,
        login: '',
        name: '',
        email: '',
        birthDate: new Date()
      };
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): number {
    return Math.random();
  }

  searchById(id: string): void {
    if (id === "0" || id === '') {
      this.userRetrievalService.getUserById(id).subscribe(data => this.users = [data]);
    } else {
      this.userRetrievalService.getUserList().subscribe(data => this.users = data);
    }
  }

  searchByName(name: string): void {
    if (name === '') {
      this.userRetrievalService.getUserList().subscribe(data => this.users = data);
    } else {
      this.userRetrievalService.getUserByName(name).subscribe(data => this.users = data);
    }
  }

  searchByLogin(login: string): void {
    if (login === '') {
      this.userRetrievalService.getUserList().subscribe(data => this.users = data);
    } else {
      this.userRetrievalService.getUserByLogin(login).subscribe(data => this.users = data);
    }
  }

  searchByEmail(email: string): void {
    if (email === '' || email == null) {
      this.userRetrievalService.getUserList().subscribe(data => this.users = data);
    } else {
      this.userRetrievalService.getUserByEmail(email).subscribe(data => this.users = data);
    }
  }

  searchByBirthMonth(month): void {
    if (month == null) {
      this.userRetrievalService.getUserList().subscribe(data => this.users = data);
    } else {
      this.userRetrievalService.getUserListByBirthMonth(month).subscribe(data => this.users = data);
    }
  }

  fetchUsersEmailProviders(): void {
    this.userRetrievalService.getUsersEmailProviders().subscribe(data => {
      this.emailProviders = data.filter(provider => provider != null && provider != undefined);
    });
  }

  fetchUsersList(): void {
    this.userRetrievalService.getUserList().subscribe(data => this.users = data);
  }
  fetchUpdatedUsersInfo(): void {
    this.fetchUsersList();
    this.fetchUsersEmailProviders();
  }
}
