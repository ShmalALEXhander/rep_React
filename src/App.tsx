import { useState, useRef } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  data: string;
  isEdit: boolean;
}

function App() {
  const [notes, setNote] = useState<Note[]>([]);
  const curr_id = useRef(1);
  const origNote = useRef<Note | null>(null); // Храним оригинал здесь

  const add_element = () => {
    const newNote = {
      id: curr_id.current,
      title: `Заметка ${curr_id.current}`,
      content: `Содержание ${curr_id.current}`,
      data: new Date().toLocaleDateString(),
      isEdit: false,
    };
    setNote([...notes, newNote]);
    curr_id.current += 1;
  };

const delete_note = (id: number) => {
  setNote(notes.filter(note => note.id !== id));
}

  const edit_note = (note: Note) => {
    origNote.current = { ...note }; // Запоминаем оригинал перед редактированием
    setNote(notes.map(n => 
      n.id === note.id 
        ? { ...n, isEdit: true } 
        : { ...n, isEdit: false }
    ));
  };

  const save_handle = (note: Note) => {
    setNote(notes.map(n => 
      n.id === note.id 
        ? { ...note, isEdit: false } 
        : n
    ));
    origNote.current = null; // Очищаем ref после сохранения
  };

  const cancel_handle = (noteId: number) => {
    if (origNote.current && origNote.current.id === noteId) {
      // Восстанавливаем оригинал, если он есть
      setNote(notes.map(n => 
        n.id === noteId 
          ? { ...origNote.current!, isEdit: false } 
          : n
      ));
    } else {
      setNote(notes.map(n => 
        n.id === noteId 
          ? { ...n, isEdit: false } 
          : n
      ));
    }
    origNote.current = null; // Очищаем ref
  };

  const change_handle = (id: number, field: keyof Note, value: string) => {
    setNote(notes.map(n => 
      n.id === id  ? { ...n, [field]: value } : n
    ));
  };

  return (
    <div className="container">
      <h1>Управление заметками</h1>
      
      <table className="notes-table">
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
                    onChange={(e) => change_handle(note.id, 'title', e.target.value)}
                  />
                ) : (
                  note.title
                )}
              </td>
              
              <td>
                {note.isEdit ? (
                  <input
                    value={note.content}
                    onChange={(e) => change_handle(note.id, 'content', e.target.value)}
                  />
                ) : (
                  note.content
                )}
              </td>
              
              <td>{note.data}</td>
              
              <td>
                {note.isEdit ? (
                  <>
                    <button className="save-btn" onClick={() => save_handle(note)}>
                      Сохранить
                    </button>
                    <button className="cancel-btn" onClick={() => cancel_handle(note.id)}>
                      Отмена
                    </button>
                  </>
                ) : (
                  <button className="edit-btn" onClick={() => edit_note(note)}>
                    Редактировать
                  </button>             
                )}
              </td>
              <button className="delete-btn" onClick={() => delete_note(note.id)}>
                      Удалить
                    </button>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={add_element}>
        Добавить заметку
      </button>
    </div>
  );
}

export default App;