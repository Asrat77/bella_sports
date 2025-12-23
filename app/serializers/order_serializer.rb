class OrderSerializer < ApplicationSerializer
  attributes :id,
    :tracking_code,
    :customer_name,
    :customer_phone,
    :email,
    :delivery_method,
    :delivery_fee,
    :delivery_fee_formatted,
    :subtotal,
    :subtotal_formatted,
    :total,
    :total_formatted,
    :payment_method,
    :payment_status,
    :status,
    :estimated_delivery,
    :created_at,
    :updated_at

  has_one :branch, serializer: BranchSerializer
  has_one :order_status, serializer: OrderStatusSerializer
  has_many :order_items, serializer: OrderItemSerializer

  def id
    object.tracking_code
  end

  def delivery_fee_formatted
    "#{format_price(object.delivery_fee)} ETB"
  end

  def subtotal_formatted
    "#{format_price(object.subtotal)} ETB"
  end

  def total_formatted
    "#{format_price(object.total)} ETB"
  end

  def status
    object.order_status&.status || "pending"
  end

  def estimated_delivery
    (object.created_at + 24.hours)&.iso8601  # 24h delivery for Addis Ababa
  end
end
