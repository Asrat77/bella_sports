class Order < ApplicationRecord
  include Statusable

  belongs_to :branch, optional: true
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  has_one :order_status, dependent: :destroy

  validates :customer_name, presence: true
  validates :customer_phone, presence: true, format: { with: /\A\d{9}\z/ }
  validates :delivery_method, presence: true, inclusion: { in: %w[pickup delivery] }
  validates :tracking_code, presence: true, uniqueness: true

  before_create :generate_tracking_code
  before_save :calculate_totals

  scope :by_status, ->(status) { joins(:order_status).where(order_statuses: { status: status }) }
  scope :by_delivery_method, ->(method) { where(delivery_method: method) }
  scope :by_payment_status, ->(status) { where(payment_status: status) }
  scope :recent, -> { order(created_at: :desc) }

  def self.find_by_tracking(code)
    find_by(tracking_code: code)
  end

  def estimated_delivery_date
    case delivery_method
    when "pickup"
      created_at + 2.hours  # Ready for pickup in 2 hours
    when "delivery"
      created_at + 24.hours  # Door delivery in 24 hours
    else
      created_at + 24.hours
    end
  end

  def add_item(product:, size:, quantity: 1, customization: nil)
    customization_name = customization&.dig("name")
    customization_number = customization&.dig("number")

    item = order_items.find_or_initialize_by(
      product_snapshot: product_snapshot_for(product),
      size: size,
      customization_name: customization_name,
      customization_number: customization_number
    )

    item.quantity += quantity
    item.customization_price = product.customization_price if customization.present?
    item.unit_price = calculate_unit_price(product, customization.present?)
    item.line_total = item.unit_price * item.quantity

    item.save!
    item
  end

  def total_quantity
    order_items.sum(:quantity)
  end

  def can_update_status?(new_status, admin)
    # Business rules for status updates
    case new_status
    when "confirmed"
      status == "pending"
    when "delivered"
      status == "confirmed"
    when "cancelled"
      %w[pending confirmed].include?(status)
    else
      false
    end
  end

  private

  def generate_tracking_code
    loop do
      code = "BS-#{rand(1000..9999)}"
      break self.tracking_code = code unless Order.exists?(tracking_code: code)
    end
  end

  def calculate_totals
    self.subtotal = order_items.sum(&:line_total)
    self.total = subtotal + delivery_fee
  end

  def product_snapshot_for(product)
    {
      "id" => product.id,
      "name" => product.name,
      "price" => product.price,
      "image" => product.front_image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(product.front_image) : nil
    }
  end

  def calculate_unit_price(product, has_customization = false)
    has_customization ? product.price + product.customization_price : product.price
  end
end
