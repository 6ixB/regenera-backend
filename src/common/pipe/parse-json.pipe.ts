import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

type TParseFormDataJsonOptions = {
  fields: string[];
};

@Injectable()
export class ParseFormDataJsonPipe implements PipeTransform {
  constructor(private options?: TParseFormDataJsonOptions) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    const { fields } = this.options || { fields: [] };

    if (fields.length === 0) {
      return value;
    }

    const parsedValue = { ...value };

    for (const field of fields) {
      if (value[field]) {
        const jsonField = value[field].replace(
          /(\w+:)|(\w+ :)/g,
          function (matchedStr: string) {
            return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
          },
        );
        parsedValue[field] = JSON.parse(jsonField);
      }
    }

    return parsedValue;
  }
}
