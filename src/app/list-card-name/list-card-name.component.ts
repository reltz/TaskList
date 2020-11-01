import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { debounce, debounceTime, delay, filter, map, startWith, take, takeWhile, tap } from 'rxjs/operators';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
	selector: 'app-list-card-name',
	templateUrl: './list-card-name.component.html',
	styleUrls: ['./list-card-name.component.scss'],
})
export class ListCardNameComponent implements OnInit, OnDestroy {
	@Input() public id: string;
	public listName$: Observable<string>;
	private isAlive: boolean = true;
	public isActiveOne$: Observable<boolean>;

	constructor(
		private query: TaskListQuery,
		private svc: TaskListService,
		protected readonly dialog: MatDialog,
	) { }

	public ngOnInit(): void {
		this.listName$ = this.query.selectEntity(this.id)
			.pipe(
				takeWhile(() => this.isAlive),
				filter(list => !!list),
				map(list => list.title),
			);

		this.isActiveOne$ = this.query.selectActive().pipe(
			debounceTime(100),
			filter(active => !!active),
			map(entity => entity.id === this.id),
		);
	}

	public clickHandler() {
		this.svc.setActive(this.id);
	}

	public deleteList() {
		const listName = this.query.getEntity(this.id).title;
		this.dialog.open(ConfirmDeleteDialogComponent, { data: { Name: listName } })
			.afterClosed().pipe(
				filter(confirmed => !!confirmed),
				take(1),
			).subscribe(() => {
				this.svc.delete(this.id);
			});
	}

	public ngOnDestroy() {
		this.isAlive = false;
	}
}
