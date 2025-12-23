module Badgeable
  extend ActiveSupport::Concern

  included do
    has_many :product_badges, dependent: :destroy
  end

  def badge_types
    product_badges.pluck(:badge_type)
  end

  def add_badge!(type)
    product_badges.create!(badge_type: type) unless product_badges.exists?(badge_type: type)
  end

  def remove_badge!(type)
    product_badges.find_by(badge_type: type)&.destroy
  end
end
