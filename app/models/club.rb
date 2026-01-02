class Club < ApplicationRecord
  has_many :products, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true
  validates :league, presence: true

  scope :active, -> { where(active: true) }
  scope :by_league, ->(league) { where(league: league) }
end
