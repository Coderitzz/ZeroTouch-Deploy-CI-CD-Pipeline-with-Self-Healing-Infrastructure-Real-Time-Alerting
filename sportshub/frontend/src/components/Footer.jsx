export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-chalk">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="font-display text-3xl">
            SPRINT<span className="text-volt">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-chalk/60">
            Gear built for game day. Football, basketball, cricket, running and fitness
            accessories, picked for performance.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-volt">Shop</h4>
          <ul className="space-y-2 text-sm text-chalk/70">
            <li>Football</li>
            <li>Basketball</li>
            <li>Cricket</li>
            <li>Running</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-volt">Support</h4>
          <ul className="space-y-2 text-sm text-chalk/70">
            <li>Shipping &amp; returns</li>
            <li>Size guide</li>
            <li>Contact us</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-volt">Stay in the game</h4>
          <p className="text-sm text-chalk/60">Drop your email for restock alerts and drops.</p>
        </div>
      </div>
      <div className="border-t border-ink-light py-4 text-center text-xs text-chalk/40">
        © {new Date().getFullYear()} SPRINT Sports Accessories. All rights reserved.
      </div>
    </footer>
  )
}
