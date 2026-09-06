import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// 새 배포가 감지되면 서비스워커가 조용히 교체되고, 교체 즉시 페이지를 새로고침해서
// 사용자가 예전 버전을 계속 보는 일이 없게 한다.
registerSW({ immediate: true })
if ('serviceWorker' in navigator) {
  let reloaded = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return
    reloaded = true
    window.location.reload()
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
