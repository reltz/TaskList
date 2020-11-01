import { Injectable } from '@angular/core';
import { MockAdapter } from 'src/app/Adapters/mock-adapter.service';
import { TaskListQuery } from './task-list-query';
import { TaskListStore } from './task-list-store';
import { IList, viewModes } from './taskListModel';

@Injectable({
	providedIn: 'root',
})
export class TaskListService {
	constructor(
		private store: TaskListStore,
		private api: MockAdapter,
		private query: TaskListQuery,
	) { }

	public loadAll() {
		this.api.loadAll();
	}

	public upsert(taskList: IList) {
		this.api.upsert(taskList);
		this.setActive(taskList.id);
	}

	public update(taskList: Partial<IList>) {
		this.api.update(taskList);
	}

	public delete(id: string) {
		const first = this.query.getAll().length < 2
			? null
			: this.query.getAll()[0].id;
		this.setActive(first || 'null');
		this.api.delete(id);
	}

	public setActive(id: string) {
		this.store.setActive(id);
		this.api.setAuxInfo({ activeId: id });
	}

	public setViewMode(mode: viewModes) {
		this.api.setAuxInfo({ viewMode: mode });
		this.store.update({ viewMode: mode });
	}
}
