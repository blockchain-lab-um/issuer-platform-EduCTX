import type { Schema, SchemaNode, SchemaObject } from './schemaTypes';

export const CouponCredential = {
  $id: '#couponCredential',
  type: 'object',
  format: 'jwt_vc_json',
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
  format: 'jwt_vc_json',
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

export const CouponCredentialSdJwtSchema = {
  title: 'Coupon Credential (SD-JWT)',
  type: '#couponCredential',
  format: 'vc+sd-jwt',
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
