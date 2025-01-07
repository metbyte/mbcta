// Default configuratie
const defaultConfig = {
  widgetId: "", // Verplicht parameter
  buttonPosition: {
    bottom: "20px",
    right: "20px",
  },
  framePosition: {
    bottom: "0px",
    right: "0px",
  },
  colors: {
    buttonBackground: "#2563eb",
    buttonColor: "white",
  },
  size: {
    frameWidth: "100vw",
    frameHeight: "100dvh",
  },
  baseUrl: "https://login.slimmerewebsite.nl/widget/",
  zIndexes: {
    button: 100001,
    framebg: 100000,
    frame: 100002,
  },
};

// Functie om widget te initialiseren met custom config
window.initChatWidget = function (customConfig) {
  if (!customConfig.widgetId) {
    console.error("Widget ID is required");
    return;
  }

  // Merge custom config met defaults
  const config = {
    ...defaultConfig,
    ...customConfig,
    buttonPosition: {
      ...defaultConfig.buttonPosition,
      ...customConfig.buttonPosition,
    },
    framePosition: {
      ...defaultConfig.framePosition,
      ...customConfig.framePosition,
    },
    colors: { ...defaultConfig.colors, ...customConfig.colors },
    size: { ...defaultConfig.size, ...customConfig.size },
    zIndexes: { ...defaultConfig.zIndexes, ...customConfig.zIndexes },
    teaser: customConfig.teaser,
  };

  // Genereer dynamische styles
  const styles = `
          .chat-widget-button {
            position: fixed;
            bottom: ${config.buttonPosition.bottom};
            right: ${config.buttonPosition.right};
            padding: 12px;
            border-radius: 100px;
            background: ${config.colors.buttonBackground};
            color: ${config.colors.buttonColor};
            cursor: pointer;
            border: none;
            padding: 10px 16px;
            width: auto;
            height: ${config.size.buttonSize};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: ${config.zIndexes.button};
            border: 1px solid rgb(255 255 255 / 15%) !important;
          }
    
          .chat-widget-frame {
            position: fixed;
            bottom:  ${config.framePosition.bottom};
            right:  ${config.framePosition.right};
            z-index: ${config.zIndexes.frame};
            width:  ${config.size.frameWidth};
            height:  ${config.size.frameHeight};
            border: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s;
          }
          
          
    
          
          span.chat-widget-notificatie {
        width: 25px;
        font-size: 13px;
        height: 25px;
        position: absolute;
        top: -8px;
        right: -8px;
        background: #D43F25;
        border-radius: 1000px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
    }
    
    .chat-wiget-icons {
        display: flex;
        gap: 3px;
        padding-right: 5px;
        border-right: 1px solid #ffffff45;
    }
    
    button.chat-widget-button {
        display: flex;
        gap: 5px;
    }
    
    
    span.chat-widget-text {
        position: absolute;
        top: -18px;
        right: 0px;
        background: white;
        padding: 10px 18px;
        color: black;
        border: 1px solid #00000024;
        border-radius: 12px 12px 2px 12px;
        transform: translateY(-70%);
        opacity: 0;
        box-shadow: 0px 0px 40px -10px #00000029;
        animation: teeaser .5s ease-out forwards;
        animation-delay: 2s;
    }
    
    @keyframes teeaser {
        0% {
            transform: translateY(-70%);
            opacity: 0;
        }
        100% {
            transform: translateY(-100%);
            opacity: 1;
        }
    }
    
    .chat-widget-bg {
        position: fixed;
        pointer-events: none;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
         z-index: ${config.zIndexes.framebg};
        transition: .5s ease;
        background: #0000008a;
        backdrop-filter: blur(6px);
        webkit-backdrop-filter: blur(6px);
    }
    
    .chat-widget-bg.visible {
        opacity: 1;
    }
    
          .chat-widget-frame.visible {
            opacity: 1;
            visibility: visible;
          }
          
          .chat-widget-close-trigger {
            cursor: pointer;
          }
        `;

  // Widget state
  let isOpen = false;
  const CLOSE_TRIGGER_CLASS = "chat-widget-close-trigger";

  // Voeg styles toe
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Maak button
  const button = document.createElement("button");
  button.className = "chat-widget-button";
  button.innerHTML = `
        <span class="chat-widget-notificatie">1</span>
        <div class="chat-wiget-icons">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.875 4.09167C15.1109 3.32009 14.2009 2.70831 13.198 2.29197C12.195 1.87564 11.1193 1.66307 10.0334 1.66667C5.48337 1.66667 1.77504 5.375 1.77504 9.925C1.77504 11.3833 2.15837 12.8 2.87504 14.05L1.70837 18.3333L6.08337 17.1833C7.29171 17.8417 8.65004 18.1917 10.0334 18.1917C14.5834 18.1917 18.2917 14.4833 18.2917 9.93334C18.2917 7.725 17.4334 5.65 15.875 4.09167ZM10.0334 16.7917C8.80004 16.7917 7.59171 16.4583 6.53337 15.8333L6.28337 15.6833L3.68337 16.3667L4.37504 13.8333L4.20837 13.575C3.523 12.4809 3.15914 11.2161 3.15837 9.925C3.15837 6.14167 6.24171 3.05834 10.025 3.05834C11.8584 3.05834 13.5834 3.775 14.875 5.075C15.5147 5.71156 16.0216 6.46879 16.3664 7.30278C16.7111 8.13677 16.8869 9.03091 16.8834 9.93334C16.9 13.7167 13.8167 16.7917 10.0334 16.7917ZM13.8 11.6583C13.5917 11.5583 12.575 11.0583 12.3917 10.9833C12.2 10.9167 12.0667 10.8833 11.925 11.0833C11.7834 11.2917 11.3917 11.7583 11.275 11.8917C11.1584 12.0333 11.0334 12.05 10.825 11.9417C10.6167 11.8417 9.95004 11.6167 9.16671 10.9167C8.55004 10.3667 8.14171 9.69167 8.01671 9.48334C7.90004 9.275 8.00004 9.16667 8.10837 9.05834C8.20004 8.96667 8.31671 8.81667 8.41671 8.7C8.51671 8.58334 8.55837 8.49167 8.62504 8.35834C8.69171 8.21667 8.65837 8.1 8.60837 8C8.55837 7.9 8.14171 6.88334 7.97504 6.46667C7.80837 6.06667 7.63337 6.11667 7.50837 6.10834H7.10837C6.96671 6.10834 6.75004 6.15834 6.55837 6.36667C6.37504 6.575 5.84171 7.075 5.84171 8.09167C5.84171 9.10834 6.58337 10.0917 6.68337 10.225C6.78337 10.3667 8.14171 12.45 10.2084 13.3417C10.7 13.5583 11.0834 13.6833 11.3834 13.775C11.875 13.9333 12.325 13.9083 12.6834 13.8583C13.0834 13.8 13.9084 13.3583 14.075 12.875C14.25 12.3917 14.25 11.9833 14.1917 11.8917C14.1334 11.8 14.0084 11.7583 13.8 11.6583Z" fill="white"/>
    </svg>
    
    
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 1.66669V5.00002M13.3333 1.66669V5.00002M2.5 8.33335H17.5M6.66667 11.6667H6.675M10 11.6667H10.0083M13.3333 11.6667H13.3417M6.66667 15H6.675M10 15H10.0083M13.3333 15H13.3417M4.16667 3.33335H15.8333C16.7538 3.33335 17.5 4.07955 17.5 5.00002V16.6667C17.5 17.5872 16.7538 18.3334 15.8333 18.3334H4.16667C3.24619 18.3334 2.5 17.5872 2.5 16.6667V5.00002C2.5 4.07955 3.24619 3.33335 4.16667 3.33335Z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    
        <span class="chat-widget-text">Chat met onze AI</span>
          </svg> 
        `;
  document.body.appendChild(button);

  // Maak background
  const framebg = document.createElement("div");
  framebg.className = "chat-widget-bg";
  document.body.appendChild(framebg);

  console.log(config.teaser.toString().length);
  console.log(config.teaser);

  // Maak teaser

  const teaser = document.createElement("div");
  teaser.className = "chat-teaser";
  teaser.innerText = config.teaser;

  if (config.teaser.length > 0) {
    button.appendChild(teaser);
  }

  // Maak iframe
  const frame = document.createElement("iframe");
  frame.className = "chat-widget-frame";
  frame.src = `${config.baseUrl}${config.widgetId}`;
  document.body.appendChild(frame);

  const openChat = () => {
    isOpen = true;
    frame.classList.add("visible");
    framebg.classList.add("visible");
    // Start sending OPEN_CHAT messages until acknowledged
    let retryCount = 0;
    const maxRetries = 50; // 5 seconden maximum
    const retryInterval = setInterval(() => {
      frame.contentWindow.postMessage({ type: "OPEN_CHAT" }, "*");
      retryCount++;

      if (retryCount >= maxRetries) {
        clearInterval(retryInterval);
      }
    }, 100);

    // Clear interval when app acknowledges
    const handleAcknowledge = (event) => {
      if (event.data.type === "CHAT_OPENED") {
        clearInterval(retryInterval);
        window.removeEventListener("message", handleAcknowledge);
      }
    };
    window.addEventListener("message", handleAcknowledge);
  };

  const closeChat = () => {
    isOpen = false;
    frame.classList.remove("visible");
    framebg.classList.remove("visible");
    frame.contentWindow.postMessage({ type: "CLOSE_CHAT" }, "*");
  };

  const toggleChat = (event) => {
    event.stopPropagation();
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  // Event listeners
  button.addEventListener("click", toggleChat);

  document.addEventListener("click", (event) => {
    if (
      isOpen &&
      !frame.contains(event.target) &&
      !button.contains(event.target)
    ) {
      closeChat();
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains(CLOSE_TRIGGER_CLASS)) {
      closeChat();
    }
  });

  window.addEventListener("message", (event) => {
    if (event.data.type === "CLOSE_CHAT") {
      closeChat();
    }
  });

  // Expose API
  window.ChatWidget = {
    open: openChat,
    close: closeChat,
    toggle: () => {
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    },
    isOpen: () => isOpen,
    updateConfig: (newConfig) => {
      Object.assign(config, newConfig);
      // Hier kun je logica toevoegen om de widget dynamisch te updaten
    },
  };
};
