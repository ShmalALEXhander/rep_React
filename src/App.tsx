import { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  data: string;
}

function NotesTable() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch('http://localhost:5173')
      .then(response => {
        console.log('Ответ получен:', response);
        return response.json()})
      .then(data => setNotes(data))
      .catch(error => console.error('Ошибка загрузки заметок:', error));
  }, []);

  const deleteNote = (id: number) => {
    fetch(`http://localhost:5173/api/notes/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        } else {
          console.error('Ошибка при удалении заметки');
        }
      })
      .catch(error => console.error('Ошибка сети:', error));
  };

  const AddElement = () => {
    const newNote = {
      title: `Заметка ${notes.length + 1}`,
      content: `Новое содержание ${notes.length + 1}`,
      data: new Date().toLocaleDateString(),
    };

    fetch('http://localhost:5173/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    })
      .then(response => response.json())
      .then(createdNote => {
        setNotes(prevNotes => [...prevNotes, createdNote]);
      })
      .catch(error => console.error('Ошибка при добавлении:', error));
  };

  return (
    <div style={{ padding: '300px' }}>
      <h1>Мои заметки</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Заголовок</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Содержание</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Дата</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr key={note.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{note.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{note.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{note.content}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{note.data}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => deleteNote(note.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button id="addBtn" onClick={AddElement}>Добавить элемент</button>
    </div>
  );
}
export default NotesTable;