"""Seed the database with categories and sports accessory products.
Run with: python seed.py
"""
from app import create_app, db
from app.models import Category, Product

app = create_app()

CATEGORIES = [
    {"name": "Football", "slug": "football"},
    {"name": "Basketball", "slug": "basketball"},
    {"name": "Cricket", "slug": "cricket"},
    {"name": "Running", "slug": "running"},
    {"name": "Fitness", "slug": "fitness"},
    {"name": "Yoga", "slug": "yoga"},
]

PRODUCTS = [
    dict(name="Pro Match Football", slug="pro-match-football", category="football",
         price=1499, compare_at_price=1899, stock=40, brand="Strikeforce", rating=4.6, featured=True,
         image_url="https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600",
         description="FIFA-quality thermo-bonded match ball with all-weather grip."),
    dict(name="Shin Guards Pro", slug="shin-guards-pro", category="football",
         price=799, compare_at_price=999, stock=60, brand="Strikeforce", rating=4.3, featured=False,
         image_url="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600",
         description="Lightweight ergonomic shin guards with compression sleeve."),
    dict(name="Goalkeeper Gloves Elite", slug="goalkeeper-gloves-elite", category="football",
         price=1299, compare_at_price=None, stock=25, brand="Strikeforce", rating=4.7, featured=True,
         image_url="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600",
         description="Latex palm gloves engineered for maximum grip in wet conditions."),

    dict(name="Official Size Basketball", slug="official-size-basketball", category="basketball",
         price=1899, compare_at_price=2199, stock=35, brand="HoopKing", rating=4.8, featured=True,
         image_url="https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600",
         description="Composite leather basketball with deep channel grip, indoor/outdoor."),
    dict(name="High-Top Basketball Shoes", slug="high-top-basketball-shoes", category="basketball",
         price=4999, compare_at_price=5999, stock=20, brand="HoopKing", rating=4.5, featured=True,
         image_url="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600",
         description="Responsive cushioning with ankle support for explosive play."),
    dict(name="Adjustable Hoop System", slug="adjustable-hoop-system", category="basketball",
         price=8999, compare_at_price=None, stock=8, brand="HoopKing", rating=4.4, featured=False,
         image_url="https://images.unsplash.com/photo-1580087433457-9f3cfd6b0339?w=600",
         description="Portable basketball hoop with adjustable height 7.5-10ft."),

    dict(name="English Willow Cricket Bat", slug="english-willow-cricket-bat", category="cricket",
         price=6499, compare_at_price=7499, stock=15, brand="CoverDrive", rating=4.9, featured=True,
         image_url="https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=600",
         description="Grade 1 English willow bat, hand-crafted for power hitters."),
    dict(name="Cricket Batting Pads", slug="cricket-batting-pads", category="cricket",
         price=1999, compare_at_price=None, stock=30, brand="CoverDrive", rating=4.4, featured=False,
         image_url="https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=600",
         description="Lightweight molded batting pads with high-density foam protection."),
    dict(name="Cricket Helmet Titanium", slug="cricket-helmet-titanium", category="cricket",
         price=3499, compare_at_price=3999, stock=18, brand="CoverDrive", rating=4.6, featured=False,
         image_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",
         description="Titanium grille helmet meeting international safety standards."),

    dict(name="AeroFlex Running Shoes", slug="aeroflex-running-shoes", category="running",
         price=3299, compare_at_price=3999, stock=50, brand="Velocity", rating=4.7, featured=True,
         image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
         description="Ultra-light responsive foam sole built for tempo runs."),
    dict(name="Reflective Running Jacket", slug="reflective-running-jacket", category="running",
         price=2199, compare_at_price=None, stock=28, brand="Velocity", rating=4.3, featured=False,
         image_url="https://images.unsplash.com/photo-1483721310020-03333e577078?w=600",
         description="Windproof, water-resistant jacket with 360° reflective piping."),
    dict(name="GPS Running Watch", slug="gps-running-watch", category="running",
         price=7999, compare_at_price=9499, stock=22, brand="Velocity", rating=4.6, featured=True,
         image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
         description="Track pace, distance and heart rate with 14-day battery life."),

    dict(name="Adjustable Dumbbell Set", slug="adjustable-dumbbell-set", category="fitness",
         price=5499, compare_at_price=6299, stock=12, brand="IronCore", rating=4.5, featured=True,
         image_url="https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600",
         description="5-25kg adjustable dumbbells, space-saving quick-lock design."),
    dict(name="Resistance Bands Set", slug="resistance-bands-set", category="fitness",
         price=899, compare_at_price=1199, stock=70, brand="IronCore", rating=4.4, featured=False,
         image_url="https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600",
         description="5-level resistance bands with door anchor and handles."),
    dict(name="Foldable Weight Bench", slug="foldable-weight-bench", category="fitness",
         price=4299, compare_at_price=None, stock=10, brand="IronCore", rating=4.2, featured=False,
         image_url="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600",
         description="Multi-incline foldable bench rated up to 300kg."),

    dict(name="Premium Yoga Mat", slug="premium-yoga-mat", category="yoga",
         price=1299, compare_at_price=1599, stock=45, brand="Zenith", rating=4.8, featured=True,
         image_url="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600",
         description="6mm extra-cushioned non-slip mat with carry strap."),
    dict(name="Yoga Block & Strap Set", slug="yoga-block-strap-set", category="yoga",
         price=699, compare_at_price=None, stock=55, brand="Zenith", rating=4.3, featured=False,
         image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
         description="High-density foam blocks with adjustable D-ring strap."),
]


def run():
    with app.app_context():
        db.drop_all()
        db.create_all()

        slug_to_category = {}
        for c in CATEGORIES:
            cat = Category(name=c["name"], slug=c["slug"])
            db.session.add(cat)
            slug_to_category[c["slug"]] = cat
        db.session.flush()

        for p in PRODUCTS:
            product = Product(
                name=p["name"],
                slug=p["slug"],
                description=p["description"],
                price=p["price"],
                compare_at_price=p.get("compare_at_price"),
                image_url=p["image_url"],
                stock=p["stock"],
                brand=p["brand"],
                rating=p["rating"],
                featured=p["featured"],
                category_id=slug_to_category[p["category"]].id,
            )
            db.session.add(product)

        db.session.commit()
        print(f"Seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")


if __name__ == "__main__":
    run()
