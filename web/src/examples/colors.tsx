/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, PropsWithChildren } from 'react';

export const Cyan: FC<PropsWithChildren> = ({ children }) => {
  return <span style={{ color: 'cyan' }}>{children}</span>
}
export const Grey: FC<PropsWithChildren> = ({ children }) => {
  return <span style={{ color: 'grey' }}>{children}</span>
}
