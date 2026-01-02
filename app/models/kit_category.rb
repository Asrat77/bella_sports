class KitCategory < ApplicationRecord
  has_many :kit_types, dependent: :destroy
  has_many :products, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true

  scope :ordered, -> { order(:sort_order) }

  def has_kit_type_options?
    has_kit_types
  end
end
