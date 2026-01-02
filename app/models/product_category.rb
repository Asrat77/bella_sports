class ProductCategory < ApplicationRecord
  has_many :products, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true

  scope :ordered, -> { order(:sort_order) }
  scope :by_age_group, ->(age_group) { where(age_group: age_group) }
  scope :by_product_type, ->(product_type) { where(product_type: product_type) }

  ADULT_SIZES = %w[S M L XL 2XL 3XL].freeze
  KIDS_SIZES = %w[16 18 20 22 24 26 28].freeze

  def valid_sizes
    (age_group == "ADULT") ? ADULT_SIZES : KIDS_SIZES
  end

  def adult?
    age_group == "ADULT"
  end

  def kids?
    age_group == "KIDS"
  end
end
