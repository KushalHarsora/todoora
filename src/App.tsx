import axios from 'axios';
import React from 'react';
import {
  Check,
  Plus,
  Trash
} from 'lucide-react';

interface Todo {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
}

const App = () => {
  const [data, setData] = React.useState<Todo[]>([]);
  const [numberCompleted, setNumberCompleted] = React.useState<number>(0);

  React.useEffect(() => {
    const getData = async () => {
      const response = await axios.get('https://dummyjson.com/todos');
      const todos = response.data.todos;

      setData(todos);
      setNumberCompleted(todos.filter((todo: Todo) => todo.completed).length);
    };

    getData();
  }, []);

  const handleAddTodo = () => {
    const input = document.querySelector('input') as HTMLInputElement;
    if (input.value) {
      const newTodo = {
        completed: false,
        id: data.length + 1,
        todo: input.value,
        userId: 1,
      };
      setData((prevData) => [newTodo, ...prevData]);
      input.value = '';
    } else {
      alert('Please enter a todo');
    }
  };

  const handleDoneTodo = (id: number) => {
    const todoToUpdate = data.find((todo) => todo.id === id);
    if (todoToUpdate) {
      setData((prevData) =>
        prevData.map((todo) =>
          todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );
      if (todoToUpdate.completed) {
        setNumberCompleted((prevCount) => prevCount - 1);
      } else {
        setNumberCompleted((prevCount) => prevCount + 1);
      }
    }
  };

  const handleDeleteTodo = (id: number) => {
    const todoToDelete = data.find((todo) => todo.id === id);
    if (todoToDelete && todoToDelete.completed)
      setNumberCompleted((prevCount) => prevCount - 1);
    setData((prevData) => prevData.filter((todo) => todo.id !== id));
  };

  const handleClearAll = () => {
    setData([]);
    setNumberCompleted(0);
  };


  return (
    <React.Fragment>
      <main className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
        <section>
          <div>
            <h1 className="text-3xl font-bold">Todo List</h1>
          </div>
          <div className="flex flex-row gap-4 items-center justify-between mt-4 mb-2">
            <input
              type="text"
              className="border-[1px] border-gray-400 rounded-xl p-2.5 w-full"
              placeholder="Add Todo..."
            />
            <button
              className="border-[1px] border-gray-300 p-2.5 rounded-xl hover:bg-gray-200 transition-all duration-200 ease-in-out"
              onClick={handleAddTodo}
            >
              <Plus />
            </button>
          </div>
          <div className="h-fit max-h-[75vh] w-[75vw] max-w-[700px] max-md:max-w-[500px] overflow-auto">
            <div className="flex flex-col gap-4 mt-4">
              {data &&
                data.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex flex-row justify-between items-center gap-2 p-4 border rounded-lg ${todo.completed ? 'bg-green-200' : 'bg-red-200'
                      }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2">
                        <h2 className="text-xl max-md:text-base text-justify">{todo.todo}</h2>
                      </div>
                      <p className="text-gray-600">
                        {todo.completed ? 'Completed' : 'Not Completed'}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      {!todo.completed && (
                        <button
                          className="text-white bg-green-600 p-1.5 rounded-md shadow shadow-green-200"
                          onClick={() => handleDoneTodo(todo.id)}
                        >
                          <Check />
                        </button>
                      )}
                      <button
                        className="text-white bg-red-600 p-1.5 rounded-md shadow shadow-red-200"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                ))}

              {data.length === 0 && (
                <div className="flex flex-col gap-2 p-4 border rounded-lg bg-gray-200">
                  <h2 className="text-xl max-md:text-base text-justify">
                    No Todos Available
                  </h2>
                  <p className="text-gray-600">Please add a todo</p>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-row gap-4 items-center justify-between mt-4 mb-2'>
            <h2 className="text-xl font-bold">
              Total Completed: {numberCompleted} / {data.length}
            </h2>
            <button onClick={handleClearAll} className="text-white bg-red-600 p-2.5 rounded-xl shadow shadow-red-200">
              Clear All
            </button>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
};

export default App;