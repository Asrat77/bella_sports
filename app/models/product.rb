class Product < ApplicationRecord
  include Badgeable
  include Inventoryable
  include Searchable

  has_one_attached :front_image
  has_one_attached :back_image

  has_many :order_items, dependent: :restrict_with_error

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }

  scope :active, -> { where(active: true) }
  scope :by_category, ->(category) { where(category: category) }
  scope :by_league, ->(league) { where(league: league) }

  # Price formatting helpers
  def price_in_etb
    price / 100.0
  end

  def customization_price_in_etb
    customization_price / 100.0
  end

  def total_price_for_quantity(quantity = 1)
    price * quantity
  end

  def total_price_with_customization(quantity = 1)
    (price + customization_price) * quantity
  end
end
