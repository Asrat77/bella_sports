class Branch < ApplicationRecord
  has_many :orders

  validates :name, presence: true
  validates :address, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(sort_order: :asc, name: :asc) }
end
