import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, Menu, ChevronRight, Trophy, Users, Zap, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const BACKGROUND_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_694daa97b31a16208cc8bbd5/bb08d8599_bg.png";
const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_694daa97b31a16208cc8bbd5/2a35a0ff1_logo.png";
const TEAM_PRAISE_BG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694daabb076688d029e88c89/f67f07e36_Team_Praise_Offical_Background.png";

const products = [
  { id: 1, name: "Praise Divine Tee", price: 34.99, images: ["https://i.imgur.com/XPQwiz0.png","https://i.imgur.com/Rwd03DH.png"], category: "Apparel" },
  { id: 2, name: "Praise Victory Tee", price: 34.99, images: ["https://i.imgur.com/XPQwiz0.png","https://i.imgur.com/4bAFy2l.png"], category: "Apparel" },
  { id: 3, name: "Praise Ascend Hoodie", price: 49.99, images: ["https://i.imgur.com/0cclA3G.png","https://i.imgur.com/FvK8GSG.png"], category: "Apparel" },
  { id: 4, name: "Praise Chrome Essential Hoodie (Black)", price: 49.99, images: ["https://files.tapstitch.com/hugepod/material/custom_printing/9273196b98b445a3a076406b471fa325.png","https://files.tapstitch.com/hugepod/material/custom_printing/f2d4026c50a346c5a0f6a56fd2f707a9.png"], category: "Apparel" },
  { id: 5, name: "Praise Chrome Essential Hoodie (Pink)", price: 49.99, images: ["https://files.tapstitch.com/hugepod/material/custom_printing/fee87434bce04a1784b81e1a4a7427bc.png","https://files.tapstitch.com/hugepod/material/custom_printing/7df40fa2381f4d7bbd1328f7ff08c270.png"], category: "Apparel" }
];

const roster = [
  { id: 3, name: "Praise Vera", role: "Founder", image: "https://cdn.discordapp.com/avatars/1177450703871037502/e20c54f4596640356f07ba58529d438e.png" },
  { id: 4, name: "Praise Allen", role: "Owner", image: "https://cdn.discordapp.com/attachments/1458819037654941756/1459947399832408134/af580da595a1afbcdfa64511737eeebb.png?ex=69652178&is=6963cff8&hm=eff539a7fcabee3b3ff1f9f5dd98c8504c86352df7e2fa087bfc092a62f0f543&" },
  { id: 1, name: "Praise Dan", role: "owner", image: "https://cdn.discordapp.com/avatars/966725422861656136/f3d9b99a9e7e517e04e2328084927ac2.png" },
  { id: 2, name: "Praise Spry", role: "Co-Founder", image: "https://cdn.discordapp.com/avatars/663719314125357075/a9c08457ea44a18ad7556eae01305480.png" }
];

const values = [
  { icon: Trophy, title: "Excellence", description: "Striving for the highest standards in everything we do" },
  { icon: Users, title: "Community", description: "Building strong connections with fans and players" },
  { icon: Zap, title: "Innovation", description: "Pushing boundaries and embracing new opportunities" },
  { icon: Heart, title: "Passion", description: "Driven by our love for gaming and competition" }
];

export default function Store() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lightbox
  const [lightbox, setLightbox] = useState<{ productIndex: number; imageIndex: number } | null>(null);
  const openLightbox = (productIndex: number, imageIndex = 0) => setLightbox({ productIndex, imageIndex });
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => {
    if (!lightbox) return;
    const product = products[lightbox.productIndex];
    const newIndex = (lightbox.imageIndex - 1 + product.images.length) % product.images.length;
    setLightbox({ productIndex: lightbox.productIndex, imageIndex: newIndex });
  };
  const nextImage = () => {
    if (!lightbox) return;
    const product = products[lightbox.productIndex];
    const newIndex = (lightbox.imageIndex + 1) % product.images.length;
    setLightbox({ productIndex: lightbox.productIndex, imageIndex: newIndex });
  };

  // Cart
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1, image: product.images[0] }];
    });
  };
  const updateQuantity = (productId, delta) => setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout
  const handleCheckout = async () => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        })
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      alert("Checkout failed.");
    }
  };

  const scrollToSection = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ backgroundImage: `url(${BACKGROUND_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="fixed inset-0 bg-black/40 pointer-events-none" />


      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Praise Esports" className="h-8 w-auto" />
              <div className="hidden sm:block">
                <div className="text-xs font-medium text-black tracking-wider">TEAM</div>
                <div className="text-sm font-bold text-black tracking-wider -mt-1">PRAISE</div>
              </div>
            </div>

            <ul className="hidden md:flex items-center gap-8">
              {['home', 'about', 'products', 'roster'].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className="text-sm font-medium text-black hover:text-gray-600 transition-colors capitalize"
                  >
                    {section === 'products' ? 'Shop' : section === 'roster' ? 'Roster' : section}
                  </button>
                </li>
              ))}
              <li>
                <button className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
                  Contact
                </button>
              </li>
            </ul>

            <div className="flex items-center gap-4">
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ShoppingBag className="w-6 h-6 text-black" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="bg-[#111] border-white/10 text-white w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="text-white text-xl">Your Cart</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
                    {cart.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-gray-400">
                        Your cart is empty
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {cart.map(item => (
                          <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-lg">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-gray-400 text-sm">${item.price.toFixed(2)}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white/10 rounded">
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white/10 rounded">
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1 hover:bg-red-500/20 rounded text-red-400">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-semibold mb-4">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button
                        className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                      >
                        Checkout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-gray-200 overflow-hidden bg-white"
              >
                <ul className="py-4 space-y-2">
                  {['home', 'about', 'products', 'roster'].map((section) => (
                    <li key={section}>
                      <button
                        onClick={() => scrollToSection(section)}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition-colors capitalize"
                      >
                        {section === 'products' ? 'Shop' : section === 'roster' ? 'Roster' : section}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition-colors">
                      Contact
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* HOME SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="relative z-10 text-center w-full max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
              <div className="relative aspect-video w-full">
                <img src={TEAM_PRAISE_BG} alt="Team Praise" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={LOGO_URL} alt="Praise Esports Logo" className="h-24 md:h-32 w-auto drop-shadow-2xl" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-white">
                  TEAM PRAISE
                </h2>
                <div className="h-px w-32 mx-auto bg-white/30" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Gear Up for Victory
              </h1>
            </div>

            <Button onClick={() => scrollToSection('products')} className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 text-base md:text-lg mt-8">
              Shop Now
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ABOUT + ROSTER SECTION */}
      <section id="about" className="relative py-24 px-4">
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Praise Esports</h2>

            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 mb-12">
              <h3 className="text-xl md:text-2xl font-semibold mb-4">Our Story</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Praise Esports is a premier esports organization dedicated to excellence in competitive gaming.
                Founded with a passion for gaming and a commitment to building a strong community, we've grown
                from a small team of dedicated players to a recognized name in the esports world.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our mission is to inspire, compete, and connect gamers worldwide. We believe in fostering talent,
                supporting our community, and representing the best of what esports has to offer.
              </p>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-center mb-8">Our Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:border-white/30 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-center mb-8">Our Team</h3>
            <div id="roster" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {roster.map(player => (
                <div key={player.id} className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                  <img src={player.image} alt={player.name} className="w-24 h-24 mx-auto rounded-full mb-2 object-cover" />
                  <h4 className="font-semibold">{player.name}</h4>
                  <p className="text-sm text-gray-400">{player.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
                
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 text-center mb-12">
  <h3 className="text-xl md:text-2xl font-semibold mb-4">Join Us</h3>
  <p className="text-gray-300 max-w-2xl mx-auto">
    Whether you're a fan, a player, or just someone who loves esports, we welcome you to be part
    of the Praise Esports family. Support us by wearing our gear and representing our brand!
  </p>
</div>

 {/* PRODUCTS SECTION */}
      <section id="products" className="relative py-32 px-6">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-20">Featured Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {products.map((product, productIndex) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: productIndex * 0.1 }}
                  className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-colors shadow-xl"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-72 object-cover mb-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => openLightbox(productIndex, 0)}
                  />
                  <h4 className="text-xl font-semibold mb-3">{product.name}</h4>
                  <p className="text-gray-300 text-lg mb-6">${product.price.toFixed(2)}</p>
                  <Button className="w-full text-lg py-4 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          >
            <motion.img
              key={products[lightbox.productIndex].images[lightbox.imageIndex]}
              src={products[lightbox.productIndex].images[lightbox.imageIndex]}
              alt={products[lightbox.productIndex].name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[80%] max-w-[80%] rounded-xl shadow-2xl"
            />
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white text-3xl hover:text-red-500 transition-colors">×</button>
            <button onClick={prevImage} className="absolute left-4 text-white text-4xl hover:text-gray-300 transition-colors">‹</button>
            <button onClick={nextImage} className="absolute right-4 text-white text-4xl hover:text-gray-300 transition-colors">›</button>
          </motion.div>
        )}
      </AnimatePresence>

 {/* SOCIAL FOOTER */}
            <footer className="relative border-t border-white/10 bg-black/80 backdrop-blur-sm">
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src={LOGO_URL} alt="Revil Esports" className="h-8 w-auto" />
                                <span className="font-bold tracking-wider">Praise Esports</span>
                            </div>
                            <p className="text-sm text-gray-400">Official merchandise store for Praise Esports.</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                                <li><button onClick={() => scrollToSection('products')} className="hover:text-white transition-colors">Shop</button></li>
                                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Follow Us</h4>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <a href="https://x.com/praisesportshq?s=21" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                                <a href="https://www.youtube.com/@PraisEsportsHQ" className="text-gray-400 hover:text-white transition-colors">Youtube</a>
                                <a href="https://www.tiktok.com/@praisehq" className="text-gray-400 hover:text-white transition-colors">TikTok</a>
                                <a href="https://discord.gg/fWQ7JM96kJ" className="text-gray-400 hover:text-white transition-colors">Discord</a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
                        <p>© 2025 Revil Esports. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
