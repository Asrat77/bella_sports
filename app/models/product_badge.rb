class ProductBadge < ApplicationRecord
  belongs_to :product

  validates :badge_type, presence: true, inclusion: { in: %w[new best_seller] }

  scope :by_type, ->(type) { where(badge_type: type) }
end
