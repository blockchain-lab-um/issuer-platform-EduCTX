import {
  Body,
  Column,
  Html,
  Img,
  Text,
  Heading,
  Container,
  Head,
  Tailwind,
  Row,
  Hr,
  Link,
  Section,
} from '@react-email/components';
import { tailwindConfig } from './tailwindConfig';
import { renderAsync } from '@react-email/render';

interface PinEmailProps {
  pin: string;
}

export const renderPinEmail = async ({ pin }: PinEmailProps) =>
  await renderAsync(<PinEmail pin={pin} />, { pretty: true });

export const PinEmail: React.FC<Readonly<PinEmailProps>> = ({ pin }) => (
  <Tailwind config={tailwindConfig}>
    <Html lang="en">
      <Head />
      <Body>
        <Container>
          <Section className="my-[22px]">
            <Row>
              <Heading as="h1" className="text-center font-bold text-3xl px-7">
                Here is the PIN code to unlock your credentials
              </Heading>
            </Row>
            <Row>
              <Text className="text-center px-7 text-xs">
                The credential has been issued to you via EduCTX platform.
                Retreive it anytime with the QR code from the previous email.
              </Text>
            </Row>
            <Row className="mt-8">
              <Column align="center" className="px-32">
                <Row>
                  <Column align="center" className="border-2">
                    <Text className="text-center font-bold text-2xl text-[#2AAA6F]">
                      {pin}
                    </Text>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>
          <Section className="mt-8 bg-[#fffaed]" align="left">
            <Row>
              <Column className="pt-3 px-7 flex w-full items-center">
                <Text className="font-medium text-lg">
                  Use Masca Wallet to retrieve your new credential
                </Text>
              </Column>
            </Row>
            <Row align="left">
              <Column className="pl-7 w-10" align="left">
                <Img
                  width={28}
                  height={28}
                  src={
                    'https://utfs.io/f/xiVgL8oEMuOHSkpHbgIy6YXsEkvxeHDC0jV9m4SZMFnha1tQ'
                  }
                />
              </Column>
              <Column align="left">
                <Text className="font-normal text-base pl-2">
                  Download{' '}
                  <Link
                    className="font-normal text-base underline text-inherit inline-flex"
                    href="https://masca.io/"
                  >
                    Masca Wallet
                  </Link>
                </Text>
              </Column>
            </Row>
            <Row align="left">
              <Column className="pl-7 w-10" align="left">
                <Img
                  width={28}
                  height={28}
                  src={
                    'https://utfs.io/f/xiVgL8oEMuOH1yzZmLZPLlb6qMvhgsQyTpE7HVX3x8u2IDnF'
                  }
                />
              </Column>
              <Column align="left">
                <Text className="font-normal text-base pl-2">
                  Connect it to your phone
                </Text>
              </Column>
            </Row>
            <Row align="left">
              <Column className="pl-7 w-10" align="left">
                <Img
                  width={28}
                  height={28}
                  src={
                    'https://utfs.io/f/xiVgL8oEMuOHGrIG4Xgx3Xp5HKnkb2eyPuL6MNqlrUAZdozj'
                  }
                />
              </Column>
              <Column align="left">
                <Text className="font-normal text-base pl-2">
                  Scan the QR code
                </Text>
              </Column>
            </Row>
            <Row align="left" className="mb-4">
              <Column className="pl-7 w-10" align="left">
                <Img
                  width={28}
                  height={28}
                  src={
                    'https://utfs.io/f/xiVgL8oEMuOHsnxWHJMpfVtGRO0ljDo7UnvYm5kHAcM6CJ4b'
                  }
                />
              </Column>
              <Column align="left">
                <Text className="font-semibold text-base pl-2">
                  Enter PIN from te second email
                </Text>
              </Column>
            </Row>
          </Section>
          <Section className="mb-20">
            <Row className="mt-12">
              <Column>
                <Text className="text-center text-sm font-semibold">
                  Brought to you by
                </Text>
              </Column>
            </Row>
            <Row>
              <Column className="pl-7 pr-4 max-w-16 sm:max-w-24">
                <Link
                  href="https://blockchain-lab.um.si/?lang=en"
                  target="_blank"
                >
                  <Img
                    height={24}
                    src={
                      'https://utfs.io/f/xiVgL8oEMuOHXGLnlaa80DxS4F8urC3ZiUMbdeWHLnKo6gz5'
                    }
                  />
                </Link>
              </Column>
              <Column className="max-w-16 px-4 sm:max-w-24">
                <Link href="https://eductx.org/" target="_blank">
                  <Img
                    height={24}
                    src={
                      'https://utfs.io/f/xiVgL8oEMuOHbgDg6Pvg2r19STisaAOt6hbdNn0yUjFkQ8Ce'
                    }
                  />
                </Link>
              </Column>
              <Column className="pr-7 pl-4 max-w-16 sm:max-w-24">
                <Link href="https://masca.io/" target="_blank">
                  <Img
                    height={24}
                    src={
                      'https://utfs.io/f/xiVgL8oEMuOHasXjqteSKupZeHwCykBiMO4xzE3nvGQ5LmTN'
                    }
                  />
                </Link>
              </Column>
            </Row>
          </Section>
          <Row>
            <Column className="px-7">
              <Hr className="border-t-1.5 rounded-md" />
            </Column>
          </Row>
          <Section className="mt-4 mb-10" align="left">
            <Row align="left">
              <Column className="px-7" align="left">
                <Row className="mt-4" align="left">
                  <Column className="px-3">
                    <Img
                      width={36}
                      height={36}
                      src={
                        'https://utfs.io/f/xiVgL8oEMuOHXZhqo780DxS4F8urC3ZiUMbdeWHLnKo6gz5O'
                      }
                    />
                  </Column>
                  <Column className="pr-3" align="left">
                    <Row
                      className="font-semibold text-xs mb-1 text-left"
                      align="left"
                    >
                      Need some help?
                    </Row>
                    <Row align="left">
                      <Text
                        className="m-0"
                        style={{ fontSize: '10px', lineHeight: '12px' }}
                      >
                        If you need any help whatsoever or just want to find out
                        more about the EduCTX ecosystems, email us anytime at{' '}
                        <Link
                          href="mailto:blockchain-lab@um.si?subject=EduCTX"
                          className="inline-flex text-[#2AAA6F]"
                          style={{ fontSize: '10px', lineHeight: '12px' }}
                        >
                          blockchain-lab@um.si
                        </Link>
                      </Text>
                    </Row>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Section>
          <Hr className="m-0 h-1 bg-[#2AAA6F] border-[#2AAA6F]" />
          <Section className="bg-[#156166]">
            <Text
              className="px-7 text-white"
              style={{ fontSize: '10px', lineHeight: '12px' }}
            >
              EduCTX is ecosystem is designed and developed by Blockchain Lab:UM
              of University of Maribor, Faculty of Electrical Engineering and
              Computer Science.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
