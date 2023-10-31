/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, } from 'react';
import { TerminalInput, TerminalOutput } from 'react-terminal-ui';


export type TerminalRowProps = {
  element: any;
  type: 'input' | 'output';
  delay?: number;
}


const TerminalRow: FC<TerminalRowProps> = ({ element, type }) => {
  return type === 'input' ?
    <TerminalInput prompt="root@user:~#">{element}</TerminalInput>
    :
    <><TerminalOutput>{element}</TerminalOutput><TerminalOutput/></>
}
export default TerminalRow;
