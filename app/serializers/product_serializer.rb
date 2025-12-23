class ProductSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :price,
    :price_formatted,
    :category,
    :league,
    :customization_price,
    :customization_price_formatted,
    :description,
    :active,
    :front_image_url,
    :back_image_url,
    :badges,
    :stock_levels

  has_many :product_badges, serializer: ProductBadgeSerializer
  has_many :inventory_records, serializer: InventoryRecordSerializer

  def price_formatted
    "#{format_price(object.price)} ETB"
  end

  def customization_price_formatted
    "#{format_price(object.customization_price)} ETB"
  end

  def front_image_url
    return nil unless object.front_image.attached?
    Rails.application.routes.url_helpers.rails_blob_url(object.front_image, host: ENV["API_HOST"] || "localhost:3000")
  end

  def back_image_url
    return nil unless object.back_image.attached?
    Rails.application.routes.url_helpers.rails_blob_url(object.back_image, host: ENV["API_HOST"] || "localhost:3000")
  end

  def badges
    object.product_badges.pluck(:badge_type)
  end

  def stock_levels
    object.inventory_records.map do |record|
      { size: record.size, quantity: record.quantity }
    end
  end
end
