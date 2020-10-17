import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { v4 as makeUUid } from 'uuid';
import { TaskListService } from './@core/session-store/task-list.service';
import { RestoreDialogComponent } from './restore-dialog/restore-dialog.component';
import { BackupRestoreService } from './services/backup-restore.service';
import { UtilityService } from './services/utility.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy
{
	public title: string;
	public control: FormControl;
	public isAlive: boolean = true;
	public viewType$: Observable<string>;

	constructor(
		protected readonly service: TaskListService,
		protected readonly backupRestore: BackupRestoreService,
		protected readonly utility: UtilityService,
		protected readonly dialog: MatDialog,
	)
	{
	}

	public ngOnInit()
	{
		this.control = new FormControl('single');
		this.service.loadAll();
		this.title = 'TaskList App';

		this.viewType$ = this.control.valueChanges.pipe(
			startWith('single'),
		);
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}

	public download()
	{
		const link = document.createElement("a");
		link.href = this.backupRestore.downloadBackup();

		const dateTime = this.utility.getCurrentDateTime();

		link.download = 'RodTaskList-backup-' + dateTime + '.txt';
		link.click();
	}

	public handleRestore()
	{
		this.dialog.open(RestoreDialogComponent)
			.afterClosed();
	}

	public addNewList(): void
	{
		this.service.upsert({
			title: 'Title',
			id: makeUUid(),
			content: [],
		});
	}
}
