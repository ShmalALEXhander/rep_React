import { useState } from 'react';
import './App.css';

function App() {
  const [titleText, setTitleText] = useState('Задание 1');

  const [elements, setElements] = useState<number[]>([]);

  const handleChangeTitle = () => {
    setTitleText('Обновлённый заголовок');
  };

  const handleAddElement = () => {
    setElements(prev => [...prev, prev.length + 1]);
  };

  return ( //Структура JSX
    <>
      <h1 id="title">{titleText}</h1>

      <p className="text">Первый параграф</p>
      <p className="text">Второй параграф</p>
      <p className="text">Третий параграф</p>

      <button id="changeBtn" onClick={handleChangeTitle}> Изменить содержимое </button>
      <button id="addBtn" onClick={handleAddElement}> Добавить элемент </button>
      <div id = "containder">
      {elements.map((elem, index) => (
        <div key = {index}> Новый элемент {elem}</div>
      ))}
      </div>
    </>
  );
}

export default App;