import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IList, viewModes } from './taskListModel';

export interface TaskListState extends EntityState<IList>, ActiveState {
	viewMode: viewModes;
}

export function createInitialState(): TaskListState {
	return {
		viewMode: 'single',
		active: '',
	};
}

/**
 * Store - part of the @datorama/akita library architecture for state management
 */
@StoreConfig({ name: 'taskList' })
export class TaskListStore extends EntityStore<TaskListState, IList>{
	constructor() {
		super(createInitialState());
	}
}
