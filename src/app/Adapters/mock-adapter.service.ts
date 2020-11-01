import { Injectable } from '@angular/core';
import { TaskListStore } from '../@core/session-store/task-list-store';
import { IAuxInfo, IList } from '../@core/session-store/taskListModel';
import { viewModes } from './../@core/session-store/taskListModel';

/**
 * This adapter is using local storage temporarely instead of db api conection
 */

@Injectable({
	providedIn: 'root',
})
export class MockAdapter {
	private readonly localDBName: string = 'RodTaskListApp';
	private readonly auxDb: string = 'RodTaskListAux';

	constructor(
		private store: TaskListStore,
	) {
	}

	// api call to load DB records into state
	public loadAll(): void {
		if (!localStorage.getItem(this.localDBName)) {
			localStorage.setItem(this.localDBName, '{}');
		}

		if (!localStorage.getItem(this.auxDb)) {
			localStorage.setItem(this.auxDb, '{}');
		}

		const allLists = JSON.parse(localStorage.getItem(this.localDBName));
		Object.keys(allLists).forEach(key => {
			this.store.upsert(allLists[key].id, allLists[key]);
		});

		const auxInfo: IAuxInfo = this.getLocalStorageAux();

		if (auxInfo.activeId !== '') { this.store.setActive(auxInfo.activeId); }
		if (auxInfo.viewMode) { this.store.update({ viewMode: auxInfo.viewMode }); }
	}

	public upsert(taskList: IList): void {
		const allDB = this.getLocalStorageObject();
		allDB[taskList.id] = taskList;
		this.mapAndSetLocalStorage(allDB);
	}

	public update(taskList: Partial<IList>): void {
		const allDb = this.getLocalStorageObject();

		if (taskList.title) { allDb[taskList.id].title = taskList.title; }
		if (taskList.content) { allDb[taskList.id].content = taskList.content; }
		this.mapAndSetLocalStorage(allDb);
	}

	public delete(id: string): void {
		this.store.remove(id);
		const allDb = this.getLocalStorageObject();
		delete allDb[id];
		this.mapAndSetLocalStorage(allDb);
	}

	public restoreData(data: string): void {
		localStorage.setItem(this.localDBName, data);
		this.loadAll();
	}

	/*
		  Auxiliary db section
	*/
	public setAuxInfo(info: Partial<IAuxInfo>): void {
		const db = this.getLocalStorageAux();
		if (info.activeId) {
			db['activeId'] = info.activeId;
		}
		if (info.viewMode) {
			db['viewMode'] = info.viewMode;
		}

		this.setLocalStorageAux(db);
	}

	private getLocalStorageObject(): {} {
		return JSON.parse(localStorage.getItem(this.localDBName));
	}

	private mapAndSetLocalStorage(db: {}): void {
		localStorage.setItem(this.localDBName, JSON.stringify(db));
		this.loadAll();
	}

	private getLocalStorageAux() {
		return JSON.parse(localStorage.getItem(this.auxDb));
	}

	private setLocalStorageAux(db: {}) {
		localStorage.setItem(this.auxDb, JSON.stringify(db));
		this.loadAll();
	}
}
