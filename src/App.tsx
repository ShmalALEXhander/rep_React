import { useState, useRef } from "react";
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
const curr_id = useRef(1);
// Глобальные переменные, которыми являются переменные, находящиеся вне функциональных компонентов, НЕДОПУСТИПЫ в серьёзных проектах.
// По этой причине их помещают в структурные модули. в числе которых useState, useRef/.


//Всё просто: при обработке события "нажатия кнопки" вызывется функция (стоит подумать почему {}), которая является стрелочного типа,
// Создаётся экземпляр заметки, затем обновляется состояние notes путём использования функции setNote , которая копирует прошлое состояние notes и добавляет newNote. 
const add_element = () => {
  const newNote = {
  id: curr_id.current,
  title: `Заметка ${curr_id.current}`,
  content: `Cодержание ${curr_id.current}`,
  data: new Date().toLocaleDateString(),
  };
  setNote([...notes, newNote]); // литеральный массив.
  curr_id.current +=1;  
}

//Изменяем состояние при удалении по id  . проходим filter по всему массиву и оставляем элементы которые не равно id.

const delete_note = (id: number) => {
  setNote(notes.filter(note => note.id !== id)); 
}

//Все стили перенёс в App.tsx 
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
export default NoteTable; // Сделал доступной из всей программы.