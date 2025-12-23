class ApplicationSerializer < ActiveModel::Serializer
  # Default attributes
  attributes :id

  # Format datetime fields consistently
  def created_at
    object.created_at&.iso8601
  end

  def updated_at
    object.updated_at&.iso8601
  end

  # Helper to format price in ETB (stored as cents)
  def format_price(cents)
    return nil if cents.nil?
    (cents / 100.0).round(2)
  end
end
