import { NgModule } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
//import { min } from 'rxjs/internal/operators';
import { DirectivesModule } from './directives.module';
import { SafePipe } from './safe.pipe';

@Pipe({
	name: 'timeleftPercent'
})
export class TimeLeftPercent implements PipeTransform {

	constructor() { }
	transform(value: any, startdate: any, enddate: any, circum: number) {
		if (startdate && enddate && circum) {
			let o = new Date(startdate).getTime();
			let p = new Date(enddate).getTime();
			let l = p - o;
			let k = new Date().getTime();
			let pr: any = (l > 0 && p > k) ? (((p - k) / l) * 100).toFixed(2) : 0;
			pr = pr > 100 ? 100 : pr;
			const offset = (circum) - pr / 100 * circum;
			return offset + 100 > circum ? offset : offset + 100;
		} return 0;
	}
}

@Pipe({
	name: 'timeleftpipe'
})
export class TimeLeftPipe implements PipeTransform {

	constructor() { }
	transform(value: any, enddate: any, formatted = true) {
		if (enddate) {
			let o = this.timeDiffCalcTwoDates(enddate);
			return (formatted) ?
				// `<li>
				// 		<p class="aution-p">${o.days}</p>
				// 		<p class="aution-p1">Days</p>
				// 	</li>
				// 	<li>
				// 		<p class="aution-p">${o.hour}</p>
				// 		<p class="aution-p1">hours</p>
				// 	</li>
				// 	<li>
				// 		<p class="aution-p">${o.min}</p>
				// 		<p class="aution-p1">mins</p>
				// 	</li>` : ` ${o.days} Days`;
				`${o.days}d ${o.hour}h ${o.min}m ${o.sec}s` : `0d 0h 0m 0s`
		}
		return (formatted) ? `<li>
					<p class="aution-p">00</p>
					<p class="aution-p1">Days</p>
				</li>
				<li>
					<p class="aution-p">00</p>
					<p class="aution-p1">hours</p>
				</li>
				<li>
					<p class="aution-p">00</p>
					<p class="aution-p1">mins</p>
				</li>` : ` 0 Days `;
	}

	timeDiffCalcTwoDates(dateFuture: number, dateNow = new Date().getTime()) {
		if (dateFuture > dateNow) {
			let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

			// calculate days
			const days = Math.floor(diffInMilliSeconds / 86400);
			diffInMilliSeconds -= days * 86400;

			// calculate hours
			const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
			diffInMilliSeconds -= hours * 3600;

			// calculate minutes
			const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
			diffInMilliSeconds -= minutes * 60;

			// calculate seconds
			const seconds = Math.floor(diffInMilliSeconds % 60);
			return { days: days, hour: hours, min: minutes, sec: seconds }
		} else {
			return { days: 0, hour: 0, min: 0, sec: 0 }
		}

	}

}


@Pipe({
	name: 'otpTimerDisp'
})
export class OtpTimerDisp implements PipeTransform {
	constructor() { }
	transform(value: any) {
		let o = this.calculateTimeLeft(value);
		return `${o.mins}m ${o.seconds}s`
	}

	calculateTimeLeft(leftsec: any) {
		let timeLeft = { hours: 0, mins: 0, seconds: 0, overallsec: leftsec };
		timeLeft.hours = ~~(timeLeft.overallsec / 3600);
		timeLeft.mins = ~~((timeLeft.overallsec % 3600) / 60);
		timeLeft.seconds = ~~timeLeft.overallsec % 60;

		return timeLeft;
	}

}


@Pipe({
	name: 'brnumber'
})
export class BrNumberPipe implements PipeTransform {

	constructor() { }
	transform(value: any) {
		return (!isNaN(value)) ? parseFloat(value).toLocaleString('en-US', {
			maximumFractionDigits: 2
		}) : 0;
	}

}

@Pipe({
	name: 'hyphenRm'
})
export class removeHyphen implements PipeTransform {

	constructor() { }
	transform(value: any) {
		return (value) ? value.replace(/-/g, "") : value;
	}

}



@Pipe({
	name: 'chatTimeAgo'
})
export class ChatTimeAgo implements PipeTransform {
	constructor(
	) {
	}
	transform(date: any, currentDate: any, isStatus: boolean, off: boolean) {
		if (!date) return isStatus ? 'offline' : 'away';
		return this.timeDiffCalc(new Date(date).getTime(), new Date(currentDate).getTime(), isStatus, off);
	}
	timeDiffCalc(dateFuture: number, dateNow: number, isStatus: boolean, off: boolean) {
		let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

		// calculate days
		const days = Math.floor(diffInMilliSeconds / 86400);
		diffInMilliSeconds -= days * 86400;

		// calculate hours
		const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
		diffInMilliSeconds -= hours * 3600;

		// calculate minutes
		const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
		diffInMilliSeconds -= minutes * 60;

		// calculate minutes
		const seconds = Math.floor(diffInMilliSeconds % 60);
		diffInMilliSeconds -= seconds;

		let tm = '1m ago';
		let isOnline = true;
		if (days > 0) {
			tm = days + 'd ago';
			isOnline = false;
		} else if (hours > 0) {
			tm = hours + 'h ago';
			if (hours < 1) {
				isOnline = true;
			} else isOnline = false
		} else if (minutes > 0) {
			tm = minutes + 'm ago';
		} else if (seconds > 0) {
			tm = seconds + 's ago';
		}
		return isStatus ? !isOnline ? off ? tm : 'offline' : 'online' : tm;
	}
}

@Pipe({
	name: 'uptoTwoDecimal'
})
export class UptoTwoDecimalPipe implements PipeTransform {

	transform(value: any, upto?: any) {
		let decimal = 2
		if (upto)
			decimal = upto;
		let c = value.toString();
		c = c.split('.');
		c[1] = c[1] ? c[1].substr(0, decimal) : '00';
		c = c.join('.');
		return parseFloat(c);
	}

}

@NgModule({
	declarations: [
		BrNumberPipe,
		TimeLeftPipe,
		TimeLeftPercent,
		OtpTimerDisp,
		ChatTimeAgo,
		removeHyphen,
		SafePipe,
		UptoTwoDecimalPipe

	],
	imports: [
		DirectivesModule
	],
	exports: [
		BrNumberPipe,
		TimeLeftPipe,
		TimeLeftPercent,
		OtpTimerDisp,
		ChatTimeAgo,
		removeHyphen,
		SafePipe,
		DirectivesModule,
		UptoTwoDecimalPipe

	],

})
export class SharingModule {
}
