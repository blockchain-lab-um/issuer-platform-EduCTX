import {
  Body,
  Column,
  Html,
  Img,
  Text,
  Heading,
  Container,
  Tailwind,
  Row,
  Link,
  Section,
  Hr,
  Head,
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
      <Head />
      <Body>
        <Container>
          <Section className="my-[22px]">
            <Row>
              <Heading as="h1" className="text-center font-bold text-3xl px-7">
                You recieved a new credential!
              </Heading>
            </Row>
            <Row>
              <Text className="text-center px-7 text-xs">
                The credential has been issued to you via EduCTX platform.
                Retreive it anytime with the QR code below.
              </Text>
            </Row>
            <Row>
              <Column className="px-7" align="center">
                <Img width={288} height={288} src={qrCodeUrl} />
              </Column>
            </Row>
          </Section>
          <Section className="mt-8 bg-[#fffaed]" align="left">
            <Row>
              <Column className="pt-3 px-7 flex w-full items-center">
                <Text className="font-medium text-lg">
                  Use Masca Wallet
                  <Img
                    className="ml-1 mr-2 w-[16px] h-[15px] inline-flex"
                    width={18}
                    height={16}
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/images/masca_black.png`}
                  />
                  to retrieve your new credential
                </Text>
              </Column>
            </Row>
            <Row align="left">
              <Column className="pl-7 w-10" align="left">
                <Img
                  width={28}
                  height={28}
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/wallet.png`}
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
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/phone.png`}
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
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/qr_code.png`}
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
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/lock_unlocked.png`}
                />
              </Column>
              <Column align="left">
                <Text className="font-normal text-base pl-2">
                  Enter PIN from te second email
                </Text>
              </Column>
            </Row>
          </Section>
          <Section className="my-6" align="left">
            <Row>
              <Column className="px-7">
                <Text className="text-lg font-semibold">Why in this form?</Text>
              </Column>
            </Row>
            <Row align="left">
              <Column className="pl-7 pr-0.5 max-w-[149px]" align="left">
                <Row align="left">
                  <Column className="bg-[#EDF9F3] rounded-md p-4" align="left">
                    <Row align="left" className="w-full">
                      <Column align="left">
                        <Img
                          className="max-w-[18px] mr-1"
                          src={`${process.env.NEXT_PUBLIC_APP_URL}/images/globe.png`}
                        />
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text className="m-0 my-1 font-semibold text-xs text-left">
                          Standardization
                        </Text>
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text
                          style={{ fontSize: '10px', lineHeight: '12px' }}
                          className="m-0"
                        >
                          In line with European Commission and technology
                          (EIEIE, DJADS) standards
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Column>
              <Column className="pr-7 pl-0.5 max-w-[149px]" align="left">
                <Row align="left">
                  <Column className="bg-[#EDF9F3] rounded-md p-4" align="left">
                    <Row align="left" className="w-full">
                      <Column align="left">
                        <Img
                          className="max-h-[18px] mr-1"
                          src={`${process.env.NEXT_PUBLIC_APP_URL}/images/lock_locked.png`}
                        />
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text className="m-0 my-1 font-semibold text-xs text-left">
                          Security
                        </Text>
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text
                          style={{ fontSize: '10px', lineHeight: '12px' }}
                          className="m-0"
                        >
                          Storing credentials in Web3 wallet keeps them safely
                          and securely in one place.
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Column>
            </Row>
            <Row className="mt-1.5" align="left">
              <Column className="pl-7 pr-0.5 max-w-[149px]" align="left">
                <Row align="left">
                  <Column className="bg-[#EDF9F3] rounded-md p-4" align="left">
                    <Row align="left" className="w-full">
                      <Column align="left">
                        <Img
                          className="max-w-[20px] mr-1"
                          src={`${process.env.NEXT_PUBLIC_APP_URL}/images/forward.png`}
                        />
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text className="m-0 my-1 font-semibold text-xs text-left">
                          Building the future
                        </Text>
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text
                          style={{ fontSize: '10px', lineHeight: '12px' }}
                          className="m-0"
                        >
                          In line with technology standards (W3C VC, OIDC4VC),
                          EU regulations and initiatives (GDPR, EBSI)
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Column>
              <Column className="pr-7 pl-0.5 max-w-[149px]" align="left">
                <Row align="left">
                  <Column className="bg-[#EDF9F3] rounded-md p-4" align="left">
                    <Row align="left" className="w-full">
                      <Column align="left">
                        <Img
                          className="max-h-[18px] mr-1"
                          src={`${process.env.NEXT_PUBLIC_APP_URL}/images/academic_hat.png`}
                        />
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text className="m-0 my-1 font-semibold text-xs text-left">
                          Microcredentials
                        </Text>
                      </Column>
                    </Row>
                    <Row align="left">
                      <Column align="left">
                        <Text
                          style={{ fontSize: '10px', lineHeight: '12px' }}
                          className="m-0"
                        >
                          Store achievements in your digital wallet - Own your
                          identity and build your knowledge portfolio.
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
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
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/images/bclab.png`}
                  />
                </Link>
              </Column>
              <Column className="max-w-16 px-4 sm:max-w-24">
                <Link href="https://eductx.org/" target="_blank">
                  <Img
                    height={24}
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/images/eductx.png`}
                  />
                </Link>
              </Column>
              <Column className="pr-7 pl-4 max-w-16 sm:max-w-24">
                <Link href="https://masca.io/" target="_blank">
                  <Img
                    height={24}
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/images/masca_black_with_text.png`}
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
            <Row>
              <Column className="px-7" align="left">
                <Row className="mt-4" align="left">
                  <Column className="px-3">
                    <Img
                      width={36}
                      height={36}
                      src={`${process.env.NEXT_PUBLIC_APP_URL}/images/question_mark.png`}
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
