import { Component, OnInit } from '@angular/core';
import { UserCreationData, UserUpdateData, UserViewData } from '../../models/user-data.models';
import { UserService } from '../../services/user.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SearchParameters } from '../../models/searchParameters.model';
import { getMonthsSelectItems } from '../../shared/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidatorService } from '../../services/validator-service';

@Component({
  selector: 'app-user-crud-table',
  templateUrl: './user-crud-table.component.html',
  styleUrls: ['./user-crud-table.component.css'],
  providers: [],
})
export class UserCrudTableComponent implements OnInit {

  users: UserViewData[];

  selectedUsers: UserViewData[];

  userToBeEdited: UserUpdateData;

  userToBeCreated: UserCreationData;

  emailProviders: SelectItem[];

  months: SelectItem[] = getMonthsSelectItems();

  userForm: FormGroup;

  submitted: boolean;
  userDialog: boolean;
  isCreationForm: boolean;

  searchParams: SearchParameters;
  searchById: string;
  searchByName: string;
  searchByLogin: string;
  searchByEmail: string;
  searchByBirthMonth: SelectItem;
  searchByEmailProvider: SelectItem;

  constructor(private userService: UserService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private formBuilder: FormBuilder,
              private validatorService: ValidatorService) { }

  ngOnInit(): void {
    this.resetSearchParameters();
    this.createForm();
  }

  createForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[^0-9a-zA-Z ]')]],
      login: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')]]
    });
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return control.touched && control.valid;
  }

  resetSearchParameters(): void {
    this.searchParams = {};
    this.searchById = '';
    this.searchByName = '';
    this.searchByLogin = '';
    this.searchByEmail = '';
    this.searchByBirthMonth = {label: 'Select a Month', value: null};
    this.searchByEmailProvider = {label: 'All Email Providers', value: null};
    this.fetchUpdatedUsersInfo();
  }

  fetchUpdatedUsersInfo(): void {
    this.fetchUsersList();
    this.fetchUsersEmailProviders();
  }

  fetchUsersList(): void {
    this.userService.getUserList(this.searchParams).subscribe(data => this.users = data);
  }

  fetchUsersEmailProviders(): void {
    this.userService.getUsersEmailProviders().subscribe(data => {
      this.emailProviders = data;
      this.emailProviders.push({label: 'All Email Providers', value: null});
    });
  }

  search(): void {
    this.setParameters();
    this.userService.getUserList(this.searchParams).subscribe(data => this.users = data);
  }

  setParameters(): void {
    this.searchParams = {};
    if (this.searchById !== '' && this.searchById !== null) {
      this.searchParams.id = this.searchById;
    }
    if (this.searchByName !== '' && this.searchByName !== null) {
      this.searchParams.name = this.searchByName;
    }
    if (this.searchByLogin !== '' && this.searchByLogin !== null) {
      this.searchParams.login = this.searchByLogin;
    }
    if (this.searchByEmail !== '' && this.searchByEmail !== null) {
      this.searchParams.email = this.searchByEmail;
    }
    if (this.searchByBirthMonth !== null) {
      this.searchParams.birthMonth = this.searchByBirthMonth.value;
    }
    if (this.searchByEmailProvider !== null) {
      this.searchParams.emailProvider = this.searchByEmailProvider.value;
    }
  }

  showCreateUserDialog(): void {
    this.userToBeCreated = {
      login: '',
      name: '',
      email: '',
      password: '',
      birthDate: new Date()
    };
    this.submitted = false;
    this.isCreationForm = true;
    this.userDialog = true;
  }

  showEditUserDialog(user: UserViewData): void {
    this.userToBeEdited = {
      id: user.id,
      login: user.login,
      name: user.name,
      email: user.email,
      password: '',
      birthDate: new Date(user.birthDate)
    };
    this.isCreationForm = false;
    this.userDialog = true;
  }

  deleteUser(user: UserViewData): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.name + '? This action cannot be undone.',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUserById(user.id).subscribe(
          () => {
            this.fetchUpdatedUsersInfo();
            this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000});
          },
          error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
          }
        );
      }
    });
  }

  deleteSelectedUsers(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users? This action cannot be undone.',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUsersById(this.selectedUsers.map(user => user.id)).subscribe(
            () => {
                this.fetchUpdatedUsersInfo();
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000});
            },
            error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
            }
        );
      }
    });
  }

  hideDialog(): void {
    this.userDialog = false;
    this.submitted = false;
  }

  createUser(): void {
    this.submitted = true;
    this.userService.createUser(this.userToBeCreated).subscribe(
      () => {
        this.fetchUpdatedUsersInfo();
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000});
        this.hideDialog();
      }, error => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
      }
    );
  }

  updateUser(): void {
    this.submitted = true;
    this.userService.updateUser(this.userToBeEdited).subscribe(
      () => {
        this.fetchUpdatedUsersInfo();
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000});
        this.hideDialog();
        }, error => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
      }
    );
  }
}
