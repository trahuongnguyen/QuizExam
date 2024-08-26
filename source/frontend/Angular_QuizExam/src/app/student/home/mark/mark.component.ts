import { Component, Inject, Injectable } from '@angular/core';
import { CommonModule, DOCUMENT, NgForOf } from '@angular/common';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrl: './mark.component.css'
})
@Injectable()
export class MarkComponent {
  semesters =["Sem 1", "Sem 2", "Sem 3", "Sem 4"];
  subjects = [
    { name: "EPC", mark: 15, maxMark: 20, rate: 0, status: "Credit" },
    { name: "HTML5, CSS, JavaScript", mark: 9, maxMark: 20, rate: 0, status: "Pass" },
    { name: "AngularJS", mark: 4, maxMark: 20, rate: 0, status: "Re-Exam" },
    { name: "SQL Server", mark: 14, maxMark: 20, rate: 0, status: "Credit" },
    { name: "PHP", mark: 18, maxMark: 20, rate: 0, status: "Distinction" },
    { name: "Overall", mark: 0.0, maxMark: 100, rate: 0, status: "Pass" },
  ];

  subjectNames = [
    "EPC",
    "HTML5, CSS, JavaScript",
    "AngularJS",
    "SQL Server",
    "PHP"
  ];

  getOverall(index:number):number { 
    let sum = 0;
    let total = 0;
    for (let i = 0; i < index; i++) {
      sum += this.subjects[i].mark;
      total += ((this.subjects[i].mark / this.subjects[i].maxMark) * 100);
    }
    return index < this.subjects.length-1 ? ((this.subjects[index].mark / this.subjects[index].maxMark) * 100):total/index; 
  }
  // constructor(@Inject(DOCUMENT) private document: Document) {
  //   const marks = [
  //     { name: "EPC", mark: 15, maxMark: 20, rate: 0, status: "Credit" },
  //     { name: "HTML5, CSS, JavaScript", mark: 9, maxMark: 20, rate: 0, status: "Pass" },
  //     { name: "AngularJS", mark: 4, maxMark: 20, rate: 0, status: "Re-Exam" },
  //     { name: "SQL Server", mark: 14, maxMark: 20, rate: 0, status: "Credit" },
  //     { name: "PHP", mark: 18, maxMark: 20, rate: 0, status: "Distinction" },
  //     { name: "Overall", mark: 0.0, maxMark: 100, rate: 0, status: "Pass" },
  //   ];

  //    semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];

  //   const tabList = document.getElementById("myTab");
  //   const tabContent = document.getElementById("myTabContent");

  //   semesters.forEach((semester, index) => {
  //     // Create tab
  //     const tab = document.createElement("li");
  //     tab.classList.add("nav-item");
  //     tab.setAttribute("role", "presentation");

  //     const button = document.createElement("button");
  //     button.classList.add("nav-link");
  //     if (index === 0) button.classList.add("active");
  //     button.id = `sem${index + 1}-tab`;
  //     button.setAttribute("data-bs-toggle", "tab");
  //     button.setAttribute("data-bs-target", `#sem${index + 1}`);
  //     button.setAttribute("type", "button");
  //     button.setAttribute("role", "tab");
  //     button.setAttribute("aria-controls", `sem${index + 1}`);
  //     button.setAttribute("aria-selected", index === 0 ? "true" : "false");
  //     button.textContent = semester;

  //     tab.appendChild(button);
  //     tabList?.appendChild(tab);

  //     // Create tab content
  //     const tabPane = document.createElement("div");
  //     tabPane.classList.add("tab-pane", "fade");
  //     if (index === 0) tabPane.classList.add("show", "active");
  //     tabPane.id = `sem${index + 1}`;
  //     tabPane.setAttribute("role", "tabpanel");
  //     tabPane.setAttribute("aria-labelledby", `sem${index + 1}-tab`);

  //     const table = document.createElement("table");
  //     table.classList.add("table", "table-bordered", "mt-3");

  //     const thead = document.createElement("thead");
  //     thead.innerHTML = `
  //         <tr>
  //             <th>Subject</th>
  //             <th>Mark</th>
  //             <th>Max Mark</th>
  //             <th>Rate</th>
  //             <th>Status</th>
  //         </tr>
  //     `;
  //     table.appendChild(thead);

  //     const tbody = document.createElement("tbody");

  //     let overallMark = 0;
  //     let overallRate = 0;
  //     let i = 0;
  //     subjects.forEach(subject => {
  //       i++;
  //       overallMark += subject.mark;
  //       subject.rate = ((subject.mark / subject.maxMark) * 100);
  //       overallRate += subject.rate / (subjects.length - 1);
  //       const tr = document.createElement("tr");
  //       tr.innerHTML = `
  //             <td>${subject.name}</td>
  //             <td>${subject.mark}</td>
  //             <td>${subject.maxMark}</td>
  //             <td>${(i < subjects.length) ? subject.rate.toFixed(2) : overallRate.toFixed(2)}%</td>
  //             <td>${subject.status}</td>
  //         `;
  //       tbody.appendChild(tr);
  //     });


  //     table.appendChild(tbody);
  //     tabPane.appendChild(table);
  //     tabContent?.appendChild(tabPane);
  //   });
  // }
}


