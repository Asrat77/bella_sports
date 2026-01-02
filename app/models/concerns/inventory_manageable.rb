module InventoryManageable
  extend ActiveSupport::Concern

  included do
    has_many :inventory_transactions, as: :source, dependent: :destroy
  end

  def deduct_inventory!(product, branch, size, quantity)
    record = InventoryRecord.lock.find_or_initialize_by(
      product: product,
      branch: branch,
      size: size
    )

    raise InsufficientStockError, "Insufficient stock for #{product.name} (#{size})" if record.quantity < quantity

    record.with_lock do
      record.quantity -= quantity
      record.save!
    end

    inventory_transactions.create!(
      product: product,
      branch: branch,
      size: size,
      quantity: -quantity,
      source: self
    )

    record
  end

  def add_inventory!(product, branch, size, quantity)
    record = InventoryRecord.lock.find_or_initialize_by(
      product: product,
      branch: branch,
      size: size
    )

    record.with_lock do
      record.quantity += quantity
      record.save!
    end

    inventory_transactions.create!(
      product: product,
      branch: branch,
      size: size,
      quantity: quantity,
      source: self
    )

    record
  end

  class InsufficientStockError < StandardError; end
end
