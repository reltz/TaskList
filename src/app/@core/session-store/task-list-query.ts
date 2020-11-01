import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { } from 'rxjs'; import { map } from 'rxjs/operators';
import { TaskListState, TaskListStore } from './task-list-store';

/**
 * Query - part of the @datorama/akita library for state management. this should be used to retrieve information from the store.
 */
@Injectable()
export class TaskListQuery extends QueryEntity<TaskListState> {

	constructor(protected store: TaskListStore) {
		super(store);
	}
}
