class InventoryTransaction < ApplicationRecord
  belongs_to :product
  belongs_to :branch
  belongs_to :source, polymorphic: true

  validates :product, presence: true
  validates :branch, presence: true
  validates :size, presence: true
  validates :quantity, presence: true

  scope :by_product, ->(product) { where(product: product) }
  scope :by_branch, ->(branch) { where(branch: branch) }
  scope :by_source, ->(source_type, source_id) { where(source_type: source_type, source_id: source_id) }
  scope :additions, -> { where("quantity > 0") }
  scope :deductions, -> { where("quantity < 0") }

  def addition?
    quantity.positive?
  end

  def deduction?
    quantity.negative?
  end
end
