let Notes = new Array;// Массив заміток

// Додавання замітки
function addNote() {
    let newNote = {
        id: generateID(),
        name: '',
        body: '',
        date: newDate(),
        selected: true,
    }
    unselectNote();
    Notes.unshift(newNote);
    unlockInputs();
    let noteName = document.createElement('p');
    let noteText = document.createElement('p');
    let noteDate = document.createElement('p');
    noteName.id = 'note-name-preview';
    noteText.id = 'note-text-preview';
    noteDate.id = 'note-date';
    noteDate.textContent = newNote.date;
    let nElement = document.createElement('li');
    nElement.classList.add('note-chosen', 'note-single');
    nElement.id = newNote.id;
    nElement.appendChild(noteName);
    nElement.appendChild(noteText);
    nElement.appendChild(noteDate);
    document.querySelector('.note-list').insertBefore(nElement, document.querySelector('.note-list').firstChild);
    document.getElementById('note-name').value = '';
    document.getElementById('note-text').value = '';
    location.hash = newNote.id;
    localStorage.setItem('storedNotes', JSON.stringify(Notes));
}

// Сортування
function Sort() {
    for (let i = 0; i < Notes.length; i++) {
        if (Notes[i].selected === true) {
            let temp1 = Notes[i];
            Notes.splice(i, 1);
            Notes.unshift(temp1);
            let temp2 = document.querySelector('.note-chosen');
            document.querySelector('.note-list').removeChild(document.querySelector('.note-list').children[i]);
            document.querySelector('.note-list').insertBefore(temp2, document.querySelector('.note-list').firstChild);
            break;
        }
    }
}

// Убрать выделение с текущей заметки
function unselectNote() {
    let chosenNote = document.querySelector('.note-chosen');
    if (chosenNote != null) {
        chosenNote.classList.remove('note-chosen');
    }
    for (let i = 0; i < Notes.length; i++) {
        if (Notes[i].selected) {
            Notes[i].selected = false;
            break;
        }
    }
}


// Дата
function newDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return day + '.' + month + '.' + date.getFullYear() + ' ' + hours + ':' + minutes;
}

// Редагування імені замітки
document.getElementById('note-name').oninput = () => {
    if (Notes[0].selected === false) {
        Sort();
    }
    document.querySelector('.note-chosen').children[0].textContent = document.getElementById('note-name').value;
    document.querySelector('.note-chosen').children[2].textContent = newDate();
}

// Редагування тексту замітки
document.getElementById('note-text').oninput = () => {
    if (Notes[0].selected === false) {
        Sort();
    }
    document.querySelector('.note-chosen').children[1].textContent = document.getElementById('note-text').value;
    document.querySelector('.note-chosen').children[2].textContent = newDate();
}

// Запис в LocalStorage з втратою таргету на імені
document.getElementById('note-name').onchange = () => {
    for (let i = 0; i < Notes.length; i++) {
        if (Notes[i].selected === true) {
            Notes[i].name = document.getElementById('note-name').value;
            Notes[i].date = document.querySelector('.note-chosen').children[2].textContent;
            break;
        }
    }
    localStorage.setItem('storedNotes', JSON.stringify(Notes));
}

// Запись в LocalStorage з втратою таргету на тексті
document.getElementById('note-text').onchange = () => {
    for (let i = 0; i < Notes.length; i++) {
        if (Notes[i].selected === true) {
            Notes[i].body = document.getElementById('note-text').value;
            Notes[i].date = document.querySelector('.note-chosen').children[2].textContent;
            break;
        }
    }
    localStorage.setItem('storedNotes', JSON.stringify(Notes));
}
// Запис в LocalStorage перед закритям сторінки
window.onbeforeunload = () => {
    for (let i = 0; i < Notes.length; i++) {
        if (Notes[i].selected === true) {
            Notes[i].name = document.getElementById('note-name').value;
            Notes[i].body = document.getElementById('note-text').value;
            Notes[i].date = document.querySelector('.note-chosen').children[2].textContent;
            break;
        }
    }
    unselectNote();
    localStorage.setItem('storedNotes', JSON.stringify(Notes));
}

// Вибір замітки
document.querySelector('.note-list').onclick = function(event) {
    let target;
    if (event.target.tagName === 'UL') {
        return;
    }
    if (event.target.tagName != 'LI') {
        target = event.target.parentNode;
    } else {
        target = event.target;
    }
    unselectNote();

    let selectedNote;
    for (let i = 0; i < Notes.length; i++) {
        if (target.id === Notes[i].id) {
            selectedNote = Notes[i];
            break;
        }
    }
    target.classList.remove('note-single');
    target.classList.add('note-chosen', 'note-single');
    document.getElementById('note-name').value = selectedNote.name;
    document.getElementById('note-text').value = selectedNote.body;
    selectedNote.selected = true;
    location.hash = selectedNote.id;
    unlockInputs();
}



// Генерація унікального ID
function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}





// Загрузка з LocalStorage при запуску сторінки
window.onload = () => {
    document.getElementById('note-name').value = '';
    document.getElementById('note-text').value = '';
    if (JSON.parse(localStorage.getItem('storedNotes')) === null) {
        return;
    }
    Notes = JSON.parse(localStorage.getItem('storedNotes'));
    for (let i = 0; i < Notes.length; i++) {
        let notesName = document.createElement('p');
        let notesText = document.createElement('p');
        let notesDate = document.createElement('p');
        notesName.id = 'note-name-preview';
        notesText.id = 'note-text-preview';
        notesDate.id = 'note-date';
        notesName.textContent = Notes[i].name;
        notesText.textContent = Notes[i].body;
        notesDate.textContent = Notes[i].date;
        let nElement = document.createElement('li');
        nElement.classList.add('note-single');
        nElement.id = Notes[i].id;
        nElement.appendChild(notesName);
        nElement.appendChild(notesText);
        nElement.appendChild(notesDate);
        document.querySelector('.note-list').appendChild(nElement);
    }

    if (location.hash != '') {
        let temp;
        for (let i = 0; i < Notes.length; i++) {
            if (location.hash === '#' + Notes[i].id) {
                temp = true;
                let lastNote = document.getElementById(Notes[i].id);
                lastNote.classList.remove('note-single');
                lastNote.classList.add('note-chosen', 'note-single');
                Notes[i].selected = true;
                document.getElementById('note-name').value = Notes[i].name;
                document.getElementById('note-text').value = Notes[i].body;
                break;
            }
        }
        if (!temp) {
            location.hash = '';
        }
    }
}

// Видалення замітки
function deleteNote() {
    let selectNote = document.querySelector('.note-chosen');
    for (let i = 0; i < Notes.length; i++) {
        if (selectNote.id === Notes[i].id) {
            Notes.splice(i, 1);
            document.querySelector('.note-list').removeChild(document.querySelector('.note-list').children[i]);
            break;
        }
    }
    document.getElementById('note-name').value = '';
    document.getElementById('note-text').value = '';
    location.hash = '';
    lockInputs();
    localStorage.setItem('storedNotes', JSON.stringify(Notes));
}

// Блокування введення
function lockInputs() {
    document.getElementById('note-name').disabled = true;
    document.getElementById('delete-note').disabled = true;
    document.getElementById('note-text').disabled = true;
}

// Розблокування введення
function unlockInputs() {
    document.getElementById('note-name').disabled = false;
    document.getElementById('delete-note').disabled = false;
    document.getElementById('note-text').disabled = false;
}

window.addEventListener('hashchange', () => {
    for (let i = 0; i < Notes.length; i++) {
        if (location.hash === '#' + Notes[i].id) {
            let Note = document.getElementById(Notes[i].id);
            unselectNote();
            Note.classList.remove('note-single');
            Note.classList.add('note-chosen', 'note-single');
            Notes[i].selected = true;
            document.getElementById('note-name').value = Notes[i].name;
            document.getElementById('note-text').value = Notes[i].body;
            unlockInputs();
            return;
        }
    }
    location.hash = '';
    lockInputs();
    document.getElementById('note-name').value = '';
    document.getElementById('note-text').value = '';
    unselectNote();
})