class KitType < ApplicationRecord
  belongs_to :kit_category

  has_many :products, dependent: :restrict_with_error

  validates :kit_category, presence: true
  validates :name, presence: true

  scope :ordered, -> { order(:sort_order) }

  delegate :has_kit_types?, to: :kit_category, prefix: false
end
