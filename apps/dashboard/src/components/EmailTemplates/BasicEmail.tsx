import {
  Body,
  Column,
  Html,
  Img,
  Text,
  Heading,
  Container,
  Head,
  Font,
  Tailwind,
  type TailwindConfig,
  Row,
} from '@react-email/components';

interface BasicProps {
  qrCodeUrl: string;
}

export const Basic: React.FC<Readonly<BasicProps>> = ({ qrCodeUrl }) => (
  <Tailwind
    config={
      {
        theme: {
          fontSize: {
            xs: ['12px', { lineHeight: '16px' }],
            sm: ['14px', { lineHeight: '20px' }],
            base: ['16px', { lineHeight: '24px' }],
            lg: ['18px', { lineHeight: '28px' }],
            xl: ['20px', { lineHeight: '28px' }],
            '2xl': ['24px', { lineHeight: '32px' }],
            '3xl': ['30px', { lineHeight: '36px' }],
            '4xl': ['36px', { lineHeight: '36px' }],
            '5xl': ['48px', { lineHeight: '1' }],
            '6xl': ['60px', { lineHeight: '1' }],
            '7xl': ['72px', { lineHeight: '1' }],
            '8xl': ['96px', { lineHeight: '1' }],
            '9xl': ['144px', { lineHeight: '1' }],
          },
          spacing: {
            px: '1px',
            0: '0',
            0.5: '2px',
            1: '4px',
            1.5: '6px',
            2: '8px',
            2.5: '10px',
            3: '12px',
            3.5: '14px',
            4: '16px',
            5: '20px',
            6: '24px',
            7: '28px',
            8: '32px',
            9: '36px',
            10: '40px',
            11: '44px',
            12: '48px',
            14: '56px',
            16: '64px',
            20: '80px',
            24: '96px',
            28: '112px',
            32: '128px',
            36: '144px',
            40: '160px',
            44: '176px',
            48: '192px',
            52: '208px',
            56: '224px',
            60: '240px',
            64: '256px',
            72: '288px',
            80: '320px',
            96: '384px',
          },
        },
      } satisfies TailwindConfig
    }
  >
    {' '}
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body>
        <Container className="my-4">
          <Row>
            <Heading as="h1" className="text-center font-bold text-2xl">
              Credential recieved
            </Heading>
          </Row>
          <Row>
            <Text className="text-center">
              Scan the QR code with one of the supported wallets to claim your
              digital credential.
            </Text>
          </Row>
          <Row>
            <Column align="center">
              <Img width={384} height={384} src={qrCodeUrl} />
            </Column>
          </Row>
          <Row className="mt-8">
            <Column>EDUCTX LOGO</Column>
            <Column align="right">BCLABUM LOGO</Column>
          </Row>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
