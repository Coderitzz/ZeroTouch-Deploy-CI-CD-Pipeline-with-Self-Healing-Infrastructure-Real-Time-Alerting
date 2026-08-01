from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import CartItem, Product

cart_bp = Blueprint("cart", __name__)


def _current_user_id():
    return int(get_jwt_identity())


@cart_bp.get("")
@jwt_required()
def get_cart():
    items = CartItem.query.filter_by(user_id=_current_user_id()).all()
    total = round(sum(i.quantity * i.product.price for i in items if i.product), 2)
    return jsonify({"items": [i.to_dict() for i in items], "total": total})


@cart_bp.post("")
@jwt_required()
def add_to_cart():
    data = request.get_json() or {}
    product_id = data.get("product_id")
    quantity = max(1, int(data.get("quantity", 1)))

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    if product.stock < quantity:
        return jsonify({"error": "Not enough stock available"}), 400

    item = CartItem.query.filter_by(user_id=_current_user_id(), product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=_current_user_id(), product_id=product_id, quantity=quantity)
        db.session.add(item)

    db.session.commit()
    return jsonify(item.to_dict()), 201


@cart_bp.put("/<int:item_id>")
@jwt_required()
def update_cart_item(item_id):
    item = CartItem.query.filter_by(id=item_id, user_id=_current_user_id()).first()
    if not item:
        return jsonify({"error": "Cart item not found"}), 404

    data = request.get_json() or {}
    quantity = int(data.get("quantity", item.quantity))
    if quantity < 1:
        return jsonify({"error": "Quantity must be at least 1"}), 400

    item.quantity = quantity
    db.session.commit()
    return jsonify(item.to_dict())


@cart_bp.delete("/<int:item_id>")
@jwt_required()
def remove_cart_item(item_id):
    item = CartItem.query.filter_by(id=item_id, user_id=_current_user_id()).first()
    if not item:
        return jsonify({"error": "Cart item not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed"})


@cart_bp.delete("")
@jwt_required()
def clear_cart():
    CartItem.query.filter_by(user_id=_current_user_id()).delete()
    db.session.commit()
    return jsonify({"message": "Cart cleared"})
