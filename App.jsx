import { useState, useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

function App() {
  const inputRef = useRef(0)
  const [count, setCount] = useState(0)
  const [todo, setTodo] = useState("")   //for input 
  const [todos, setTodos] = useState([])   // for list of todos
  const [showFinished, setshowFinished] = useState()

  const toggleFinished=(e) => {
    setshowFinished(!showFinished)
  }
  

  useEffect(() => {
    let length = localStorage.getItem("todos")
    if (length) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])

  useEffect(() => {
    if (todos.length > 1) {
      saveToLS() // Save updated todos
    }
  }, [todos]);

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }



  const handleEdit = (e, id) => {
    let t = todos.filter(i => { return i.id === id })
    setTodo(t[0].todo)

    let newTodos = todos.filter(item => {
      return item.id !== id
    })
    inputRef.current.focus()
    setTodos(newTodos)
    saveToLS()

  }
  const handleDelete = (e, id) => {
    if (confirm("Are you confirm to delete this???")) {
      let newTodos = todos.filter(item => {
        return item.id !== id
      })
      setTodos(newTodos)
      saveToLS()
    }
  }

  const handleAdd = () => {

    if (todo.trim()) {
      setTodos([...todos, { todo, id: uuidv4(), isCompleted: false }])
      setTodo("")
      saveToLS()
    } else
      alert("Please enter some data!")

  }

  const handleChange = (e) => {
    setTodo(e.target.value)

  }


  // ...............for the check box
  const handleCheck = (e) => {
    let id = e.target.name
    console.log(id)
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    console.log(index)
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
    saveToLS()
  }

  return (
    <>
      <Navbar />
      <div className='md:container m-auto rounded-xl bg-violet-200 my-10  p-4 min-h-[80vh] md:w-1/2'>
      <h1 className='text-center font-bold text-2xl my-3 '>iTask - Manage Your All Task At One Place</h1>
      <div className='h-[1px] bg-gray-100 my-5'></div>
        {/* ..................... add Task */}
        <div className="addTask  w-[610px]  "><h1 className='text-xl font-bold add ' >Add Task</h1>
          <div className='flex justify-between my-2 gap-2 flex-col  w-[48vw]'>
            <input ref={inputRef}  onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }} onChange={handleChange} value={todo} placeholder='Write your task here' className='p-3 w-auto  h-7 rounded-md' type="text" name="todo" id="" />
            <button onClick={handleAdd} className="bg-violet-700  px-4 w-auto rounded-md  text-white   "> Add</button>
          </div>
        </div>

        {/* ..........lower portion todo list */}
        <div className="list">

          <h1 className='text-xl font-bold'>Your Todos </h1>
          <div className='flex gap-2'>
            <input onChange={toggleFinished} checked={showFinished} type="checkbox" /><span>Show finished</span>
          </div>

          {todos.length === 0 && <div className='m-5'>Create your list now!!</div>}
          <div className="todos">
            {todos.map((item, key) => {
              return ((showFinished||!item.isCompleted) &&
              <div key={item.id} className="todo_list flex gap-5 justify-between w-5/6">
                  <input name={item.id} checked={item.isCompleted} onChange={handleCheck} type="checkbox" value={todo.isCompleted} />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo} </div>

                  <div className="buttons flex gap-5  h-10">

                    <button onClick={(e) => { handleEdit(e, item.id) }} className='add bg-violet-700  px-4 mx-2 rounded-md  text-white  my-2 '><FaEdit /></button>
                    <button onClick={(e) => { handleDelete(e, item.id) }} className='delete bg-violet-700  px-4 mx-2 rounded-md  text-white  my-2 '><MdDeleteOutline /></button>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </div>
    </>
  )
}

export default App
