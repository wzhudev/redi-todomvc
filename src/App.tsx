import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { hot } from 'react-hot-loader'

import { Injector, registerSingleton } from '@wendellhu/redi'
import { connectInjector, useInjector } from '@wendellhu/redi/react-bindings'

import './App.css'

import Footer from './Footer'
import { RouterService } from './services/router'
import { StateService } from './services/state'
import { TodoService } from './services/todo'
import TodoItem from './TodoItem'
import { Observable } from 'rxjs'
import { IStoreService } from './services/store/store'
import { LocalStoreService } from './services/store/store.web'

registerSingleton(IStoreService, { useClass: LocalStoreService })

/**
 * subscribe to a signal that emits whenever data updates and re-render
 *
 * @param update$ a signal that the data the functional component depends has updated
 */
export function useUpdateBinder(update$: Observable<void>): void {
    const [, dumpSet] = useState(0)

    useEffect(() => {
        const subscription = update$.subscribe(() =>
            dumpSet((prev) => prev + 1)
        )
        return () => subscription.unsubscribe()
    }, [])
}

function TodoMVC() {
    const injector = useInjector()
    const stateService = injector.get(StateService)!
    const todoService = injector.get(TodoService)!
    const inputRef = useRef<HTMLInputElement>(null)

    useUpdateBinder(stateService.updated$.asObservable())
    useUpdateBinder(todoService.updated$.asObservable())

    function handleKeydown(e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return
        }

        e.preventDefault()

        const val = inputRef.current?.value

        if (val) {
            todoService.addTodo(val)
            inputRef.current!.value = ''
        }
    }

    const todoItems = todoService.shownTodos.map((todo) => {
        return <TodoItem key={todo.id} todo={todo}></TodoItem>
    })

    const todoPart = todoService.todoCount ? (
        <section>
            <input
                type="checkbox"
                id="toggle-all"
                className="toggle-all"
                onChange={(e) => todoService.toggleAll(e.target.checked)}
                checked={todoService.activeTodoCount === 0}
            />
            <label htmlFor="toggle-all">Mark all as completed</label>
            <ul className="todo-list">{todoItems}</ul>
        </section>
    ) : null

    const footerPart = todoService.todoCount ? <Footer></Footer> : null

    return (
        <div>
            <header className="header">
                <h1>todos</h1>
                <input
                    type="text"
                    ref={inputRef}
                    className="new-todo"
                    placeholder="What needs to be done?"
                    onKeyDown={handleKeydown}
                    autoFocus={true}
                />
            </header>
            {todoPart}
            {footerPart}
        </div>
    )
}

const AppContainer = connectInjector(
    TodoMVC,
    new Injector([[TodoService], [StateService], [RouterService]])
)

export default hot(module)(() => <AppContainer />)
