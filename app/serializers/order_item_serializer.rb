class OrderItemSerializer < ApplicationSerializer
  attributes :id,
    :product_name,
    :product_image_url,
    :size,
    :customization_name,
    :customization_number,
    :customization_price,
    :customization_price_formatted,
    :quantity,
    :unit_price,
    :unit_price_formatted,
    :line_total,
    :line_total_formatted

  # Use product_snapshot for immutable data
  def product_name
    object.product_snapshot["name"]
  end

  def product_image_url
    object.product_snapshot["image"]
  end

  def customization_price_formatted
    "#{format_price(object.customization_price)} ETB"
  end

  def unit_price_formatted
    "#{format_price(object.unit_price)} ETB"
  end

  def line_total_formatted
    "#{format_price(object.line_total)} ETB"
  end
end
