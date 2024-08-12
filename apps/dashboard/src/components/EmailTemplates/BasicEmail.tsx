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
} from '@react-email/components';
import { tailwindConfig } from './tailwindConfig';
import {
  DevicePhoneMobileIcon,
  WalletIcon,
  QrCodeIcon,
  KeyIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ForwardIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface BasicEmailProps {
  qrCodeUrl: string;
}

export const BasicEmail: React.FC<Readonly<BasicEmailProps>> = ({
  qrCodeUrl,
}) => (
  <Tailwind config={tailwindConfig}>
    <Html lang="en">
      <Body>
        <Container className="w-[390px]">
          <Section className="my-[22px]">
            <Row>
              <Heading
                as="h1"
                className="text-center font-medium text-2xl px-7"
              >
                You recieved a new credential!
              </Heading>
            </Row>
            <Row>
              <Text
                style={{ fontSize: '10px', lineHeight: '12px' }}
                className="text-center px-7"
              >
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
          <Section className="mt-8 bg-[#fffaed]">
            <Row>
              <Column className="pt-3 px-7 flex w-full items-center">
                <Text className="font-medium text-lg">
                  Use Masca Wallet
                  <Img
                    className="mb-1 ml-0.5 mr-2 w-[16px] h-[15px] inline-flex"
                    width={18}
                    height={16}
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/images/masca_black.png`}
                  />
                  to retrieve your new credential
                </Text>
              </Column>
            </Row>
            <Row>
              <Column className="px-7 flex items-center space-x-1">
                <WalletIcon className="p-1 mr-2 w-7 h-7 inline-flex text-[#F4D280] bg-[#FCF1D5] border-1 border-[#F4D280] rounded-full" />

                <Text className="font-normal text-base">Download</Text>
                <Link
                  className="font-normal text-base underline text-inherit"
                  href="https://masca.io/"
                >
                  Masca Wallet
                </Link>
              </Column>
            </Row>
            <Row>
              <Column className="px-7 flex items-center space-x-1">
                <DevicePhoneMobileIcon className="p-1 mr-2 w-7 h-7 inline-flex text-[#F4D280] bg-[#FCF1D5] border-1 border-[#F4D280] rounded-full" />
                <Text className="font-normal text-base">
                  Connect it to your phone
                </Text>
              </Column>
            </Row>

            <Row>
              <Column className="px-7 flex items-center space-x-1">
                <QrCodeIcon className="p-1 mr-2 w-7 h-7 inline-flex text-[#F4D280] bg-[#FCF1D5] border-1 border-[#F4D280] rounded-full" />
                <Text className="font-normal text-base">Scan the QR code</Text>
              </Column>
            </Row>
            <Row>
              <Column className="pb-3 px-7 flex items-center space-x-1">
                <KeyIcon className="p-1 mr-2 w-7 h-7 inline-flex text-[#F4D280] bg-[#FCF1D5] border-1 border-[#F4D280] rounded-full" />
                <Text className="font-normal text-base">
                  Enter PIN from te second email
                </Text>
              </Column>
            </Row>
          </Section>
          <Section className="my-6">
            <Row>
              <Column className="px-7">
                <Text className="text-lg font-semibold">Why in this form?</Text>
              </Column>
            </Row>
            <Row>
              <Column className="pl-7 pr-0.5 w-[149px]">
                <Row>
                  <Column className="bg-[#EDF9F3] rounded-md p-2">
                    <Row>
                      <Column>
                        <GlobeAltIcon className="w-5 h-5 inline-flex text-[#2AAA6F]" />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Text className="m-0 my-1 font-medium text-xs">
                          Standardization
                        </Text>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
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
              <Column className="pr-7 pl-0.5 w-[149px]">
                <Row>
                  <Column className="bg-[#EDF9F3] rounded-md p-2">
                    <Row>
                      <Column>
                        <LockClosedIcon className="w-5 h-5 inline-flex text-[#2AAA6F]" />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Text className="m-0 my-1 font-medium text-xs">
                          Security
                        </Text>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
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
            <Row className="mt-1.5">
              <Column className="pl-7 pr-0.5 w-[149px]">
                <Row>
                  <Column className="bg-[#EDF9F3] rounded-md p-2 ">
                    <Row>
                      <Column>
                        <ForwardIcon className="w-5 h-5 inline-flex text-[#2AAA6F]" />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Text className="m-0 my-1 font-medium text-xs">
                          Building the future
                        </Text>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
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
              <Column className="pr-7 pl-0.5 w-[149px]">
                <Row>
                  <Column className="bg-[#EDF9F3] rounded-md p-2">
                    <Row>
                      <Column>
                        <AcademicCapIcon className="w-5 h-5 inline-flex text-[#2AAA6F]" />
                      </Column>
                    </Row>
                    <Row>
                      <Column>
                        <Text className="m-0 my-1 font-medium text-xs">
                          Microcredentials
                        </Text>
                      </Column>
                    </Row>
                    <Row>
                      <Column>
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
          <Section className="my-8 mb-12">
            <Row>
              <Column>
                <Text className="text-center text-sm font-medium">
                  Brought to you by
                </Text>
              </Column>
            </Row>
            <Row>
              <Column className="pl-7">
                <Img
                  height={28}
                  width={77}
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/bclab.png`}
                />
              </Column>
              <Column>
                <Img
                  height={28}
                  width={100}
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/eductx.png`}
                />
              </Column>
              <Column className="pr-7">
                <Img
                  height={28}
                  width={77}
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/masca_black_with_text.png`}
                />
              </Column>
            </Row>
          </Section>
          <Row>
            <Column className="px-7">
              <Hr className="border-t-1.5 rounded-md" />
            </Column>
          </Row>
          <Section className="mt-4 mb-10">
            <Row>
              <Column className="px-7">
                <Row className="mt-4">
                  <Column className="px-3">
                    <Img
                      width={72}
                      height={72}
                      src={`${process.env.NEXT_PUBLIC_APP_URL}/images/question_mark.png`}
                    />
                  </Column>
                  <Column className="pr-3">
                    <Row className="font-medium text-xs">Need some help?</Row>
                    <Row>
                      <Text
                        className="m-0"
                        style={{ fontSize: '10px', lineHeight: '12px' }}
                      >
                        If you need any help whatsoever or just want to find out
                        more about the EduCTX ecosystems, email us anytime at
                        <Link
                          href="mailto:blockchain-lab@um.si?subject=EduCTX"
                          className="ml-0.5 inline-flex text-[#2AAA6F]"
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
          <Hr className="h-1 bg-[#2AAA6F] border-[#2AAA6F]" />
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
