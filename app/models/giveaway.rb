class Giveaway < ApplicationRecord
  include InventoryManageable

  belongs_to :product
  belongs_to :created_by_admin, class_name: "Admin"

  validates :product, presence: true
  validates :size, presence: true
  validates :recipient_name, presence: true
  validates :reason, presence: true
  validates :quantity, presence: true, numericality: { greater_than: 0 }

  after_create :process_deduction

  STATUSES = %w[pending delivered].freeze

  scope :pending, -> { where(status: "pending") }
  scope :delivered, -> { where(status: "delivered") }
  scope :recent, -> { order(created_at: :desc).limit(10) }

  def process_deduction
    warehouse = Branch.find_by(name: "STORE")
    raise "STORE branch not found" unless warehouse

    deduct_inventory!(product, warehouse, size, quantity)
  end

  def mark_as_delivered!
    update!(status: "delivered")
  end

  def pending?
    status == "pending"
  end

  def delivered?
    status == "delivered"
  end
end
