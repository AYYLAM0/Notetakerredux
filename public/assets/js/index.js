let noteTitle;
let noteText;
let saveNoteButton;
let newNoteButton;
let allNotes;



if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteButton = document.querySelector('.save-note');
  newNoteButton = document.querySelector('.new-note');
  allNotes = document.querySelectorAll('.list-container .list-group');
}

// Show element
const show = (elem) => {
  elem.style.display = 'inline';
};

//hide element
const hide = (elem) => {
  elem.style.display = 'none';
};

//allowing current notes state to be saved as active
let currentNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
//removing notes from db
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const rendercurrentNote = () => {
  hide(saveNoteButton);

  if (currentNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = currentNote.title;
    noteText.value = currentNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    rendercurrentNote();
  });
};

// Sets the currentNote and displays it
const displayCurrentNote = (e) => {
  e.preventDefault();
  currentNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  rendercurrentNote();
};

//allows new note to be made
const handleNewNoteView = (e) => {
  currentNote = {};
  rendercurrentNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteButton);
  } else {
    show(saveNoteButton);
  }
};
//givers titles of noites
const renderallNotes = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    allNotes.forEach((el) => (el.innerHTML = ''));
  }

  let allNotesItems = [];

  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', displayCurrentNote);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'float-right',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    allNotesItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    allNotesItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    allNotesItems.forEach((note) => allNotes[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderallNotes);

if (window.location.pathname === '/notes') {
  saveNoteButton.addEventListener('click', handleNoteSave);
  newNoteButton.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
