/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useState } from 'react';
import Terminal from 'react-terminal-ui';
import TerminalRow, { TerminalRowProps } from './TermnialRow.tsx';
import { logoConsole } from './helpers.ts';
import { Cyan, Grey } from './colors'

/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols
// @ts-ignore
const allSteps: TerminalRowProps[] = [ {
  type: 'input',
  element: 'ls'
}, {
  type: 'output',
  element: 'domain.com.har  harmor.template.json',
  delay: 1000
}, {
  type: 'input',
  element: 'npx harmor@latest ./domain.com.har',
  delay: 1000
}, {
  type: 'output',
  element: logoConsole
}, {
  type: 'output',
  element: <><Cyan>?</Cyan> <b>How do you want to sanitize values?</b> <Grey>› - Use arrow-keys. Return to
    submit.</Grey><br/>
    <Cyan>&nbsp;› <u>by Encryption</u></Cyan>
    <br/>&nbsp;&nbsp;&nbsp;by replace with '_harmored_'
  </>
}, {
  type: 'output',
  element: <><Cyan>?</Cyan> <b>Enter encryption password</b> <Grey>- press enter to use the generated password
    › </Grey> w9#qXk+Cml1wctO#9z?2OV6v
  </>
}, {
  type: 'output',
  element: <><Cyan>?</Cyan> <b>Do you want to sanitize all JWT by regex?</b> <Grey>- algorithm and signature will be
    sanitized › (Y/n)</Grey> yes</>
} ]

const Example1: FC = () => {
  const [ steps, setStep ] = useState<TerminalRowProps[]>([]);

  useEffect(() => {
    if (allSteps.length === steps.length) {
      setTimeout(() => {
        setStep([ allSteps[0] ])
      }, 5000)
      return
    }
    const duration = steps.length === 0 ? 0 : (steps[steps.length - 1].delay ?? 500);
    setTimeout(() => {
      setStep(allSteps.slice(0, steps.length + 1))
    }, duration)
  }, [ steps ]);

  return <Terminal name="HARMOR Basic Usage" >
    {steps.map((value, index) => <TerminalRow key={index} {...value}/>)}
  </Terminal>
}

export default Example1;
