import { useState, useRef } from "react";
import './App.css';

interface Note {
  id: number;
  title: string;
  content: string;
  data: string;
}

function NoteTable(){

const [notes, setNote] = useState<Note[]>([]);
const curr_id = useRef(1);

const add_element = () => {
  const newNote = {
  id: curr_id.current,
  title: `Заметка ${curr_id.current}`,
  content: `Cодержание ${curr_id.current}`,
  data: new Date().toLocaleDateString(),
  };
  setNote([...notes, newNote]);
  curr_id.current +=1;  
}

const delete_note = (id: number) => {
  setNote(notes.filter(note => note.id !== id));
}


return(
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
        <tr key = {note.id}>   
          <td>{note.id}</td>
          <td>{note.title}</td>
          <td>{note.content}</td>
          <td>{note.data}</td>
          <button onClick = {()=>delete_note(note.id)}>Удалить</button>
        </tr>
        ))}
      </tbody>
    </table>
    <button id = "addBtn" onClick = {add_element}>Добавить элемент</button>
  </div>
);
};
export default NoteTable;