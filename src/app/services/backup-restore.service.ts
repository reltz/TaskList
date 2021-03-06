import { Injectable } from '@angular/core';
import { MockAdapter } from '../Adapters/mock-adapter.service';

@Injectable({
	providedIn: 'root',
})
export class BackupRestoreService
{
	private fileIdentifier: string = 'RodTaskList';
	constructor(
		protected readonly api: MockAdapter,
	) { }

	private fileUrl: any;
	private readonly localDBName: string = 'RodTaskListApp';

	public downloadBackup()
	{
		const data = this.fileIdentifier + localStorage.getItem(this.localDBName);
		const blob = new Blob([data], { type: 'text/txt' });

		this.fileUrl = this.createObjectURL(blob);
		return this.fileUrl;
	}

	public restore(content: string)
	{
		if (!!content && content !== '' && content.substring(0, this.fileIdentifier.length) === this.fileIdentifier)
		{
			content = content.slice(this.fileIdentifier.length);
			this.api.restoreData(content);
		}
		else
		{
			const error = 'Invalid file, please upload a valid backup file';
			console.error('Invalid file, please upload a valid backup file');
			alert(error);
		}
	}

	private createObjectURL(file)
	{
		if (webkitURL)
		{
			if (this.fileUrl)
			{
				webkitURL.revokeObjectURL(this.fileUrl);
			}
			return webkitURL.createObjectURL(file);
		} else if (URL && URL.createObjectURL)
		{
			if (this.fileUrl)
			{
				URL.revokeObjectURL(this.fileUrl);
			}
			return URL.createObjectURL(file);
		} else
		{
			return null;
		}
	}
}
