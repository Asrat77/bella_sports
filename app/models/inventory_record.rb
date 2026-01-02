class InventoryRecord < ApplicationRecord
  belongs_to :product
  belongs_to :branch, optional: true

  validates :size, presence: true
  validates :quantity, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :in_stock, -> { where("quantity > 0") }
  scope :out_of_stock, -> { where(quantity: 0) }
  scope :by_size, ->(size) { where(size: size) }
  scope :for_branch, ->(branch) { where(branch: branch) }
  scope :with_stock, -> { where("quantity > 0") }
end
