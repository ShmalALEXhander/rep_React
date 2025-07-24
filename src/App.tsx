import './App.css'
import { useState, useRef, useEffect } from 'react';

interface Note {
  id: number;
  title?: string;
  content?: string;
  data?: string;
  isEdit?: boolean;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const curr_id = useRef(1);
  const origNote = useRef<Note | null>(null); // Храним оригинал здесь

  useEffect(() => {
  fetch('https://localhost:7242/api/todos/completes', {  
    method: 'GET',  
  })
  .then(response => {
    if (!response.ok){
      throw new Error('Ошибка загрузки данных' + response.status);
    }
    return response.json();
  })
  .then((data: Note[])=>{
    setNotes(data);
     const maxId = data.reduce((max, note) => Math.max(max, note.id), 0);
      curr_id.current = maxId + 1;
  })
  .catch(error => {
    console.error('Ошибка при загрузке заметки', error);
  });
}, []);

  const addElement = () => {
    const newNote = {
      id: curr_id.current,
      title: `Заметка ${curr_id.current}`,
      content: `Содержание ${curr_id.current}`,
      data: new Date().toLocaleDateString(),
      isEdit: false,
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
        setNotes(prev => [...prev, { ...createdNote, isEdit: false }]);
        curr_id.current += 1;
      })
      .catch(error => {
        console.error('Ошибка при добавлении:', error);     
      });
  };


  const deleteNote = (id: number) => {
   fetch(`https://localhost:7242/api/todos/completes/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при удалении');
        }
        setNotes(prev => prev.filter(n => n.id !== id));
      })
      .catch(error => console.error('Ошибка удаления:', error));
  };

  const editNote = (note: Note) => {
    origNote.current = { ...note }; // Запоминаем оригинал перед редактированием
    setNotes(notes.map(n => n.id === note.id ? { ...n, isEdit: true } : { ...n, isEdit: false }
    ));
  };

  const saveHandle = (note: Note) => {
    setNotes(prev => prev.map(n => (n.id === note.id ? { ...note, isEdit: false }  : n))
    );
    fetch(`https://localhost:7242/api/todos/completes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
      .then(response => {
        if (response.status === 204){
          return null;
        }
        else if (!response.ok){
          throw new Error('Ошибка при сохранении');
        }
        return response.json();
      })
      .then(updatedData => {
      if (updatedData) {
        // Если сервер возвращает обновленные данные, можно их применить
        setNotes(prev => prev.map(n => (n.id === updatedData.id ? updatedData : n)));
      }
    })
      .catch(error => {
        console.error('Ошибка при сохранении:', error);
      });

    origNote.current = null;
  };

  const cancelHandle = (noteId: number) => {
    if (origNote.current && origNote.current.id === noteId) {
      setNotes(notes.map(n =>  n.id === noteId ? { ...origNote.current!, isEdit: false } : n));
    } else {
      setNotes(notes.map(n => n.id === noteId ? { ...n, isEdit: false } : n));
    }
    origNote.current = null;
  };

  const changeHandle = (id: number, field: keyof Note, value: string) => {
    setNotes(notes.map(n => n.id === id  ? { ...n, [field]: value } : n
    ));
  };

  const isEditing = notes.some(note => note.isEdit);

  return (
    <div className="container">
      <h1>Мои заметки</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Заголовок</th>
            <th>Содержание</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id} className={note.isEdit ? "editing-row" : ""}>
              <td>{note.id}</td>
              <td>
                {note.isEdit ? (
                  <input
                    id = {`title-${note.id}`}
                    name = "title"
                    value = {note.title}
                    onChange = {(e) => changeHandle(note.id, 'title', e.target.value)}
                  />
                ) : (
                  note.title
                )}
              </td>
              <td>
                {note.isEdit ? (
                  <input
                    id = {`content-${note.id}`}
                    name = "content"
                    value={note.content}
                    onChange={(e) => changeHandle(note.id, 'content', e.target.value)}
                  />
                ) : (
                  note.content
                )}
              </td>
              <td>{note.data}</td>
              <td>
                {note.isEdit ? (
                  <>
                    <button className="save-btn" onClick={() => saveHandle(note)}>
                      Сохранить
                    </button>
                    <button className="cancel-btn" onClick={() => cancelHandle(note.id)}>
                      Отмена
                    </button>
                  </>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => editNote(note)}
                    disabled={isEditing}
                  >
                    Редактировать
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteNote(note.id)}
                  disabled={isEditing}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={addElement} disabled={isEditing}>
        Добавить заметку
      </button>
    </div>
  );
}

export default App;