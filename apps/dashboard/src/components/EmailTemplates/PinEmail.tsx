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
} from '@react-email/components';
import { tailwindConfig } from './tailwindConfig';

interface PinEmailProps {
  pin: string;
}

export const PinEmail: React.FC<Readonly<PinEmailProps>> = ({ pin }) => (
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
              Pin received
            </Heading>
          </Row>
          <Row>
            <Column align="right">
              <Text className="text-right">Your PIN is:</Text>
            </Column>
            <Column align="left">
              <Text className="pl-1 text-left font-bold">{pin}</Text>
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
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
