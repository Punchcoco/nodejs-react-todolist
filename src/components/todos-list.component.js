import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Todo = props =>(
  <tr>
    <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
    <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
    <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
    <td>
      <Link to={"/edit/"+props.todo._id}>Edit</Link>
    </td>

  </tr>
)

export default class TodosList extends Component {
  constructor(props){
    super(props);

    this.state = {todos:[],isLoading:false};
    this.signal = axios.CancelToken.source();


  }

  componentDidMount() {
    this.onLoadUser();
  }

  componentDidUpdate(){
    axios.get('http://localhost:4000/todos').then(res=>{
      this.setState({todos:res.data});
      })
    .catch((error)=>{console.log(error);})
  }

  componentWillUnmount() {
    this.signal.cancel('Api is being canceled');
}

  onLoadUser = async () => {
    try {
      this.setState({ isLoading: true });
      const response = await axios.get('http://localhost:4000/todos', {
        cancelToken: this.signal.token,
      })
      this.setState({todos: response.data, isLoading: true });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message); // => prints: Api is being canceled
      } else {
        this.setState({ isLoading: false });
      }
    }
    }



    todoList(){
      return this.state.todos.map((x,i)=>{
        return <Todo todo={x} key={i} />;
      })
    }


  render(){
    return(
      <div>
        <h3>Todos List</h3>
        <table className="table table-striped" style={{marginTop: 20}}>
          <thead>
            <tr>
            <th>Description</th>
            <th>Responsible</th>
            <th>Priority</th>
            <th>Action</th>
            
            </tr>
          </thead>
          <tbody>
            {this.todoList()}
          </tbody>
        </table>
      </div>
    )
  }

}
