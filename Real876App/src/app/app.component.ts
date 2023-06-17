import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Real876-App';
  constructor(private modalService: NgbModal,
    public translate: TranslateService,) {
    // translate.addLangs(['en']);
    // translate.setDefaultLang('en');

  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }
}
