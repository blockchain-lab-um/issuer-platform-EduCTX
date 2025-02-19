import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { decodeJwt } from 'jose';
import { createHash, randomUUID } from 'node:crypto';
import stringify from 'json-stable-stringify';
import { PEXv2 } from '@sphereon/pex';

const pex: PEXv2 = new PEXv2();

const route: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
          },
          required: ['id'],
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const data = (await fastify.couponCache.get(request.params.id)) as any;

      if (!data) {
        return reply.code(404).send();
      }

      const state = randomUUID();

      const queryString = new URLSearchParams({
        response_type: 'code',
        scope: data.scope,
        client_id: 'eductx-platform-backend',
        redirect_uri: 'openid://',
        state,
        request_object: 'reference',
      }).toString();

      const response = await fetch(
        `${fastify.config.VERIFIER_SERVER_URL}/oidc/authorize?${queryString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'manual',
        },
      );

      fastify.authRequestCache.set(state, request.params.id);

      return reply.code(200).send({
        authRequestId: state,
        location: response.headers.get('location'),
      });
    },
  );

  fastify.get(
    '/status/:authRequestId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            authRequestId: {
              type: 'string',
            },
          },
          required: ['authRequestId'],
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const response = await fetch(
        `${fastify.config.VERIFIER_SERVER_URL}/oidc/status/${request.params.authRequestId}`,
        {
          headers: {
            'x-api-key': fastify.config.VERIFIER_API_KEY,
          },
        },
      );

      if (response.status === 404) {
        return reply.code(404).send();
      }

      const data = await response.json();

      if (data.status === 'Success') {
        const vpToken = data.data;

        // We expect the vpToken to be of type `String`
        if (!vpToken) {
          return reply.code(500).send();
        }

        const couponDataId = (await fastify.authRequestCache.get(
          request.params.authRequestId,
        )) as any;

        // Get the coupon from the cache
        const couponData = (await fastify.couponCache.get(couponDataId)) as any;

        // Decode the vpToken
        const decodedVpToken = decodeJwt(vpToken) as any;

        const credentials: any = Array.isArray(
          decodedVpToken.vp.verifiableCredential,
        )
          ? decodedVpToken.vp.verifiableCredential
          : [decodedVpToken.vp.verifiableCredential];

        const selectResultMatches = pex.selectFrom(
          couponData.presentationDefinition,
          credentials,
        );

        if (selectResultMatches.areRequiredCredentialsPresent === 'error') {
          return reply.code(200).send({
            status: 'Failed',
            error: 'Not all required credentials are present',
          });
        }

        // NOTE: We always select only the first match
        const selectedCredentials =
          selectResultMatches.verifiableCredential?.[0];

        if (!selectedCredentials) {
          return reply.code(200).send({
            status: 'Failed',
            error: 'Internal Server Error',
          });
        }

        // Stable stringify of `credentials` to get consistent hash
        const stringifiedCredentials = stringify({
          credentials: selectedCredentials,
        });

        if (!stringifiedCredentials) {
          return reply.code(200).send({
            status: 'Failed',
            error: 'Internal Server Error',
          });
        }

        const claimId = createHash('sha256')
          .update(stringifiedCredentials)
          .digest('hex');

        // If `couponId` was already used, return the existing coupon, otherwise take a new one
        const coupon = await fastify.claimCache.get(claimId);

        if (coupon) {
          return reply.code(200).send({
            status: 'Success',
            data: {
              coupon,
            },
          });
        }

        const newCoupon = (couponData.coupons as string[]).pop();

        if (!newCoupon) {
          return reply.code(200).send({
            status: 'Failed',
            error: 'No coupons available',
          });
        }

        fastify.couponCache.set(couponDataId, couponData);
        fastify.claimCache.set(claimId, newCoupon);

        return reply.code(200).send({
          status: 'Success',
          data: {
            coupon: newCoupon,
          },
        });
      }

      return reply.code(200).send(data);
    },
  );
};

export default route;
