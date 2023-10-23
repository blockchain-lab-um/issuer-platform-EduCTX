import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isError } from '@blockchain-lab-um/masca-connector';
import { CheckIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import axios from 'axios';

import { useGeneralStore, useMascaStore } from '@/stores';

interface MappedCredentials {
  credential: any;
  claimed: boolean;
  created_at: string;
  id: string;
}

export const ClaimView = () => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(true);
  const [credentials, setCredentials] = useState<MappedCredentials[]>([]);
  const { currDID, api } = useMascaStore((state) => ({
    currDID: state.currDID,
    api: state.mascaApi,
  }));

  const checkForCredentials = async () => {
    console.log('checkForCredentials', currDID);

    const res = await axios.get(`http://127.0.0.1:3000/query/${currDID}`);
    console.log(res.data);

    const exp = Math.ceil(new Date().getTime() / 1000 + 60 * 60);

    const signedData = await api?.signData({
      type: 'JWT',
      data: { payload: { nonce: res.data.nonce, aud: res.data.audience, exp } },
    });

    if (isError(signedData!)) {
      console.log('error signing data');
      return;
    }

    const body2 = { proof: signedData?.data };
    console.log(body2);

    const issuedCredentials = await axios.post(
      `http://127.0.0.1:3000/query/test_proof`,
      body2
    );

    console.log(issuedCredentials.data);

    if (issuedCredentials.data.length === 0) {
      console.log('no credentials');
      return;
    }

    const mappedCredentials: MappedCredentials[] = issuedCredentials.data.map(
      (obj: any) => {
        const parsedCredential = JSON.parse(obj.credential);
        return {
          credential: parsedCredential,
          claimed: false,
          date: obj.created_at,
          id: obj.id,
        };
      }
    );

    setCredentials(mappedCredentials);
    setIsSelected(false);
  };

  const claimCredential = async (credential: any, id: string) => {
    console.log('claimCredential', credential);

    const result = await api?.saveCredential(credential);

    if (isError(result!)) {
      console.log(result);
      return;
    }

    const updatedCredentials = credentials.map((obj) => {
      if (obj.id === id) {
        return { ...obj, claimed: true };
      }
      return obj;
    });

    setCredentials(updatedCredentials);
  };

  const { changeIsConnected } = useGeneralStore((state) => ({
    changeIsConnected: state.changeIsConnected,
  }));

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(115deg, #9F7AEA, #FEE2FE)',
      }}
    >
      <div className="w-3/4 max-w-7xl rounded-3xl bg-white p-4 text-gray-900">
        <div className="flex justify-between">
          <div>Connected with: {currDID}</div>
          <Button
            variant="bordered"
            onClick={() => {
              changeIsConnected(false);
              router.push('/');
            }}
            size="sm"
            className="text-gray-900"
          >
            Disconnect
          </Button>
        </div>
        <div className="flex items-center">
          <Switch
            isSelected={isSelected}
            onValueChange={setIsSelected}
            size="sm"
            defaultSelected
            aria-label="Automatic updates"
          />{' '}
          Toggle test VCs
        </div>
        <div className="flex w-full items-center justify-center  py-16">
          {isSelected && (
            <Button
              size="lg"
              color="primary"
              onClick={() => {
                checkForCredentials()
                  .then(() => {})
                  .catch(() => {});
              }}
              className="font-medium"
            >
              Check for New Credentials
            </Button>
          )}
          {!isSelected && (
            <div className="w-full">
              <div>
                <div className="flex justify-between">
                  <Button variant="bordered" size="sm" color="primary">
                    Mark claimed credentials
                  </Button>
                  <Button variant="bordered" size="sm" color="secondary">
                    Refresh credentials
                  </Button>
                </div>
                <Table
                  className="mt-8"
                  aria-label="Example static collection table"
                >
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {credentials.map((obj) => (
                      <TableRow key={obj.id}>
                        <TableCell>{obj.credential.type.toString()}</TableCell>
                        <TableCell>Course Participant</TableCell>
                        <TableCell>
                          {obj.claimed ? (
                            <Button
                              color="success"
                              endContent={<CheckIcon className="h-4 w-4" />}
                              disabled
                            >
                              Claimed
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              onClick={() => {
                                claimCredential(obj.credential, obj.id)
                                  .then(() => {})
                                  .catch(() => {});
                              }}
                            >
                              Claim
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
