module Inventoryable
  extend ActiveSupport::Concern

  included do
    has_many :inventory_records, dependent: :destroy
  end

  def stock_for_size(size)
    inventory_records.find_by(size: size)&.quantity || 0
  end

  def update_stock!(size, quantity)
    record = inventory_records.find_or_initialize_by(size: size)
    record.quantity = quantity
    record.save!
  end

  def total_stock
    inventory_records.sum(:quantity)
  end
end
