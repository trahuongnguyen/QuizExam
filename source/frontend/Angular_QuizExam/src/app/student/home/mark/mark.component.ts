import { Component, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrl: './mark.component.css'
})
@Injectable()
export class MarkComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {
    const subjects = [
      { name: "EPC", mark: 15, maxMark: 20, rate: "Credit" },
      { name: "HTML5, CSS, JavaScript", mark: 9, maxMark: 20, rate: "Pass" },
      { name: "AngularJS", mark: 4, maxMark: 20, rate: "Re-Exam" },
      { name: "SQL Server", mark: 14, maxMark: 20, rate: "Credit" },
      { name: "PHP", mark: 18, maxMark: 20, rate: "Distinction" },
      { name: "Overall", mark: 0.0, maxMark: 100, rate: "Pass" },
    ];

    const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];

    const tabList = document.getElementById("myTab");
    const tabContent = document.getElementById("myTabContent");

    semesters.forEach((semester, index) => {
      // Create tab
      const tab = document.createElement("li");
      tab.classList.add("nav-item");
      tab.setAttribute("role", "presentation");

      const button = document.createElement("button");
      button.classList.add("nav-link");
      if (index === 0) button.classList.add("active");
      button.id = `sem${index + 1}-tab`;
      button.setAttribute("data-bs-toggle", "tab");
      button.setAttribute("data-bs-target", `#sem${index + 1}`);
      button.setAttribute("type", "button");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", `sem${index + 1}`);
      button.setAttribute("aria-selected", index === 0 ? "true" : "false");
      button.textContent = semester;

      tab.appendChild(button);
      tabList?.appendChild(tab);

      // Create tab content
      const tabPane = document.createElement("div");
      tabPane.classList.add("tab-pane", "fade");
      if (index === 0) tabPane.classList.add("show", "active");
      tabPane.id = `sem${index + 1}`;
      tabPane.setAttribute("role", "tabpanel");
      tabPane.setAttribute("aria-labelledby", `sem${index + 1}-tab`);

      const table = document.createElement("table");
      table.classList.add("table", "table-bordered", "mt-3");

      const thead = document.createElement("thead");
      thead.innerHTML = `
          <tr>
              <th>Subject</th>
              <th>Mark</th>
              <th>Max Mark</th>
              <th>Rate</th>
              <th>Status</th>
          </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      let overallMark = 0;
      subjects.forEach(subject => {
        overallMark += subject.mark;
        const tr = document.createElement("tr");
        tr.innerHTML = `
              <td>${subject.name}</td>
              <td>${subject.mark}</td>
              <td>${subject.maxMark}</td>
              <td>${((subject.mark / subject.maxMark) * 100).toFixed(2)}%</td>
              <td>${subject.rate}</td>
          `;
        tbody.appendChild(tr);
      });


      table.appendChild(tbody);
      tabPane.appendChild(table);
      tabContent?.appendChild(tabPane);
    });
  }
}
  

