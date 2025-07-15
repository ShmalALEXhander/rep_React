import { useState, useRef, useEffect } from "react";
import './App.css';

interface Note {
  id: number;
  title: string;
  content: string;
  data: string;
}// необходим для определения полей составного массива Note   

function NoteTable(){ //функциональный компонент, в котором будет происходить отрисовка (рендеринг) разметки.
//Дано:
//notes есть состояние, в котором хранится Note и это состояние будет менятся посредством использования функции setNote
const [notes, setNote] = useState<Note[]>([]);
const [editNote, setEditNote] = useState<Note | null>(null);
const curr_id = useRef(1);
// Глобальные переменные, которыми являются переменные, находящиеся вне функциональных компонентов, НЕДОПУСТИПЫ в серьёзных проектах.
// По этой причине их помещают в структурные модули. в числе которых useState, useRef/.

//Всё просто: при обработке события "нажатия кнопки" вызывется функция (стоит подумать почему {}), которая является стрелочного типа,
// Создаётся экземпляр заметки, затем обновляется состояние notes путём использования функции setNote , которая копирует прошлое состояние notes и добавляет newNote. 
useEffect(() => {
  fetch('https://localhost:7242/api/todos/completes')
  .then(response => {
    if (!response.ok){
      throw new Error('Ошибка загрузки данных');
    }
    return response.json();
  })
  .then((data: Note[])=>{
    setNote(data);
     const maxId = data.reduce((max, note) => Math.max(max, note.id), 0);
      curr_id.current = maxId + 1;
  })
  .catch(error => {
    console.error('Ошибка при загрузке заметки', error);
  });
},[]);

const add_element = () => {
  const newNote = {
  id: curr_id.current,
  title: `Заметка ${curr_id.current}`,
  content: `Cодержание ${curr_id.current}`,
  data: new Date().toLocaleDateString(),
  };
  fetch('https://localhost:7242/api/todos/completes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при добавлении заметки');
    }
    return response.json();
  })
  .then((createdNote: Note) => {
    setNote(prevNotes => [...prevNotes, createdNote]);
    curr_id.current += 1;
  })
  .catch(error => {
    console.error('Ошибка при добавлении:', error);
  });
}

 const delete_note = (id: number) => {
    setNote(prevNotes => prevNotes.filter(note => note.id !== id));
    // Можно отправить DELETE-запрос на сервер
    fetch(`https://localhost:7242/api/todos/completes/${id}`, {
      method: 'DELETE',
    }).catch(error => console.error('Ошибка удаления:', error));
  };

const edit_note = (note: Note) =>{
  setEditNote(note);
};

const cancel_handle = () => {
  setEditNote(null);
}

const change_handle = ( field: keyof Omit<Note, "id">, value: string) => {
 if(editNote){
  setEditNote({ ...editNote, [field]: value});
 }
}

const save_handle = () => {
  if (!editNote) {
    return;
  }
  
  setNote(
    notes.map((note) =>
      note.id === editNote.id ? editNote : note
    )
  );

  fetch(`https://localhost:7242/api/todos/completes/${editNote.id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editNote),
      }).catch(error => console.error('Ошибка при сохранении:', error));

  setEditNote(null);
}

return( //Все стили перенёс в App.tsx 
  <div>
    <h1>Мои заметки</h1>
    <table className = "table">
      <thead>
      <tr>
      <th>ID</th>
      <th>Заголовок</th>
      <th>Содержание</th>
      <th>Дата</th>
      </tr>
      </thead>
      <tbody>
        {notes.map(note => (
            <tr key={note.id}>
              <td>{note.id}</td>
              <td>{note.title}</td>
              <td>{note.content}</td>
              <td>{note.data}</td>
              <td>
                <button onClick={() => edit_note(note)}>
                  Редактировать
                </button>
              </td>
              <td>
                <button onClick={() => delete_note(note.id)}>
                  Удалить
                </button>
              </td>           
            </tr>
          ))}
      </tbody>
    </table>
    <button id = "addBtn" onClick = {add_element}>
      Добавить элемент
    </button>

{editNote && (
    <div className = "modal-overlay">
      <div className = "modal">
        <h2>Редактировать заметку</h2>

        <div style={{ marginBottom:'10px' }}>
        <label> Заголовок:</label>
        <input
          type = "text"
          value = {editNote.title}
          onChange={(e) => change_handle("title", e.target.value)}
        />
        </div>

        <div style={{ marginBottom:'10px' }}>
        <label> Содержание:</label>
        <input
          type = "text"
          value = {editNote.content}
          onChange={(e) => change_handle("content", e.target.value)}
        />
        </div>
        <div style={{ marginBottom:'10px' }}>
        <label> Дата:</label>
        <input
          type = "text"
          value = {editNote.data}
          onChange={(e) => change_handle("data", e.target.value)}
        />
        </div>

        <div style={{ marginTop:'10px' }}>
          <button onClick = {save_handle}>Подтвердить</button>
          <button onClick = {cancel_handle}>Отмена</button>
        </div>

      </div>
    </div>
  )}
  </div>

);
};
export default NoteTable; // Сделал доступной из всей программы.