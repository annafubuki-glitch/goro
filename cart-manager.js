// Cart Manager for Goró da Mansão - Disruptive Wellness E-Commerce
// Handles state reactive e-commerce flow locally across all pages

(function () {
  // Initialize default cart if empty
  const defaultCart = [
    {
      id: "morango",
      name: "Explosão de Morango",
      price: 18.90,
      qty: 1,
      tag: "Nocturnal Series",
      badge1: "L-THEANINE",
      badge2: "0% SUGAR",
      img: "https://lh3.googleusercontent.com/aida/ADBb0ujzdO7HDXvd5HFKNzT3Ku2ASEi8gWlcgIS198HKFAionBlmqaW1JLDg_iKrMMm-mS3JCKPMuXx05cFjjgL-UDmkvfrGU_9SwCLVxENB8bNPIIb6Vlb-BWkhQVcRDJp0gbsraEkge9ofoy7CbkfFU_tnvhHN9Nwv4ZCf45VI40Btf0q_-vk5icFDPXCyyyCscatcMprAgyDsRbYc5OzIO7QidDjfm3pEAe5Qsv8dOpMMTkh32pW13myhPLE8"
    },
    {
      id: "melancia",
      name: "Refresco de Melancia",
      price: 18.90,
      qty: 2,
      tag: "Rhythm & Flow",
      badge1: "ELECTROLYTES",
      badge2: "HYDRATION+",
      img: "https://lh3.googleusercontent.com/aida/ADBb0ui2otttq9hyY50ZkDaaMn9XhsppZLeBmr9tYAzSu5R1SsxPjGzmkHullwszkhncLEdvw5I4eiZgYaqACRj5xUkmSR2octw9R8dxNUZOTQ0Vb0ei4A7YT2zP3yLF9v7Rr8t6u7DYyFARFX_lsAAQAPgPi0eeRviTQV_QIZcp-MR35zQHMQ17JzHOZHyGxFVHntxMvf2khAKURoE7lwJw9oHzLaWQ3a6J9BD9sWCIRfd6_1xOywNoI64aEtii"
    },
    {
      id: "maca",
      name: "Acidez Perfeita",
      price: 18.90,
      qty: 1,
      tag: "Electric Energy",
      badge1: "B-COMPLEX",
      badge2: "CAFFEINE FREE",
      img: "https://lh3.googleusercontent.com/aida/ADBb0ujZDoeazqDQDivkk0wAPdEYwNOGwqUycSP6-4U0QENZhsKsB543_bhwFxhleNVWocfg_Ee0iWlOZ_OAK_fCaRhFUxVqgycH6pO-kp-Q33veVOeTmQEzFPf8-E-24B5ynJaPSLTA0qui3bRrtDQVftnHYKRCpESwH48p816zepm1T0F9x_a3CA2tNRMAA6rtakozNG6yy79VBKZd9Hw8342cApNXjNl4-AWNIkIKw8Ks22bWhZxVaxA0gDDm"
    }
  ];

  function getCart() {
    try {
      const data = localStorage.getItem("goro_cart");
      return data ? JSON.parse(data) : defaultCart;
    } catch {
      return defaultCart;
    }
  }

  function saveCart(cart) {
    localStorage.setItem("goro_cart", JSON.stringify(cart));
    updateCartBadges();
  }

  function getCartTotalItems(cart) {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  }

  function getCartTotalPrice(cart) {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  // Reactive Badge Updater for all pages
  function updateCartBadges() {
    const cart = getCart();
    const totalQty = getCartTotalItems(cart);
    
    // Find badge element in navigation
    const badges = document.querySelectorAll("nav span.absolute, nav button span.absolute");
    badges.forEach(b => {
      b.textContent = totalQty;
      b.style.display = totalQty > 0 ? "flex" : "none";
    });
  }

  // Intercept Navigation & Brand links
  function setupNavigation() {
    // Brand logos
    const logos = document.querySelectorAll("nav div.font-headline-display, nav a.font-headline-display");
    logos.forEach(logo => {
      logo.style.cursor = "pointer";
      logo.onclick = (e) => {
        e.preventDefault();
        window.location.href = "/";
      };
    });

    // Sabores links
    const saboresLinks = Array.from(document.querySelectorAll("nav a, footer a")).filter(
      a => a.textContent.trim().toLowerCase() === "sabores" || a.textContent.trim().toLowerCase() === "sabores disponíveis"
    );
    saboresLinks.forEach(link => {
      link.href = "/sabores";
      link.onclick = (e) => {
        e.preventDefault();
        window.location.href = "/sabores";
      };
    });

    // Cart Button Click
    const cartButtons = document.querySelectorAll("nav button");
    cartButtons.forEach(btn => {
      const isCart = btn.querySelector("span")?.textContent.trim() === "shopping_bag" || btn.querySelector("span")?.getAttribute("data-icon") === "shopping_bag" || btn.querySelector("span.absolute") !== null;
      if (isCart) {
        btn.onclick = (e) => {
          e.preventDefault();
          window.location.href = "/sacola";
        };
      }
    });
  }

  // Initialize page specific functionality
  const path = window.location.pathname;

  // HOME PAGE
  if (path === "/" || path === "/index.html") {
    // Connect Hero buttons
    const heroBtnBuy = document.querySelector("main section button.bg-secondary-container");
    if (heroBtnBuy) {
      heroBtnBuy.onclick = () => window.location.href = "/sabores";
    }
    const heroBtnView = document.querySelector("main section button.border-on-surface");
    if (heroBtnView) {
      heroBtnView.onclick = () => window.location.href = "/sabores";
    }

    // Connect SIPs flavors Conhecer buttons
    const SipButtons = document.querySelectorAll("main section.py-stack-lg button");
    SipButtons.forEach(btn => {
      btn.onclick = () => window.location.href = "/sabores";
    });

    // Connect final CTA button
    const finalCta = document.querySelector("section.py-stack-lg button.bg-secondary-container");
    if (finalCta) {
      finalCta.onclick = () => window.location.href = "/sabores";
    }
  }

  // SABORES / CATALOG PAGE
  else if (path === "/sabores") {
    // Intercept buy buttons on catalog
    const productCards = document.querySelectorAll(".product-card-hover");
    productCards.forEach((card, idx) => {
      const buyBtn = card.querySelector("button");
      if (buyBtn) {
        buyBtn.textContent = "Adicionar à Sacola";
        buyBtn.onclick = (e) => {
          e.preventDefault();
          
          let id = "morango";
          let name = "Explosão de Morango";
          let tag = "Nocturnal Series";
          let badge1 = "L-THEANINE";
          let badge2 = "0% SUGAR";
          let img = "https://lh3.googleusercontent.com/aida/ADBb0ujzdO7HDXvd5HFKNzT3Ku2ASEi8gWlcgIS198HKFAionBlmqaW1JLDg_iKrMMm-mS3JCKPMuXx05cFjjgL-UDmkvfrGU_9SwCLVxENB8bNPIIb6Vlb-BWkhQVcRDJp0gbsraEkge9ofoy7CbkfFU_tnvhHN9Nwv4ZCf45VI40Btf0q_-vk5icFDPXCyyyCscatcMprAgyDsRbYc5OzIO7QidDjfm3pEAe5Qsv8dOpMMTkh32pW13myhPLE8";
          
          if (idx === 1) {
            id = "melancia";
            name = "Refresco de Melancia";
            tag = "Rhythm & Flow";
            badge1 = "ELECTROLYTES";
            badge2 = "HYDRATION+";
            img = "https://lh3.googleusercontent.com/aida/ADBb0ui2otttq9hyY50ZkDaaMn9XhsppZLeBmr9tYAzSu5R1SsxPjGzmkHullwszkhncLEdvw5I4eiZgYaqACRj5xUkmSR2octw9R8dxNUZOTQ0Vb0ei4A7YT2zP3yLF9v7Rr8t6u7DYyFARFX_lsAAQAPgPi0eeRviTQV_QIZcp-MR35zQHMQ17JzHOZHyGxFVHntxMvf2khAKURoE7lwJw9oHzLaWQ3a6J9BD9sWCIRfd6_1xOywNoI64aEtii";
          } else if (idx === 2) {
            id = "maca";
            name = "Acidez Perfeita";
            tag = "Electric Energy";
            badge1 = "B-COMPLEX";
            badge2 = "CAFFEINE FREE";
            img = "https://lh3.googleusercontent.com/aida/ADBb0ujZDoeazqDQDivkk0wAPdEYwNOGwqUycSP6-4U0QENZhsKsB543_bhwFxhleNVWocfg_Ee0iWlOZ_OAK_fCaRhFUxVqgycH6pO-kp-Q33veVOeTmQEzFPf8-E-24B5ynJaPSLTA0qui3bRrtDQVftnHYKRCpESwH48p816zepm1T0F9x_a3CA2tNRMAA6rtakozNG6yy79VBKZd9Hw8342cApNXjNl4-AWNIkIKw8Ks22bWhZxVaxA0gDDm";
          }
          
          const cart = getCart();
          const existing = cart.find(item => item.id === id);
          if (existing) {
            existing.qty += 1;
          } else {
            cart.push({ id, name, price: 18.90, qty: 1, tag, badge1, badge2, img });
          }
          saveCart(cart);
          
          // Toast Notification
          showToast(`Adicionado ${name} à sacola!`);
        };
      }
    });

    const heroBtnBuy = document.querySelector("header button.bg-secondary-container");
    if (heroBtnBuy) {
      heroBtnBuy.onclick = () => {
        document.querySelector("section").scrollIntoView({ behavior: "smooth" });
      };
    }
  }

  // SACOLA / CART PAGE
  else if (path === "/sacola") {
    // Intercept checkout redirect
    const checkoutBtn = document.querySelector("aside button");
    if (checkoutBtn) {
      checkoutBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = "/checkout";
      };
    }

    // Dynamic Cart Rendering
    renderCartPage();

    function renderCartPage() {
      const cart = getCart();
      const itemsList = document.querySelector("main section.lg:col-span-8");
      if (!itemsList) return;
      
      // Clear items
      const existingItems = itemsList.querySelectorAll(".glass-card");
      existingItems.forEach(el => el.remove());
      
      if (cart.length === 0) {
        const emptyMsg = document.createElement("div");
        emptyMsg.className = "glass-card p-12 text-center space-y-6";
        emptyMsg.innerHTML = `
          <span class="material-symbols-outlined text-6xl text-on-surface-variant opacity-40">shopping_bag</span>
          <h3 class="font-headline-lg-mobile text-2xl uppercase">Sua sacola está vazia</h3>
          <p class="font-body-md text-on-surface-variant max-w-sm mx-auto">Adicione alguns sips de elite para começar a sua redução de danos.</p>
          <button class="bg-secondary-container text-on-secondary-fixed px-8 py-4 font-label-caps uppercase sharp-edge" onclick="window.location.href='/sabores'">Ver Sabores</button>
        `;
        itemsList.insertBefore(emptyMsg, itemsList.firstChild);
      } else {
        cart.forEach((item, idx) => {
          let neonColor = "neon-glow-red";
          if (item.id === "melancia") neonColor = "neon-glow-pink";
          if (item.id === "maca") neonColor = "neon-glow-green";

          const itemEl = document.createElement("div");
          itemEl.className = `glass-card ${neonColor} flex items-center p-4 md:p-6 group transition-all duration-500 hover:bg-surface-container-low`;
          itemEl.innerHTML = `
            <div class="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-surface-container-highest overflow-hidden">
              <img alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${item.img}"/>
            </div>
            <div class="ml-6 flex-grow">
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-label-caps text-on-tertiary-container tracking-widest text-[10px] uppercase">${item.tag}</span>
                  <h3 class="font-headline-lg-mobile text-xl md:text-2xl mt-1 uppercase">${item.name}</h3>
                  <div class="flex gap-2 mt-2">
                    <span class="bg-surface-container-highest px-2 py-0.5 text-[10px] font-label-caps text-tertiary tracking-tighter">${item.badge1}</span>
                    <span class="bg-surface-container-highest px-2 py-0.5 text-[10px] font-label-caps text-tertiary tracking-tighter">${item.badge2}</span>
                  </div>
                </div>
                <button class="text-on-surface-variant hover:text-error transition-colors" data-delete="${item.id}">
                  <span class="material-symbols-outlined">delete_outline</span>
                </button>
              </div>
              <div class="flex justify-between items-end mt-4">
                <div class="flex items-center border border-outline-variant/30 px-2 py-1">
                  <button class="w-8 h-8 flex items-center justify-center hover:text-secondary-container transition-colors" data-minus="${item.id}">
                    <span class="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span class="w-8 text-center font-label-caps text-lg">${item.qty}</span>
                  <button class="w-8 h-8 flex items-center justify-center hover:text-secondary-container transition-colors" data-plus="${item.id}">
                    <span class="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <div class="text-right">
                  <p class="text-on-surface-variant font-label-caps text-xs">Unitário: R$ ${item.price.toFixed(2)}</p>
                  <p class="font-headline-lg-mobile text-lg text-primary">R$ ${(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            </div>
          `;
          
          // Attach event listeners inside
          itemEl.querySelector(`[data-delete="${item.id}"]`).onclick = () => deleteItem(item.id);
          itemEl.querySelector(`[data-minus="${item.id}"]`).onclick = () => updateQty(item.id, -1);
          itemEl.querySelector(`[data-plus="${item.id}"]`).onclick = () => updateQty(item.id, 1);

          itemsList.insertBefore(itemEl, itemsList.firstChild);
        });
      }
      
      // Update Summary Sidebar
      updateSummary(cart);
    }

    function updateQty(id, delta) {
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty = Math.max(1, item.qty + delta);
        saveCart(cart);
        renderCartPage();
        triggerMicroInteraction();
      }
    }

    function deleteItem(id) {
      let cart = getCart();
      cart = cart.filter(i => i.id !== id);
      saveCart(cart);
      renderCartPage();
    }

    function updateSummary(cart) {
      const subtotalEl = document.querySelector("aside div.space-y-4 div span.font-label-caps");
      const totalEl = document.querySelector("aside div.flex-between p.text-primary, aside p.text-primary");
      const subtotalLabel = document.querySelector("aside span.text-on-surface-variant");
      
      const totalPrice = getCartTotalPrice(cart);
      const totalItems = getCartTotalItems(cart);
      
      if (subtotalEl) subtotalEl.textContent = `R$ ${totalPrice.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `R$ ${totalPrice.toFixed(2)}`;
      if (subtotalLabel) subtotalLabel.textContent = `Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})`;
    }

    function triggerMicroInteraction() {
      const body = document.body;
      body.style.transition = 'background-color 0.05s';
      body.classList.add('brightness-110');
      setTimeout(() => {
        body.classList.remove('brightness-110');
      }, 50);
    }
  }

  // CHECKOUT PAGE
  else if (path === "/checkout") {
    // Dynamically render checkout list summary
    renderCheckoutSummary();

    function renderCheckoutSummary() {
      const cart = getCart();
      const summaryContainer = document.querySelector("aside div.glass-panel");
      if (!summaryContainer) return;

      // Clear previous list
      const existingItems = summaryContainer.querySelectorAll(".flex.items-center.gap-4");
      existingItems.forEach(el => el.remove());

      const divider = summaryContainer.querySelector(".border-t.border-outline-variant\\/30");

      cart.forEach(item => {
        let icon = "icecream";
        let color = "text-tertiary-fixed-dim";
        if (item.id === "melancia") {
          icon = "water_drop";
          color = "text-secondary-container";
        } else if (item.id === "maca") {
          icon = "eco";
          color = "text-primary";
        }

        const itemEl = document.createElement("div");
        itemEl.className = "flex items-center gap-4 relative z-10";
        itemEl.innerHTML = `
          <div class="w-16 h-16 bg-surface-container-high border border-outline-variant flex items-center justify-center">
            <span class="material-symbols-outlined ${color} text-3xl" style="font-variation-settings: 'FILL' 1;">${icon}</span>
          </div>
          <div class="flex-1">
            <h4 class="font-label-caps text-label-caps uppercase">${item.name}</h4>
            <p class="text-on-surface-variant text-body-md">${item.qty}x Pack (6 Unid.)</p>
          </div>
          <span class="font-label-caps text-label-caps">R$ ${(item.price * item.qty).toFixed(2)}</span>
        `;
        summaryContainer.insertBefore(itemEl, divider);
      });

      // Update total prices
      const totalPrice = getCartTotalPrice(cart);
      const subtotalValEl = summaryContainer.querySelector("div.bg-primary-container div:nth-child(1) span.font-label-caps");
      const totalValEl = summaryContainer.querySelector("div.bg-primary-container div:nth-child(3) span.text-secondary-container");

      if (subtotalValEl) subtotalValEl.textContent = `R$ ${totalPrice.toFixed(2)}`;
      if (totalValEl) totalValEl.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    // Connect confirm button to Success modal overlay
    const confirmBtn = document.querySelector("button.neon-pulse");
    if (confirmBtn) {
      confirmBtn.onclick = (e) => {
        e.preventDefault();
        
        // Show Success Overlay Modal
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.inset = "0";
        modal.style.zIndex = "1000";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.background = "rgba(10, 10, 10, 0.9)";
        modal.style.backdropFilter = "blur(15px)";
        modal.innerHTML = `
          <div class="glass-panel p-12 text-center max-w-md mx-4 border border-secondary-container/40 space-y-6 animate-pulse-neon shadow-[0_0_50px_rgba(44,255,4,0.3)]">
            <div class="w-20 h-20 rounded-full border-2 border-secondary-container flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(44,255,4,0.4)]">
              <span class="material-symbols-outlined text-secondary-container text-5xl">done</span>
            </div>
            <h2 class="font-headline-display text-4xl uppercase text-secondary-container tracking-tighter">PEDIDO CONFIRMADO!</h2>
            <p class="font-body-lg text-on-surface">Seu shape e energia estão a caminho. Redução de danos ativada com sucesso!</p>
            <p class="text-xs text-on-surface-variant italic font-body-md pt-4">"Prepare-se para a noite. Seu kit da Mansão está a caminho."</p>
            <div class="text-secondary-container text-sm font-label-caps animate-pulse">Redirecionando em breve...</div>
          </div>
        `;
        document.body.appendChild(modal);

        // Clear cart and redirect
        localStorage.setItem("goro_cart", JSON.stringify([]));
        
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      };
    }
  }

  // Toast Creator Helper
  function showToast(message) {
    const existing = document.getElementById("goro-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "goro-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.zIndex = "999";
    toast.className = "glass-panel px-6 py-4 border border-secondary-container/40 flex items-center gap-3 text-secondary-container shadow-[0_0_30px_rgba(44,255,4,0.15)] animate-slide-up";
    toast.innerHTML = `
      <span class="material-symbols-outlined">shopping_bag</span>
      <span class="font-label-caps uppercase text-sm">${message}</span>
      <button class="ml-4 text-xs underline font-bold" onclick="window.location.href='/sacola'">IR PARA SACOLA</button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s";
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // Inject dynamic styles for animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slide-up {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up {
      animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;
  document.head.appendChild(style);

  // Initialize
  updateCartBadges();
  setupNavigation();
})();
