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
  Row,
  Hr,
  Link,
} from '@react-email/components';
import { tailwindConfig } from './tailwindConfig';

interface BasicEmailProps {
  qrCodeUrl: string;
}

export const BasicEmail: React.FC<Readonly<BasicEmailProps>> = ({
  qrCodeUrl,
}) => (
  <Tailwind config={tailwindConfig}>
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
              Credential received
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
            <Column>
              <Img
                width={48}
                height={48}
                src={`${process.env.NEXT_PUBLIC_APP_URL}/images/EDU-Coin.png`}
              />
            </Column>
            <Column align="right">
              <Img
                width={99}
                height={47}
                src={`${process.env.NEXT_PUBLIC_APP_URL}/images/blockchain-lab.png`}
              />
            </Column>
          </Row>
          <Hr className="mt-8" />
          <Row className="mt-2">
            <Column>
              <Text className="text-lg font-semibold">Supported wallets:</Text>
            </Column>
          </Row>
          <Row className="mt-2">
            <Column>
              <Link href="https://masca.io/">
                <Img
                  width={35}
                  height={31}
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/masca_black.png`}
                />
              </Link>
            </Column>
          </Row>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
