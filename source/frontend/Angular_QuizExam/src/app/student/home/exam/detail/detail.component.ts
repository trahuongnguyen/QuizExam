import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  selectedExam: any;
  questions: any[] = []; // Mảng câu hỏi với thông tin về trạng thái hoàn thành

  ngOnInit(): void {
    // Giả lập dữ liệu câu hỏi. Bạn có thể thay thế bằng API thực tế.
    this.questions = [
      { id: 1, question: 'Câu hỏi 1', answers: ['A', 'B', 'C'], completed: false },
      { id: 2, question: 'Câu hỏi 2', answers: ['A', 'B', 'C'], completed: false },
      { id: 3, question: 'Câu hỏi 3', answers: ['A', 'B', 'C'], completed: false },
      // Tiếp tục với các câu hỏi khác...
    ];
  }

  goToQuestion(questionNumber: number): void {
    // Xử lý logic khi người dùng nhấn vào ô để chuyển đến câu hỏi
    console.log('Navigating to question:', questionNumber);

    // Hiển thị câu hỏi tương ứng
    const currentQuestion = document.getElementById(`question-${questionNumber}`);
    if (currentQuestion) {
      currentQuestion.classList.add('active');
    }
  }

  markQuestionCompleted(questionId: number): void {
    // Đánh dấu câu hỏi đã hoàn thành
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.completed = true;
    }
  }
}
