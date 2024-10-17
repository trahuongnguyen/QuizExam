import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
declare var $: any;

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, public home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) { }

  dataTable: any;

  listClass: any;
  listStudent: any;
  listStudentByClass: any;

  examId: number = 0;
  subjectId: number = 0;
  listStudentSelected: any = [];

  ngOnInit(): void {
    this.examId = Number(this.activatedRoute.snapshot.params['examId']) ?? 0;
    this.subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) ?? 0;

    this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions).subscribe(response => {
      this.listClass = response;
    });

    this.http.get<any>(`${this.authService.apiUrl}/studentManagement`, this.home.httpOptions).subscribe(response => {
      this.listStudentByClass = response;
    });

    this.http.get<any>(`${this.authService.apiUrl}/studentManagement/all-student`, this.home.httpOptions).subscribe(response => {
      this.listStudent = response;
    });

    this.initializeDataTable();
  }

  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: this.listStudentSelected,
      autoWidth: false,
      lengthChange: false,
      searching: false,
      info: false, // Xóa dòng chữ Showing 1 to 10 of 22 entries
      columns: [
        {
          title: 'STT',
          data: null, // Không cần dữ liệu từ nguồn API
          render: (data: any, type: any, row: any, meta: any) => {
            return meta.row + 1; // Trả về số thứ tự, `meta.row` là chỉ số của hàng bắt đầu từ 0
          }
        },
        { title: 'Roll Number', data: 'rollNumber' },
        { title: 'Roll Portal', data: 'rollPortal' },
        { title: 'Full Name', data: 'userResponse.fullName' },
        { title: 'Phone Number', data: 'userResponse.phoneNumber' }
      ],
    });
  }

  isStudentPopup = false;
  classes: any;
  classId: number = 0;

  studentIds: number[] = [];

  showStudentPopup(): void {
    this.isStudentPopup = true;
  }

  filterStudentsByClass(): void {
    if (this.classId == 0) {
      this.http.get<any>(`${this.authService.apiUrl}/studentManagement`, this.home.httpOptions).subscribe(response => {
        this.listStudentByClass = response;
      });
    }
    else {
      this.http.get<any>(`${this.authService.apiUrl}/studentManagement/${this.classId}`, this.home.httpOptions).subscribe(response => {
        this.listStudentByClass = response;
      });
    }
  }

  handleCheckboxChange(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox) {
      const isChecked = checkbox.checked; // Truy cập thuộc tính checked.

      if (isChecked) {
          if (!this.studentIds.includes(id)) { // Kiểm tra xem id có nằm trong mảng studentIds hay không.
              this.studentIds.push(id); // Nếu không có thì thêm vào mảng.
          }
      }
      else {
          const index = this.studentIds.indexOf(id); // Tìm vị trí index của id.
          if (index > -1) {
              this.studentIds.splice(index, 1); // Nếu điều kiện trên là đúng, câu lệnh này sẽ xóa phần tử.
          }
      }
      this.updateDataTable();
    }
    console.log(this.studentIds);
  }

  isChecked(id: number): boolean {
    return this.studentIds.includes(id);
  }

  selectAllStatus: { [key: number]: boolean } = {};

  toggleSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
        // Nếu chọn "Select All", thêm tất cả sinh viên của lớp vào studentIds
        this.listStudentByClass.forEach((student: any) => {
            if (!this.studentIds.includes(student.userResponse.id)) {
                this.studentIds.push(student.userResponse.id);
            }
        });
    }
    else {
        // Nếu bỏ chọn "Select All", xóa tất cả sinh viên của lớp khỏi studentIds
        this.listStudentByClass.forEach((student: any) => {
            const index = this.studentIds.indexOf(student.userResponse.id);
            if (index > -1) {
                this.studentIds.splice(index, 1);
            }
        });
    }

    this.selectAllStatus[this.classId] = isChecked; // Lưu trạng thái cho lớp hiện tại

    console.log(this.studentIds);
    this.updateDataTable(); // Cập nhật DataTable
  }

  updateDataTable(): void {
    // Lọc danh sách sinh viên theo studentIds
    this.listStudentSelected = this.listStudent.filter((student: any) => this.studentIds.includes(student.userResponse.id));
    // Cập nhật DataTable với danh sách sinh viên đã lọc
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.listStudentSelected);
      this.dataTable.draw();
    }
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isStudentPopup = false;
  }

  addStudentInExam(): void {
    if (this.listStudentSelected.length > 0) {
      this.http.put(`${this.authService.apiUrl}/exam/student/${this.examId}/${this.subjectId}`, this.studentIds, this.home.httpOptions).subscribe(
        response => {
          this.toastr.success('Add Student in Exam Successful!', 'Success', {
            timeOut: 2000,
          });
          this.router.navigate(['/admin/home/exam/detail/' + this.examId]);
        },
        error => {
          this.toastr.error('Error', 'Error', {
            timeOut: 2000,
          });
          console.log('Error', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}