
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'safe'
})
export class SafePipe implements PipeTransform {

	constructor(private sanitizer: DomSanitizer) { }
	transform(value: any, type = 'url') {
		switch (type) {
			case 'html':
				return this.sanitizer.bypassSecurityTrustHtml(value);
			case 'url':
				return this.sanitizer.bypassSecurityTrustUrl(value);
			case 'resource-url':
				return this.sanitizer.bypassSecurityTrustResourceUrl(value);
			default:
				return value;
		}
	}

}