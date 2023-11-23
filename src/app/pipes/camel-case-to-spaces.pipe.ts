import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSpaces'
})
export class CamelCaseToSpacesPipe implements PipeTransform {
  transform(camelCaseText: string): string {
    if (!camelCaseText) {
      return ''
    };

    let result = camelCaseText.replace(/([a-z])([A-Z])/g, '$1 $2');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
