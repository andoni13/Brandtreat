import injectTapEventPlugin from 'react-tap-event-plugin';
import expect from 'expect';
// Material Components
import RaisedButton from 'material-ui/RaisedButton';
import { createStore, combineReducers } from 'redux';
import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';

// Tests
const testAddTodo = () => {
	const stateBefore = [];
	const action = {
		type: 'ADD_TODO',
		id: 0,
		text: 'Learn Redux',
	};
	const stateAfter = [{
		id: 0,
		text: 'Learn Redux',
		completed: false
	}];
	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);
};

const testToggleTodo = () => {
	const stateBefore = [{
		id: 0,
		text: 'Learn Redux',
		completed: false
	}, {
		id: 1,
		text: 'Go shopping',
		completed: false
	}];
	const action = {
		type: 'TOGGLE_TODO',
		id: 1
	};
	const stateAfter = [{
		id: 0,
		text: 'Learn Redux',
		completed: false
	}, {
		id: 1,
		text: 'Go shopping',
		completed: true
	}];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);
};

// Reducers
const todo = (state, action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			if (state.id !== action.id) {
				return state;
			}
			return {
				...state,
				completed: !state.completed
			};
		default:
			return state;
	}
};

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO': return [
			...state,
			todo(undefined, action)
		];
		case 'TOGGLE_TODO': return state.map(t => todo(t, action));
		default:
			return state;
	}
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch(action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default: 
			return state;
	}
};

// Action creators
let nextTodoId = 0;
const addTodo = (text) => {
	return {
		type: 'ADD_TODO',
		id: nextTodoId++,
		text
	}
};

const setVisibilityFilter = (filter) => {
	return {
		type: 'SET_VISIBILITY_FILTER',
		filter
	};
};

const toggleTodo = (id) => {
	return {
		type: 'TOGGLE_TODO',
		id
	};
};

// Presentational Components
const Todo = ({
	onClick,
	completed,
	text
}) => (
	<li
		onClick={onClick}
		style={{
			textDecoration: completed ? 'line-through' : 'none'
		}}>
		{text}
	</li>
);

const TodoList = ({
	todos,
	onTodoClick
}) => (
	<ul>
		{todos.map(todo => 
			<Todo
				key={todo.id}
				{...todo}
				onClick={() => onTodoClick(todo.id)}
			/>
		)}
	</ul>
);

// Presentation Component
const Link = ({
	active,
	children,
	onClick
}) => {
	if (active) {
		return <span>{children}</span>
	}

	return (
		<a href="#"
			onClick={e => {
				e.preventDefault();
				onClick();
			}}>
			{children}
		</a>
	);
}

// Container Component
const mapStateToLinkProps = (state, ownProps) => {
	return {
		active: ownProps.filter === state.visibilityFilter
	};
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
			dispatch(setVisibilityFilter(ownProps.filter))
		}
	};
};
const FilterLink = connect(
	mapStateToLinkProps, 
	mapDispatchToLinkProps
)(Link);

const Footer = () => (
	<p>
		Show:
		{' '}
		<FilterLink filter='SHOW_ALL'>All</FilterLink>
		{', '}
		<FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
		{', '}
		<FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
	</p>
)

// Combining reducers
const todoApp = combineReducers({
	todos,
	visibilityFilter
});

// Presentation or Container Component
let AddTodo = ({ dispatch }) => {
	let input;

	return (
		<div>
			<input ref={node => {
					input = node;
				}} />
				<RaisedButton
					label="Add Todo"
					primary={true}
					onTouchTap={() => {
						dispatch(addTodo(input.value));
						input.value = '';
					}}/>
				<button onClick={() => {
					dispatch(addTodo(input.value));
					input.value = '';
				}}>
					Add Todo
				</button>
		</div>
	)
};
AddTodo = connect()(AddTodo);

const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter(
				t => t.completed
			);
		case 'SHOW_ACTIVE':
			return todos.filter(
				t => !t.completed
			);
	}
};
// Container Component
const mapStateToTodoListProps = (state) => {
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	};
};
const mapDispatchToTodoListProps = (dispatch) => {
	return {
		onTodoClick: (id) => {
			dispatch(toggleTodo(id))
		}
	};
};
const VisibleTodosList = connect(
	mapStateToTodoListProps, 
	mapDispatchToTodoListProps
)(TodoList);

class TodoApp extends Component {
	componentWillMount() {
		injectTapEventPlugin();
	}
	render() {
		return (
			<div>
				<AddTodo />
				<VisibleTodosList />
				<Footer />
				<b>teST</b>
			</div>
		);
	}
};
// Container Components
// const TodoApp = () => (
	
// );

ReactDOM.render(
	<Provider store={createStore(todoApp)}>
		<TodoApp />
	</Provider>,
	document.getElementById('root')
);

// Creates a store
// const store = createStore(todoApp);

// store.subscribe(render);

testAddTodo();
testToggleTodo();
console.log('Passed!');

if (module.hot) {
	module.hot.accept();
}