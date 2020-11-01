import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, take, tap } from 'rxjs/operators';
import { v4 as makeUUid } from 'uuid';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { IList } from '../@core/session-store/taskListModel';

@Component({
	selector: 'app-single-view',
	templateUrl: './single-view.component.html',
	styleUrls: ['./single-view.component.scss'],
})
export class SingleViewComponent implements OnInit {
	public hideList: boolean = false;
	public allLists$: Observable<IList[]>;
	public isThereActive$: Observable<any>;

	constructor(
		protected readonly service: TaskListService,
		protected readonly query: TaskListQuery,
	) { }

	public ngOnInit(): void {
		this.isThereActive$ = this.query.selectActive()
			.pipe(
				map(x => x !== null && x !== undefined),
			);

		this.allLists$ = this.query.selectAll();
	}

	public addNewList(): void {
		this.service.upsert({
			title: 'Title',
			id: makeUUid(),
			content: [],
		});
	}

	public toogleList() {
		this.hideList = !this.hideList;
	}
}
