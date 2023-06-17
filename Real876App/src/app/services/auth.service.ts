import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as aesjs from 'aes-js';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AES_KEY_256: any = atob(environment.key_as).split('@')
  Aes_initializationVector: any = atob(environment.key_vec).split('@')
  Aes_KEY_256_BUFFER: any;
  apiUrl: string;
  public langChange = new BehaviorSubject<string>('en');

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    public translate: TranslateService,

  ) {
    this.AES_KEY_256 = this.AES_KEY_256.map((item:any) => { return parseInt(item) });
    this.Aes_initializationVector = this.Aes_initializationVector.map((item:any) => { return parseInt(item) });
    this.Aes_KEY_256_BUFFER = new Uint8Array(this.AES_KEY_256);
    this.apiUrl = environment.url

  }

  encode(newValue: any) {
    return newValue ? this.encrypt(newValue) : newValue;
  }

  decode(newValue: any) {
    return newValue ? this.decryptData(newValue) : newValue;
  }
  getDecode(res:any, def = []) {
    if (!res.error) {
      if (res.body) {
        res.body = this.decryptData(res.body);
        res.body = res.body ? JSON.parse(res.body) : def;
      }
    }
    return res;
  }

  encrypt(text: string) {
    const textBytes = aesjs.utils.utf8.toBytes(text);
    const aesCbc = new aesjs.ModeOfOperation.ofb(
      this.Aes_KEY_256_BUFFER,
      this.Aes_initializationVector,
    );
    const encryptedBytes = aesCbc.encrypt(textBytes);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  }

  decryptData(value: any) {
    var encryptedBytes = aesjs.utils.hex.toBytes(value);
    var aesOfb = new aesjs.ModeOfOperation.ofb(
      this.Aes_KEY_256_BUFFER,
      this.Aes_initializationVector,
    );
    var decryptedBytes = aesOfb.decrypt(encryptedBytes);

    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
  };

  errorToaster(data: any) {
    if (data.error && data.msg) {
      if (data.auth == false) {
        this.toastr.error('Your session has expired, please login again');
      }
      else {
        this.toastr.error(data.msg);
      }
    } else {
      this.toastr.error(data.msg);
    }
  }

  makePayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/paypalPayment`, data)
  }

  bankTransferPayment(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'mult')
    return this.http.post(`${this.apiUrl}/bankTransferPayment`, data, { headers: headers })
  }

  toastNow(text: string, type = 'error') {
    switch (type) {
      case 'error':
        this.toastr.error(text);
        break;
      case 'success':
        this.toastr.success(text);
        break;
      case 'warn':
        this.toastr.warning(text);
        break;
      case 'info':
        this.toastr.info(text);
        break;
    }
  }
  gotoExternal(link: string) {
    window.open(link, "_blank");
  }

  showTranlateToaster(val: any, toprepend = '', toappend = '', type = 'error') {
    let toToast = `${toprepend}${val}${toappend}`;
    this.toastNow(toToast, type);

  }


  executePayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/paypalSuccess`, data)
  }
  cancelPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/paypalCancel`, data)
  }
  // encryption Key fxn
  //   function encrypt(key_array) {
  //   var p = key_array.join('@');
  //   var k = btoa(p)
  //   console.log(k)
  //   return k;
  // }
  //   function decrypt(key_string) {
  //     var p = atob(key_string).split('@');
  //     c = p.map(item => { return parseInt(item)} );
  //     console.log(c)
  //     return caches;
  //  }

  getLang():any {
    let lang = localStorage.getItem('lang');
    if (lang) {
      this.translate.use(lang);
      $("body").removeClass('en pt es');
      $('body').addClass(lang);
      return lang;
    }
  }
  changeLange(lang: string) {
    localStorage.setItem("lang", lang)
    this.langChange.next(lang);
    this.translate.use(lang);
    $("body").removeClass('en pt es');
    $('body').addClass(lang);
  }

  getTxLink(txhash: any, type = 'BTC'):any {
    switch (type) {
      case 'BTC':
        return `https://www.blockchain.com/btc/tx/${txhash}`;
      case 'ETH':
        return `https://www.blockchain.com/eth/tx/${txhash}`;
    }

  }
}
