import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for offline support
const updateSW = registerSW({
  onNeedRefresh() {
    // Auto-update when new version is available
    console.log('🔄 Nova versão disponível! Atualizando...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('✅ App pronto para funcionar OFFLINE! 🐢');
    
    // Show user-friendly notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #10B981 0%, #047857 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 600;
        animation: slideUp 0.5s ease-out;
      ">
        ✅ Jogo pronto para funcionar sem internet! 🐢
      </div>
      <style>
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.transition = 'opacity 0.5s';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  },
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    console.log('📱 Service Worker registrado com sucesso!', registration);
  },
  onRegisterError(error: unknown) {
    console.error('❌ Erro ao registrar Service Worker:', error);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
