import classNames from 'classnames'
import React from 'react'

import { useInjector } from '@wendellhu/redi/react-bindings'

import { SHOWING, StateService } from './services/state'
import { TodoService } from './services/todo'
import { pluralize } from './utils/pluralize'

export default function Footer() {
    const injector = useInjector()
    const todoService = injector.get<TodoService>(TodoService)!
    const stateService = injector.get<StateService>(StateService)!

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{todoService.activeTodoCount}</strong>{' '}
                {pluralize(todoService.activeTodoCount, 'item')} left
            </span>
            <ul className="filters">
                <li>
                    <a
                        href="#/"
                        className={classNames({
                            selected:
                                stateService.nowShowing === SHOWING.ALL_TODOS,
                        })}
                    >
                        All
                    </a>
                </li>{' '}
                <li>
                    <a
                        href="#/active"
                        className={classNames({
                            selected:
                                stateService.nowShowing ===
                                SHOWING.ACTIVE_TODOS,
                        })}
                    >
                        Active
                    </a>
                </li>{' '}
                <li>
                    <a
                        href="#/completed"
                        className={classNames({
                            selected:
                                stateService.nowShowing ===
                                SHOWING.COMPLETED_TODOS,
                        })}
                    >
                        Completed
                    </a>
                </li>
            </ul>
            {todoService.completedCount > 0 ? (
                <button
                    className="clear-completed"
                    onClick={() => todoService.clearCompleted()}
                >
                    Clear completed
                </button>
            ) : null}
        </footer>
    )
}
