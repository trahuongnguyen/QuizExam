import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
declare var $: any;

interface Answer {
  type: 'radio' | 'checkbox';
  text: string;
}

interface QuestionForm {
  answers: Answer[];
  type: 'Single' | 'Multi';
  imageSelected?: boolean;
  // thêm các thuộc tính khác nếu cần
}

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})

export class QuestionFormComponent {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) { }

  subjects = ['C'];
  chapters = ['Choose Chapter'];
  levels = ['Easy', 'Hard'];
  types = ['Single', 'Multi'];
  questionForms: QuestionForm[] = [
    {
      answers: [
        { text: '', type: 'radio' },
        { text: '', type: 'radio' },
        { text: '', type: 'radio' },
        { text: '', type: 'radio' }
      ],
      type: 'Single' // Khởi tạo với giá trị mặc định
    }
  ];

  addQuestionForm() {
    this.questionForms.push({
      answers: [
        { text: '', type: 'radio' },
        { text: '', type: 'radio' },
        { text: '', type: 'radio' },
        { text: '', type: 'radio' }
      ],
      type: 'Single' // Hoặc 'Multi', tùy thuộc vào mặc định bạn muốn
    });
  }

  removeQuestionForm(index: number) {
    if (this.questionForms.length > 1) {
      this.questionForms.splice(index, 1);
    } else {
      alert("At least one question must remain.");
    }
  }

  addAnswer(index: number) {
    const currentType = this.questionForms[index].type; // Lấy kiểu hiện tại của câu hỏi
    const newType = currentType === 'Multi' ? 'checkbox' : 'radio'; // Xác định kiểu mới cho câu trả lời
    console.log(currentType + " - " + newType);
    this.questionForms[index].answers.push({ text: '', type: newType }); // Thêm câu trả lời với kiểu đã xác định
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.questionForms[questionIndex].answers.splice(answerIndex, 1);
  }

  toggleAnswerType(questionIndex: number, event: Event) {
    const target = event.target as HTMLSelectElement; // Ép kiểu thành HTMLSelectElement
    const type = target.value as 'Single' | 'Multi'; // Ép kiểu giá trị về 'Single' hoặc 'Multi'

    this.questionForms[questionIndex].type = type; // Gán giá trị đã ép kiểu
    console.log(type); // Kiểm tra mảng questionForms

    const answers: Answer[] = this.questionForms[questionIndex].answers;
    answers.forEach((answer: Answer) => {
      answer.type = type === 'Multi' ? 'checkbox' : 'radio';
    });
  }

  previewImage(event: Event, questionIndex: number) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const imgPreview = document.getElementById(`imagePreview${questionIndex}`) as HTMLImageElement;
        imgPreview.src = loadEvent.target?.result as string;
        imgPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
      console.log(file.name);

      // Đánh dấu là đã chọn ảnh
      this.questionForms[questionIndex].imageSelected = true;
    }
  }
}