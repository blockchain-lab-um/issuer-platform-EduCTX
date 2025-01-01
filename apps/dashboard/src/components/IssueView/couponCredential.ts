import type { Schema, SchemaNode, SchemaObject } from './schemaTypes';

export const CouponCredential = {
  $id: '#couponCredential',
  type: 'object',
  properties: {
    credentialSubject: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        couponId: {
          type: 'string',
        },
        couponName: {
          type: 'string',
        },
      },
      required: ['id', 'couponId', 'couponName'],
    },
  },
  required: ['credentialSubject'],
};

export const CouponCredentialSchema = {
  title: 'Coupon Credential',
  type: '#couponCredential',
  fields: [
    {
      title: 'Credential Subject',
      type: 'object',
      propertyName: 'credentialSubject',
      fields: [
        {
          title: 'Coupon ID',
          propertyName: 'couponId',
          type: 'string',
          required: true,
        } as SchemaNode,
        {
          title: 'Coupon Name',
          propertyName: 'couponName',
          type: 'string',
          required: true,
        } as SchemaNode,
      ],
      required: true,
    },
  ],
  required: true,
} as Schema;
