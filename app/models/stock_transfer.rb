class StockTransfer < ApplicationRecord
  include InventoryManageable

  belongs_to :from_branch, class_name: "Branch"
  belongs_to :to_branch, class_name: "Branch"
  belongs_to :product
  belongs_to :created_by_admin, class_name: "Admin"

  validates :from_branch, presence: true
  validates :to_branch, presence: true
  validates :product, presence: true
  validates :size, presence: true
  validates :quantity, presence: true, numericality: { greater_than: 0 }

  after_create :execute_transfer

  def execute_transfer
    transaction do
      from_record = InventoryRecord.lock.find_or_initialize_by(
        product: product,
        branch: from_branch,
        size: size
      )

      raise InsufficientStockError, "Insufficient stock at source branch" if from_record.quantity < quantity

      from_record.with_lock do
        from_record.quantity -= quantity
        from_record.save!
      end

      InventoryTransaction.create!(
        product: product,
        branch: from_branch,
        size: size,
        quantity: -quantity,
        source: self
      )

      to_record = InventoryRecord.lock.find_or_initialize_by(
        product: product,
        branch: to_branch,
        size: size
      )

      to_record.with_lock do
        to_record.quantity += quantity
        to_record.save!
      end

      InventoryTransaction.create!(
        product: product,
        branch: to_branch,
        size: size,
        quantity: quantity,
        source: self
      )
    end
  end

  def self.policy_class
    AdminPolicy
  end
end
