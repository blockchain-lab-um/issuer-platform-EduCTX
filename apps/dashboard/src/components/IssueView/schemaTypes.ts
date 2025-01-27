export interface SchemaNode {
  title: string;
  type: 'string' | 'number';
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
  fields: SchemaNode[] | SchemaObject[];
}
