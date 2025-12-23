class OrderStatus < ApplicationRecord
  belongs_to :order
  belongs_to :creator, class_name: "Admin", optional: true

  validates :status, presence: true, inclusion: { in: %w[pending confirmed delivered cancelled] }

  scope :by_status, ->(status) { where(status: status) }
  scope :recent, -> { order(created_at: :desc) }
end
