from flask import Blueprint, request, jsonify

from app.models import Product, Category

products_bp = Blueprint("products", __name__)


@products_bp.get("")
def list_products():
    query = Product.query

    category_slug = request.args.get("category")
    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)

    search = request.args.get("q")
    if search:
        like = f"%{search.strip()}%"
        query = query.filter(Product.name.ilike(like))

    min_price = request.args.get("min_price", type=float)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    max_price = request.args.get("max_price", type=float)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    featured = request.args.get("featured")
    if featured == "true":
        query = query.filter(Product.featured.is_(True))

    sort = request.args.get("sort")
    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 12, type=int)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "items": [p.to_dict() for p in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    })


@products_bp.get("/<slug>")
def get_product(slug):
    product = Product.query.filter_by(slug=slug).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.to_dict())


@products_bp.get("/categories/all")
def list_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return jsonify([c.to_dict() for c in categories])
