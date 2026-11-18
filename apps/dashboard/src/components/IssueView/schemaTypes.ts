export interface SchemaNode {
  title: string;
  type: 'string' | 'number' | 'integer';
  isCredentialSubject?: boolean;
  required?: boolean;
  propertyName: string;
}

export interface SchemaObject {
  title: string;
  type: 'object';
  fields: SchemaNode[] | SchemaObject[];
  required?: boolean;
  propertyName: string;
}

export interface Schema {
  title: string;
  type?: string;
  format?: string;
  fields: SchemaNode[] | SchemaObject[];
}
