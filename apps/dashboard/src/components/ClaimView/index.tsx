import React from 'react';
import { useRouter } from 'next/navigation';
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

import { useGeneralStore, useMascaStore } from '@/stores';

const CREDENTIALS = [
  { title: 'MatLabUserScore', claimed: false },
  { title: 'SuperCoolKidDiploma', claimed: true },
];

export const ClaimView = () => {
  const router = useRouter();
  const [isSelected, setIsSelected] = React.useState(true);
  const { currDID } = useMascaStore((state) => ({
    currDID: state.currDID,
  }));

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
          <div>Connected with: {currDID.substring(0, 16).concat('...')}</div>
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
            <Button size="lg" color="primary" className="font-medium">
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
                    {CREDENTIALS.map((credential) => (
                      <TableRow key={credential.title}>
                        <TableCell>{credential.title}</TableCell>
                        <TableCell>Course Participant</TableCell>
                        <TableCell>
                          {credential.claimed ? (
                            <Button
                              color="success"
                              endContent={<CheckIcon className="h-4 w-4" />}
                              disabled
                            >
                              Claimed
                            </Button>
                          ) : (
                            <Button color="primary">Claim</Button>
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
