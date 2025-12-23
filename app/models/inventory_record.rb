class InventoryRecord < ApplicationRecord
  belongs_to :product

  validates :size, presence: true
  validates :quantity, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :in_stock, -> { where("quantity > 0") }
  scope :out_of_stock, -> { where(quantity: 0) }
  scope :by_size, ->(size) { where(size: size) }
end
