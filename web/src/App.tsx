import { Analytics } from '@vercel/analytics/react';

import example1 from './assets/harmor_1_n.mp4'
import example2 from './assets/harmor_2_n.mp4'

const Separator = () => <div style={{
  background: 'url(/src/assets/bg.svg)',
  height: '6px',
  opacity: 0.5,
  borderRadius: '10px',
  width: '100px',
  margin: '40px auto 60px',
}}/>

function App() {
  return (
    <>
      <div className="container">
        <div className="relative mb-16 max-w-4xl z-30 text-center mx-auto pt-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight pt-8 mb-8">🛡️ Harmor</h1>
          <br/>
          <br/>
          <div className="pb-8 leading-relaxed max-w-[50rem] text-2xl mx-auto">
            Ever find yourself navigating the maze of HAR files, worrying about the hidden risks they might pose? Ever
            wished there was a shield to guard against unintended data exposures? Your search ends with <b>Harmor</b>.
            <br/>
            <br/>
            <br/>
            <span className="font-light text-3xl"> Sanitizing and securing HAR files with precision</span>
          </div>

          <div className="text-center fixed left-8 top-8">
            <a href="https://frontegg.com" target="_blank" rel="noreferrer" className="inline-block">
              <img alt="frontegg logo"
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
          <h2 className="mt-12 text-left font-bold text-2xl">
            Two sophisticated modes for HAR sanitization:
          </h2>

          <div className="mt-8 text-left">
            <h3 className="text-xl font-bold mb-3">Direct Sanitization Mode</h3>
            <p>Experience an interactive journey, guiding users through a structured
              questionnaire, ensuring each data point is reviewed and sanitized as needed.</p>

            <div className="text-center mt-8">
              <video src={example1} autoPlay loop muted controls={false}/>
              {/*<Example1/>*/}
            </div>
          </div>
          <div className="mt-12 text-left mb-12">
            <h3 className="text-xl font-bold mb-3">Template Mode</h3>
            <p>For streamlined efficiency without compromise, employ predefined templates to consistently
              sanitize HAR files across sessions.</p>

            <div className="text-center mt-8">
              <video src={example2} autoPlay loop muted controls={false}/>
              {/*<Example1/>*/}
            </div>
          </div>

          <Separator/>
        </div>
      </div>
      <Analytics/>
    </>
  )
}

export default App
