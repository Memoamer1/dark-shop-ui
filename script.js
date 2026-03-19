// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Loading Screen Logic
    const loader = document.getElementById('loader');
    const body = document.body;
    
    // Animate loader away then trigger initial reveal
    setTimeout(() => {
        loader.classList.add('hidden');
        body.classList.remove('loading');
        
        // Trigger hero text reveals
        setTimeout(() => {
            document.querySelectorAll('.reveal-text, .reveal-image').forEach(el => {
                el.classList.add('appear');
            });
        }, 300);
    }, 1800); // simulate 1.8s load

    // 2. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Check if device supports hover
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        // Easing interpolation for outline
        const animateCursor = () => {
            outlineX += (mouseX - outlineX) * 0.2;
            outlineY += (mouseY - outlineY) * 0.2;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Hover effects on interactables
        document.querySelectorAll('.pointer-target').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(255,255,255,0.1)';
                cursorOutline.style.borderColor = 'transparent';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.borderColor = 'rgba(255,255,255,0.4)';
            });
        });
    }

    // 3. Navbar Scroll Effect & Parallax
    const navbar = document.getElementById('navbar');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Simple parallax calculation
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.1;
            const yPos = scrollY * speed;
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.add('active');
            mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
            body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
            body.style.overflow = '';
        }
        lucide.createIcons();
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    }

    // 5. Search Overlay
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.querySelector('.search-input');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        });
    }

    // 6. Interactive Particle Canvas (Hero Background)
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;
        
        const initCanvas = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', initCanvas);
        initCanvas();
        
        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > w) this.x = 0;
                else if (this.x < 0) this.x = w;
                
                if (this.y > h) this.y = 0;
                else if (this.y < 0) this.y = h;
            }
            draw() {
                ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        for (let i = 0; i < 50; i++) particles.push(new Particle());
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // 7. Cart System Logic
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartCountEl = document.getElementById('cart-count');
    
    // Initial dynamic state mapped from HTML
    let cart = [
        { id: '1', name: 'Obsidian Chrono', price: 450, qty: 1, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: '2', name: 'Midnight Series 3', price: 320, qty: 1, img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
    ];

    const toggleCartOverlay = (show) => {
        if (show) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            body.style.overflow = 'hidden';
            renderCart();
        } else {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    };

    if (cartToggle) cartToggle.addEventListener('click', () => toggleCartOverlay(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCartOverlay(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCartOverlay(false));

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color:var(--text-secondary);text-align:center;margin-top:2rem;">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.qty;
                count += item.qty;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls pointer-target">
                            <button class="qty-btn minus" data-id="${item.id}"><i data-lucide="minus"></i></button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn plus" data-id="${item.id}"><i data-lucide="plus"></i></button>
                        </div>
                    </div>
                    <button class="remove-item pointer-target" data-id="${item.id}"><i data-lucide="trash-2"></i></button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
        
        cartSubtotalEl.textContent = `$${total.toFixed(2)}`;
        cartCountEl.textContent = count;
        lucide.createIcons();
        attachCartEvents();
    };

    const attachCartEvents = () => {
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) { item.qty++; renderCart(); }
            });
        });
        
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item && item.qty > 1) { 
                    item.qty--; 
                    renderCart(); 
                } else if (item && item.qty === 1) {
                    cart = cart.filter(i => i.id !== id);
                    renderCart();
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                cart = cart.filter(i => i.id !== id);
                renderCart();
            });
        });
    };
    
    // Make Add to Cart buttons work on Home Page
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.currentTarget.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = parseFloat(card.getAttribute('data-price'));
            const img = card.getAttribute('data-img');
            
            const existing = cart.find(i => i.id === id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ id, name, price, qty: 1, img });
            }
            
            renderCart();
            toggleCartOverlay(true); // Auto open
        });
    });

    renderCart(); // Initial render

    // 8. 3D Tilt Effect on Product Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    // Handle specific high-end 3D tilt tracking mouse
    tiltCards.forEach(card => {
        const inner = card.querySelector('.product-card-inner');
        const glow = card.querySelector('.product-glow');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -12; // Deeper tilt
            const rotateY = ((x - centerX) / centerX) * 12;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--accent-start) 0%, transparent 60%)`;
                glow.style.opacity = '0.7';
                glow.style.transform = 'scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
            if (glow) {
                glow.style.opacity = '0';
                glow.style.transform = 'scale(0.9)';
            }
        });
    });

    // 9. Scroll Appear Animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const checkFade = () => {
        const triggerBottom = window.innerHeight * 0.9;
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('appear');
            }
        });
    };
    
    window.addEventListener('scroll', checkFade);
    // Initial call after loader
    
    // 10. Form submission mock
    const form = document.getElementById('mainContactForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>Message Sent</span><i data-lucide="check-circle"></i>';
            btn.style.background = '#10b981'; // Success green
            lucide.createIcons();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                form.reset();
                lucide.createIcons();
            }, 3000);
        });
    }

});
