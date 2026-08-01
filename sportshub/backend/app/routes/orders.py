from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import CartItem, Order, OrderItem

orders_bp = Blueprint("orders", __name__)


def _current_user_id():
    return int(get_jwt_identity())


@orders_bp.get("")
@jwt_required()
def list_orders():
    orders = Order.query.filter_by(user_id=_current_user_id()).order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@orders_bp.get("/<int:order_id>")
@jwt_required()
def get_order(order_id):
    order = Order.query.filter_by(id=order_id, user_id=_current_user_id()).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order.to_dict())


@orders_bp.post("/checkout")
@jwt_required()
def checkout():
    user_id = _current_user_id()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Your cart is empty"}), 400

    data = request.get_json() or {}
    required_fields = ["shipping_name", "shipping_address", "shipping_city", "shipping_zip", "shipping_phone"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field.replace('_', ' ')} is required"}), 400

    for ci in cart_items:
        if not ci.product or ci.product.stock < ci.quantity:
            return jsonify({"error": f"'{ci.product.name if ci.product else 'item'}' is out of stock"}), 400

    total = round(sum(ci.quantity * ci.product.price for ci in cart_items), 2)

    order = Order(
        user_id=user_id,
        total=total,
        status="confirmed",
        shipping_name=data["shipping_name"],
        shipping_address=data["shipping_address"],
        shipping_city=data["shipping_city"],
        shipping_zip=data["shipping_zip"],
        shipping_phone=data["shipping_phone"],
    )
    db.session.add(order)
    db.session.flush()

    for ci in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=ci.product.id,
            product_name=ci.product.name,
            price=ci.product.price,
            quantity=ci.quantity,
        )
        ci.product.stock -= ci.quantity
        db.session.add(order_item)
        db.session.delete(ci)

    db.session.commit()
    return jsonify(order.to_dict()), 201
