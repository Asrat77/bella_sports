class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product, optional: true  # Optional for historical data

  validates :product_snapshot, presence: true
  validates :size, presence: true
  validates :unit_price, presence: true, numericality: { greater_than: 0 }
  validates :quantity, presence: true, numericality: { greater_than: 0 }

  before_save :calculate_line_total

  private

  def calculate_line_total
    self.line_total = unit_price * quantity
  end
end
