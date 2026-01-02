class Product < ApplicationRecord
  include Badgeable
  include Inventoryable
  include Searchable

  belongs_to :club
  belongs_to :season
  belongs_to :kit_category
  belongs_to :kit_type, optional: true
  belongs_to :product_category

  has_one_attached :thumbnail_image
  has_one_attached :back_image
  has_many_attached :gallery_images

  has_many :order_items, dependent: :restrict_with_error
  has_many :inventory_records, dependent: :destroy
  has_many :giveaways, dependent: :restrict_with_error

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :club, presence: true
  validates :season, presence: true
  validates :kit_category, presence: true
  validates :product_category, presence: true

  validate :size_matches_age_group

  scope :active, -> { where(active: true) }
  scope :by_club, ->(club) { where(club: club) }
  scope :by_season, ->(season) { where(season: season) }
  scope :by_kit_category, ->(kit_category) { where(kit_category: kit_category) }
  scope :by_kit_type, ->(kit_type) { where(kit_type: kit_type) }
  scope :by_product_category, ->(product_category) { where(product_category: product_category) }

  delegate :name, to: :club, prefix: true
  delegate :name, to: :season, prefix: true
  delegate :name, to: :kit_category, prefix: true
  delegate :name, to: :kit_type, prefix: true, allow_nil: true
  delegate :name, to: :product_category, prefix: true
  delegate :age_group, to: :product_category, prefix: false

  def price_in_etb
    price / 100.0
  end

  def customization_price_in_etb
    customization_price / 100.0
  end

  def total_price_for_quantity(quantity = 1)
    price * quantity
  end

  def total_price_with_customization(quantity = 1)
    (price + customization_price) * quantity
  end

  def valid_sizes
    product_category.valid_sizes
  end

  def valid_size?(size)
    valid_sizes.include?(size.to_s)
  end

  private

  def size_matches_age_group
    return unless product_category && size.present?

    adult_sizes = ProductCategory::ADULT_SIZES
    kids_sizes = ProductCategory::KIDS_SIZES

    if product_category.age_group == "ADULT"
      errors.add(:size, "is not a valid adult size") unless adult_sizes.include?(size.to_s)
    elsif product_category.age_group == "KIDS"
      errors.add(:size, "is not a valid kids size") unless kids_sizes.include?(size.to_s)
    end
  end
end
