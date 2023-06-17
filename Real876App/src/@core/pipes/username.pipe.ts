import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'username'
})
export class GetUsernamePipe implements PipeTransform {
  transform(value: any): any {
    return (!value) ? '' 
            : (value.firstName || value.lastName) 
            ? `${value.firstName} ${value.lastName}`
            : value.username;
  }
}
