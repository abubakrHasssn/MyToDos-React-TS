import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./App.css";

function App() {
  //To keep Track of Tasks States
  const [TaskList, setTaskList] = useState<tasksType[]>([]);
  //Temporary used handel adding new task to the task list
  const [task, setTask] = useState<tasksType>({ Text: "", completed: false });
  //Sweet Alert
  const MySwal = withReactContent(Swal);
  //onPageLoad => Fetch The list of Tasks form Local Storage
  useEffect(() => {
    getTaskListFromLocalStorage();
  }, []);
  //Save Tasks List to Local Storage
  const saveTaskListToLocalStorage = (notes: {}) => {
    //Serialize Json Array To add to LS.
    const TaskList = JSON.stringify(notes);
    localStorage.setItem("ReactToDoList", TaskList);
  };
  //Fetch Tasks List form Local Storage
  const getTaskListFromLocalStorage = () => {
    //Deserialize String from LS to Json Array.
    const TaslList = localStorage.getItem("ReactToDoList");
    if (TaslList) {
      //Reset Task list with the data from LS.
      setTaskList(JSON.parse(TaslList));
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTaskList = [...TaskList, task];
    setTaskList(newTaskList);
    saveTaskListToLocalStorage(newTaskList);
    setTask({ Text: "", completed: false });
    MySwal.fire({
      position: "top-end",
      icon: "success",
      title: "Task added!",
      showConfirmButton: false,
      timer: 1000,
    });
  };
  const onStatusChange = (index: any) => {
    const newStatus = TaskList;
    newStatus[index].completed = !newStatus[index].completed;
    setTaskList([...newStatus]);
    saveTaskListToLocalStorage([...newStatus]);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ Text: e.currentTarget.value, completed: false });
  };
  const onTaskDelete = (index: any) => {
    const newTaskList = TaskList;

    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        newTaskList.splice(index, 1);
        setTaskList([...newTaskList]);
        saveTaskListToLocalStorage([...newTaskList]);
        MySwal.fire({
          position: "top-end",
          icon: "success",
          title: "Deleted!",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    });
  };
  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center">To Do List</h2>
          <form onSubmit={onSubmit}>
            <div className="d-flex justify-content-between align-items-center">
              <input
                required
                value={task.Text}
                onChange={onChange}
                type="text"
                className="form-control"
                placeholder="Whats up ?!"
              />
              <input type="submit" value="Add" className="btn btn-success" />
            </div>
          </form>
          <ul className="list-group mt-3">
            {TaskList.length > 0
              ? TaskList.map((task, index) => {
                  return (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span
                        className={
                          task.completed
                            ? "text-break text-decoration-line-through"
                            : "text-break"
                        }
                      >
                        {task.Text}
                      </span>
                      <div className="d-flex justify-content-between align-items-center">
                        <input
                          className="form-check-input m-1 "
                          type="checkbox"
                          onChange={() => onStatusChange(index)}
                          id="flexCheckDefault"
                          checked={task.completed}
                        />
                        <button
                          onClick={() => onTaskDelete(index)}
                          className="btn badge rounded-pill bg-danger"
                        >
                          X
                        </button>
                      </div>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface tasksType {
  Text: string;
  completed: boolean;
}

export default App;
