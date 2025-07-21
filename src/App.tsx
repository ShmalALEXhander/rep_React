import './App.css'
import { useState, useRef } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  data: string;
  isEdit: boolean;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const curr_id = useRef(1);
  const origNote = useRef<Note | null>(null); // Храним оригинал здесь

  const addElement = () => {
    const newNote = {
      id: curr_id.current,
      title: `Заметка ${curr_id.current}`,
      content: `Содержание ${curr_id.current}`,
      data: new Date().toLocaleDateString(),
      isEdit: false,
    };
    setNotes([...notes, newNote]);
    curr_id.current += 1;
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const editNote = (note: Note) => {
    origNote.current = { ...note }; // Запоминаем оригинал перед редактированием
    setNotes(notes.map(n => n.id === note.id ? { ...n, isEdit: true } : { ...n, isEdit: false }
    ));
  };

  const saveHandle = (note: Note) => {
    setNotes(notes.map(n => 
      n.id === note.id ? { ...note, isEdit: false } : n
    ));
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
                    value={note.title}
                    onChange={(e) => changeHandle(note.id, 'title', e.target.value)}
                  />
                ) : (
                  note.title
                )}
              </td>
              <td>
                {note.isEdit ? (
                  <input
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