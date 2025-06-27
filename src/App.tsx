import { useState } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  data: string;
}

function NotesTable(){

const [notes, setNotes] = useState<Note[]>([]);

const deleteNote = (id: number) => {
  setNotes(notes.filter(note => note.id !== id));
};

const AddElement = () => {
  const newNote = {
    id: notes.length + 1,
    title: `Заметка ${notes.length + 1}`,
    content: `Новое содержание ${notes.length + 1}`,
    data: new Date().toLocaleDateString(),
  };
  setNotes([...notes, newNote]);
};

return (

  <div style = {{ padding: '300px'}}>
    <h1>Мои заметки</h1>
    <table style = {{width: '100%', borderCollapse: 'collapse'}}>
      <thead>
       <tr>
        <th style = {{border: '1px solid #ddd', padding: '8px'}}>ID</th>
        <th style = {{border: '1px solid #ddd', padding: '8px'}}>Заголовок</th>
        <th style = {{border: '1px solid #ddd', padding: '8px'}}>Содержание</th>
        <th style = {{border: '1px solid #ddd', padding: '8px'}}>Дата</th>
        </tr> 
      </thead>
      <tbody>
       {notes.map(note => (
        <tr key = {note.id}>
          <td style = {{border: '1px solid #ddd', padding: '8px'}}>{note.id}</td>
          <td style = {{border: '1px solid #ddd', padding: '8px'}}>{note.title}</td>
          <td style = {{border: '1px solid #ddd', padding: '8px'}}>{note.content}</td>
          <td style = {{border: '1px solid #ddd', padding: '8px'}}>{note.data}</td>
          <button onClick = {() => deleteNote(note.id)}>Удалить</button>
        </tr>
      ))}
      </tbody>
    </table>
     <button id ="addBtn" onClick={AddElement}> Добавить элемент </button>
  </div>
);
};
export default NotesTable;