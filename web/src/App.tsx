import { Analytics } from '@vercel/analytics/react';

import example1 from './assets/harmor_1_n.mp4'
import example2 from './assets/harmor_2_n.mp4'
import bg from './assets/bg.svg'
import githubIcon from './assets/github-icon.svg'
import TemplateExampleCode from './examples/TemplateExampleCode.tsx';

const Separator = () => <div style={{
  background: `url(${bg})`,
  height: '6px',
  opacity: 0.8,
  borderRadius: '10px',
  width: '100px',
  margin: '40px auto 60px',
}}/>


const GithubIcon = () => <a href="https://github.com/frontegg/harmor" style={{
  background: `url(${githubIcon})`,
  height: '100px',
  width: '100px',
  display: 'block',
  position: 'fixed',
  right: 0,
  top: 0,
}}/>


function App() {
  return (
    <>
      <div className="container">
        <div className="relative mb-16 max-w-4xl z-30 text-center mx-auto pt-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight pt-8 mb-8">🛡️ HARmor</h1>
          <br/>
          <br/>
          <div className="pb-8 leading-relaxed max-w-[50rem] text-2xl mx-auto">
            Ever find yourself navigating the maze of HAR files, worrying about the hidden risks they might pose? Ever
            wished there was a shield to guard against unintended data exposures? Your search ends with <b>HARmor</b>.
            <br/>
            <br/>
            <br/>
            <span className="font-light text-3xl"> Sanitizing and securing HAR files with precision</span>
          </div>

          <div className="text-center fixed left-8 top-8">
            <a href="https://frontegg.com" target="_blank" rel="noreferrer" className="inline-block">
              <img alt="frontegg logo"
                   width={170}
                   height={32}
                   src="https://frontegg.com/wp-content/themes/frontegg/images/logos/logo-black.svg"/>
            </a>
          </div>


          <Separator/>
          <p className="mt-12 text-left text-lg">
            HAR files are intricate blueprints of web interactions, elegantly capturing a web session's every nuance. In
            the domain of web diagnostics, these files stand as critical repositories, meticulously cataloging
            everything
            from headers to payload content. However, their granular details also make them susceptible to potential
            data
            exposures.
            <br/>

          </p>
          <h2 className="mt-12 text-left font-bold text-3xl">
            Two sophisticated modes for HAR sanitization
          </h2>

          <div className="mt-8 text-left">
            <h3 className="text-xl font-bold mb-3">Direct Sanitization Mode</h3>
            <p>Experience an interactive journey, guiding users through a structured
              questionnaire, ensuring each data point is reviewed and sanitized as needed.</p>

            <div className="mt-4 text-left mb-12">
            <pre style={{
              overflow: 'hidden',
              borderRadius: '8px',
            }}>
              <code className="hljs language-bash" style={{
                background: '#1a1a1a'
              }}>npx harmor@latest ./path-to-har-file.har</code>
            </pre>
            </div>
            <h3 className="text-xs font-bold -mb-6">Demo Video</h3>
            <div className="text-center mt-8">
              <video preload="none" autoPlay loop muted controls={false}>
                <source src={example1} type="video/mp4"/>
              </video>
            </div>
          </div>
          <Separator/>


          <div className="mt-12 text-left mb-12">
            <h3 className="text-xl font-bold mb-3">Template Mode</h3>
            <p>For streamlined efficiency without compromise, employ predefined templates to consistently
              sanitize HAR files across sessions.</p>

            <div className="mt-4 text-left mb-12">
            <pre style={{
              overflow: 'hidden',
              borderRadius: '8px',
            }}>
              <code className="hljs language-bash" style={{
                background: '#1a1a1a'
              }}>npx harmor@latest --template ./path-to-template.json ./path-to-har-file.har</code>
            </pre>

              <h3 className="text-xs font-bold mt-8 mb-2">Example template file:</h3>
              <TemplateExampleCode/>


            </div>

            <h3 className="text-xs font-bold -mb-6">Demo Video</h3>
            <div className="text-center mt-8">
              <video preload="none" autoPlay loop muted controls={false}>
                <source src={example2} type="video/mp4"/>
              </video>
            </div>
          </div>


          <GithubIcon/>
        </div>
      </div>
      <Analytics/>
    </>
  )
}

export default App
