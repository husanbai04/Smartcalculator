const subjectsDiv = document.getElementById('subjects');
document.getElementById('addSubjectBtn').addEventListener('click', addSubject);

// Пересчёт итогов по предмету
function recalcSubject(subject) {
  const weeks = subject.querySelectorAll('tbody input.week');
  const exam  = subject.querySelector('tfoot input.exam');
  const p1Out = subject.querySelector('.p1-common');
  const p2Out = subject.querySelector('.p2-common');
  const rdOut = subject.querySelector('.rd-common');
  const totOut= subject.querySelector('.tot-common');

  let sum1 = 0, cnt1 = 0, sum2 = 0, cnt2 = 0;
  weeks.forEach(inp => {
    const v = parseFloat(inp.value);
    if (!isNaN(v)) {
      const w = +inp.dataset.week;
      if (w <= 7)  { sum1 += v; cnt1++; }
      else         { sum2 += v; cnt2++; }
    }
  });

  const p1 = cnt1 > 0 ? (sum1 / (cnt1 * 100) * 30) : null;
  const p2 = cnt2 > 0 ? (sum2 / (cnt2 * 100) * 30) : null;
  const rd = (p1 || 0) + (p2 || 0);

  // Экзамен вводится как баллы (0–40)
  let ex = parseFloat(exam.value);
  if (isNaN(ex)) ex = null;
  else if (ex > 40) ex = 40;
  else if (ex < 0) ex = 0;

  const tot = ex !== null ? rd + ex : null;

  p1Out.textContent  = p1 !== null  ? Math.round(p1)  : 'н.п.';
  p2Out.textContent  = p2 !== null  ? Math.round(p2)  : 'н.п.';
  rdOut.textContent  = (cnt1||cnt2) ? Math.round(rd) : 'н.п.';
  totOut.textContent = tot !== null  ? Math.round(tot) : 'н.п.';
}

// Добавление строки «вид занятия»
function addTypeRow(tbody, subject) {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td><input type="text" class="type-name" placeholder="Л / ЛЗ / СРСП"></td>` +
    [...Array(15)].map((_, i) =>
      `<td><input type="number" class="week" data-week="${i+1}" min="0" max="100" placeholder="н.п."></td>`
    ).join('');
  tbody.appendChild(tr);
  tr.querySelectorAll('input.week').forEach(inp =>
    inp.addEventListener('input', () => recalcSubject(subject))
  );
}

// Добавление блока «предмет»
function addSubject() {
  const div = document.createElement('div');
  div.classList.add('subject');
  div.innerHTML = `
    <div class="subject-header">
      <input type="text" placeholder="Название дисциплины">
      <button class="addTypeBtn">Добавить вид занятия</button>
    </div>
    <table class="subject-table">
      <thead>
        <tr>
          <th>Вид занятия</th>
          ${[...Array(15)].map((_,i)=>`<th>${i+1}</th>`).join('')}
          <th>P1<br>(30)</th>
          <th>P2<br>(30)</th>
          <th>RD<br>(60)</th>
          <th>Экз.<br>(40)</th>
          <th>Итог<br>(100)</th>
        </tr>
      </thead>
      <tbody></tbody>
      <tfoot>
        <tr>
          <td><b>Итоги</b></td>
          <!-- пустые ячейки для недель 1–7 -->
          ${[...Array(7)].map(()=>`<td></td>`).join('')}
          <!-- общая P1 -->
          <td class="readonly p1-common">н.п.</td>
          <!-- пустые ячейки для недель 8–15 -->
          ${[...Array(8)].map(()=>`<td></td>`).join('')}
          <!-- общая P2, RD, Экз., Итог -->
          <td class="readonly p2-common">н.п.</td>
          <td class="readonly rd-common">н.п.</td>
          <td><input type="number" class="exam" min="0" max="40" placeholder="н.п."></td>
          <td class="readonly tot-common">н.п.</td>
        </tr>
      </tfoot>
    </table>
  `;
  subjectsDiv.appendChild(div);

  const tbody  = div.querySelector('tbody');
  const addBtn = div.querySelector('.addTypeBtn');
  const examIn = div.querySelector('tfoot input.exam');

  // создаём три вида занятий
  ['Л','ЛЗ','СРСП'].forEach(label => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input type="text" class="type-name" value="${label}"></td>` +
      [...Array(15)].map((_,i)=>
        `<td><input type="number" class="week" data-week="${i+1}" min="0" max="100" placeholder="н.п."></td>`
      ).join('');
    tbody.appendChild(tr);
    tr.querySelectorAll('input.week').forEach(inp =>
      inp.addEventListener('input', () => recalcSubject(div))
    );
  });

  // слушаем экзамен и стартовый пересчёт
  examIn.addEventListener('input', () => recalcSubject(div));
  recalcSubject(div);
}