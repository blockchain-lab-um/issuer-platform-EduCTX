'use client';

import { BasicEmail } from '@/components/EmailTemplates/BasicEmail';
import { LoginView } from '@/components/LoginView';

export default function Home() {
  return (
    <BasicEmail qrCodeUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1280px-QR_code_for_mobile_English_Wikipedia.svg.png" />
    // <main className="">
    //   <LoginView />
    // </main>
  );
}
