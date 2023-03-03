import { Component, OnInit } from '@angular/core';
import { UserCreationData, UserUpdateData, UserViewData } from '../../models/user-data.models';
import { UserService } from '../../services/user.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SearchParameters } from '../../models/searchParameters.model';
import { getMonthsSelectItems, passwordMatchingValidatior } from '../../shared/utils';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidatorService } from '../../services/validator-service';

@Component({
  selector: 'app-user-crud-table',
  templateUrl: './user-crud-table.component.html',
  styleUrls: ['./user-crud-table.component.css'],
  providers: []
})
export class UserCrudTableComponent implements OnInit {

  users: UserViewData[];

  selectedUsers: UserViewData[];

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
      id: [0],
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      login: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        ValidatorService.loginUniqueValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.minLength(5)
      ]],
      birthDate: [new Date(), [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$]/)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$%&*]/)
      ]]
    },
      { validators: passwordMatchingValidatior }
  );
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
    this.clearForm();
    this.submitted = false;
    this.isCreationForm = true;
    this.userDialog = true;
  }

  showEditUserDialog(user: UserViewData): void {
    this.setFormDataToUser(user);
    this.submitted = false;
    this.isCreationForm = false;
    this.userDialog = true;
  }

  clearForm(): void {
    this.userForm.reset();
  }

  setFormDataToUser(user: UserViewData): void {
    this.userForm.patchValue(
      {
        id: user.id,
        login: user.login,
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
        birthDate: user.birthDate
      }
    );
  }

  getUserCreationData(): UserCreationData {
    return {
      login: this.userForm.get('login').value,
      name: this.userForm.get('name').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
      birthDate: this.userForm.get('birthDate').value
    };
  }

  getUserUpdateData(): UserUpdateData {
    return {
      id: this.userForm.get('id').value,
      login: this.userForm.get('login').value,
      name: this.userForm.get('name').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
      birthDate: this.userForm.get('birthDate').value
    };
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
    this.userService.createUser(this.getUserCreationData()).subscribe(
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
    this.userService.updateUser(this.getUserUpdateData()).subscribe(
      () => {
        this.fetchUpdatedUsersInfo();
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000});
        this.hideDialog();
      }, error => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
      }
    );
  }

  onSubmit(): void {
    if (this.isCreationForm) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }
}
