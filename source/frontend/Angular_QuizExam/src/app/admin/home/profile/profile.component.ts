import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../admin.component';
import { Role } from '../../../shared/models/role.model';
import { UserResponse, UserRequest } from '../../../shared/models/user.model';
import { ChangePassword, ValidationError } from '../../../shared/models/models';
import { EmployeeService } from '../../service/employee/employee.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './../../../shared/styles/admin/style.css',
    './profile.component.css'
  ]
})
export class ProfileComponent implements OnInit {
  role: Role;
  profile: UserResponse;
  profileForm: UserRequest = { };
  changePasswordForm: ChangePassword = { };
  formError: ValidationError = { };

  isViewInfo: boolean = true;
  isEditMode: boolean = false;
  isChangePasswordMode: boolean = false;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.role = {
      id: 0,
      name: '',
      description: ''
    };

    this.profile = {
      id: 0,
      fullName: '',
      dob: new Date(),
      gender: 0,
      address: '',
      phoneNumber: '',
      email: '',
      role: this.role
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Profile');
    this.loadData();
  }

  loadData(): void {
    this.authService.getProfile().subscribe({
      next: (profileResponse) => {
        this.profile = (profileResponse as UserResponse);
      },
      error: (err) => {
        this.authService.handleError(err, undefined, '', 'load data');
      }
    });
  }

  convertDateFormat(dateObj: Date | undefined): string {
    // Dùng DatePipe để chuyển đổi đối tượng Date sang định dạng 'yyyy-MM-dd'
    return this.datePipe.transform(dateObj, 'dd-MM-yyyy')!;
  }

  convertToRequest(): void {
    this.profileForm.fullName = this.profile.fullName;
    this.profileForm.dob = this.profile.dob;
    this.profileForm.gender = this.profile.gender;
    this.profileForm.address = this.profile.address;
    this.profileForm.phoneNumber = this.profile.phoneNumber;
    this.profileForm.email = this.profile.email;
    this.profileForm.roleId = this.profile.role?.id;
  }

  showInformation() {
    this.loadData();
    this.isViewInfo = true;
    this.isEditMode = false;
    this.isChangePasswordMode = false;
  }

  showEditForm() {
    this.convertToRequest();
    this.formError = { };
    this.isViewInfo = false;
    this.isEditMode = true;
    this.isChangePasswordMode = false;
  }

  showPasswordForm() {
    this.changePasswordForm = { };
    this.formError = { };
    this.isViewInfo = false;
    this.isEditMode = false;
    this.isChangePasswordMode = true;
  }

  togglePasswordVisibility(inputId: string, iconId: string) {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    const iconElement = document.getElementById(iconId) as HTMLElement;

    if (inputElement.type === "password") {
      inputElement.type = "text";  // Đổi từ password thành text
      iconElement.classList.remove("fa-eye-slash");
      iconElement.classList.add("fa-eye");  // Đổi icon thành "eye"
    } else {
      inputElement.type = "password";  // Đổi lại thành password
      iconElement.classList.remove("fa-eye");
      iconElement.classList.add("fa-eye-slash");  // Đổi icon thành "eye-slash"
    }
  }

  updateProfile() {
    this.formError = { };
    this.employeeService.updateEmployee(this.profile.id, this.profileForm).subscribe({
      next: () => {
        this.toastr.success(`Updated successfully!`, 'Success', { timeOut: 3000 });
        this.showInformation();
      },
      error: (err) => {
        this.authService.handleError(err, this.formError, '', 'update');
      }
    });
  }

  chagePassword() {
    this.formError = { };
    this.authService.changePassword(this.changePasswordForm).subscribe({
      next: () => {
        this.toastr.success(`Change password successfully!`, 'Success', { timeOut: 3000 });
        this.showInformation();
      },
      error: (err) => {
        this.authService.handleError(err, this.formError, '', 'update');
      }
    });
  }
}